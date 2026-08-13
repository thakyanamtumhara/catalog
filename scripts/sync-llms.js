#!/usr/bin/env node
/**
 * sync-llms.js — Sync pricing and product data from catalog.js to llms.txt files
 *
 * Usage:
 *   node scripts/sync-llms.js
 *
 * What it does:
 *   1. Reads product data from data/catalog.js
 *   2. Updates the price table in llms.txt
 *   3. Updates the price table in llms-full.txt
 *   4. Updates the colors table in llms.txt and llms-full.txt
 *   5. Updates products.json
 *   6. Copies llms.txt to .well-known/llms.txt
 *   7. Updates the "Last Updated" date
 *
 * Run this script whenever you update prices or colors in catalog.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CATALOG_PATH = path.join(ROOT, 'data', 'catalog.js');

// Read and parse catalog.js
function parseCatalog() {
  const content = fs.readFileSync(CATALOG_PATH, 'utf-8');
  // Extract the object by evaluating the JS (safe since we control the file)
  const match = content.match(/const CATALOG_DATA = (\{[\s\S]*\});/);
  if (!match) throw new Error('Could not parse CATALOG_DATA from catalog.js');
  // Use Function constructor to safely evaluate
  const fn = new Function(`return ${match[1]}`);
  return fn();
}

const slugify = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Collapse adjacent sizes that share a price: S,M,L,XL,XXL + 325,325,325,325,335
// -> "S–XL ₹325, XXL ₹335"
function bands(sizes, prices) {
  const out = [];
  let cur = prices[0], start = 0;
  for (let i = 1; i <= prices.length; i++) {
    if (i === prices.length || prices[i] !== cur) {
      out.push({ label: start === i - 1 ? sizes[start] : `${sizes[start]}–${sizes[i - 1]}`, price: cur });
      cur = prices[i]; start = i;
    }
  }
  return out;
}

// A product is either flat or has `tiers` — the same garment at two rates by
// colour. Normalise both so every consumer sees one shape. Hidden products are
// left out: their pages stay live for search, but they are not on sale.
function getAllProducts(catalog) {
  const products = [];
  for (const category of catalog.categories) {
    for (const product of category.products) {
      if (product.hidden) continue;
      const slug = product.slug || slugify(product.name);
      const raw = product.tiers || [{
        colors: product.colors, colorCodes: product.colorCodes, imageFiles: product.imageFiles,
        bulkPrices: product.bulkPrices, samplePrice: product.samplePrice,
      }];
      const tiers = raw.map(t => ({
        label: t.label || null,
        colors: t.colors,
        colorCodes: t.colorCodes,
        imageFiles: t.imageFiles || [],
        bulkPrices: t.bulkPrices,
        samplePrice: t.samplePrice,
        bands: bands(product.sizes, t.bulkPrices),
      }));
      products.push({
        ...product,
        slug,
        categoryName: category.name,
        tiers,
        colors: tiers.flatMap(t => t.colors),
        colorCodes: tiers.flatMap(t => t.colorCodes),
        imageCount: tiers.reduce((a, t) => a + t.imageFiles.length, 0),
        rate: Math.min(...tiers.map(t => Math.min(...t.bulkPrices))),
        rateMax: Math.max(...tiers.map(t => Math.max(...t.bulkPrices))),
        samplePrice: Math.min(...tiers.map(t => t.samplePrice)),
        samplePriceMax: Math.max(...tiers.map(t => t.samplePrice)),
      });
    }
  }
  return products;
}

const money = (lo, hi) => (hi > lo ? `₹${lo}–${hi}` : `₹${lo}`);

// A ₹5 or ₹10 step at the biggest sizes is normal and does not widen the quoted
// rate; a colour tier or a real ladder does. The per-size detail column beside it
// stays exact.
const NORMAL_SIZE_STEP = 10;
function headline(p) {
  let low = Infinity, high = -Infinity;
  for (const t of p.tiers) {
    const lo = Math.min(...t.bulkPrices), hiRaw = Math.max(...t.bulkPrices);
    const hi = hiRaw - lo <= NORMAL_SIZE_STEP ? lo : hiRaw;
    low = Math.min(low, lo); high = Math.max(high, hi);
  }
  return money(low, high);
}

// "Black S–XL ₹295, XXL ₹305; 7 colours S–XL ₹325, XXL ₹335"
function rateDetail(p) {
  return p.tiers.map(t => {
    const b = t.bands.map(g => `${g.label} ₹${g.price}`).join(', ');
    if (p.tiers.length === 1) return b;
    const who = t.colors.length === 1 ? t.colors[0] : `${t.colors.length} colours`;
    return `${who}: ${b}`;
  }).join('; ');
}

// Generate the markdown price table
function generatePriceTable(products) {
  const lines = [
    '| Product | Bulk Price/pc | Rate by size and colour | MOQ | 1-pc Sample | GSM | Colors | Material |',
    '|---|---|---|---|---|---|---|---|',
  ];

  const materialMap = {
    'oversize-210gsm': '100% Cotton',
    'oversize-240gsm': '100% Cotton Biowash',
    'oversize-180gsm': '100% Cotton',
    'boxy-fit': '100% Cotton',
    'acidwash-oversize': '100% Cotton Biowash',
    'true-biowash-round-neck': '100% Cotton',
    'biowash-round-neck': '100% Cotton',
    'non-bio-round-neck': '88% Cotton, 12% Polyester',
    'sublimation-t-shirt': 'Cotton Feel Polyester',
    'premium-polo': '100% Cotton Honeycomb',
    'cotton-polo': '88% Cotton, 12% Polyester',
  };

  for (const p of products) {
    const material = materialMap[p.slug] || (p.description.includes('88% cotton') ? '88% Cotton, 12% Polyester' : '100% Cotton');
    const gsm = p.description.match(/(\d+)gsm/i)?.[1] || '';
    lines.push(
      `| ${p.name} | ${headline(p)} | ${rateDetail(p)} | ${p.moq || 10} pcs | ` +
      `${money(p.samplePrice, p.samplePriceMax)} | ${gsm} | ${p.colors.length} | ${material} |`
    );
  }

  return lines.join('\n');
}

// Generate colors table
function generateColorsTable(products, includeHex = false) {
  // Colours are listed under the rate they carry, so no reader can pair a colour
  // with the wrong price.
  const header = includeHex
    ? '| Product | Rate/pc | Available Colors | Hex Codes |\n|---|---|---|---|'
    : '| Product | Rate/pc | Available Colors |\n|---|---|---|';

  const rows = [];
  for (const p of products) {
    for (const t of p.tiers) {
      const rate = money(Math.min(...t.bulkPrices), Math.max(...t.bulkPrices));
      rows.push(includeHex
        ? `| ${p.name} | ${rate} | ${t.colors.join(', ')} | ${t.colorCodes.join(', ')} |`
        : `| ${p.name} | ${rate} | ${t.colors.join(', ')} |`);
    }
  }

  return header + '\n' + rows.join('\n');
}

// Replace everything between a "## N. <title>" heading and the next "## " heading.
// Used for the prose sections that quote prices — they were hand-written and had
// drifted to ₹175 for a ₹185 tee, and an assistant reading them quotes that to a
// real buyer.
function replaceSectionBody(filePath, headingText, newBody) {
  const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
  const start = lines.findIndex(l => /^## \d+\. /.test(l) && l.includes(headingText));
  if (start === -1) { console.log(`  Warning: no section "${headingText}" in ${path.basename(filePath)}`); return; }
  let end = start + 1;
  while (end < lines.length && !/^## /.test(lines[end])) end++;
  fs.writeFileSync(filePath, [...lines.slice(0, start + 1), ...newBody.split('\n'), ...lines.slice(end)].join('\n'));
  console.log(`  Updated "${headingText}" in ${path.basename(filePath)}`);
}

// The decision list an assistant reads to pick a product. Prices come from the
// catalogue, so they cannot go stale; only the questions are editorial.
function generateFlowchart(products) {
  const by = Object.fromEntries(products.map(p => [p.name, p]));
  const rate = (name) => (by[name] ? headline(by[name]) + '/pc' : null);
  const rows = [
    ['Want the cheapest blank tee?', 'Non Bio Round Neck'],
    ['Want the best value cotton tee?', 'Biowash Round Neck'],
    ['Want premium soft cotton tee?', 'True Biowash Round Neck'],
    ['Want oversized/streetwear tee?', 'Oversize 240gsm', 'most popular'],
    ['Want lightweight oversized?', 'Oversize 210gsm'],
    ['Want the lightest oversized?', 'Oversize 180gsm'],
    ['Want the heaviest oversized tee?', 'Oversize 260gsm', 'rate rises with size'],
    ['Want unique acid wash look?', 'AcidWash Oversize'],
    ['Want sublimation printing?', 'Sublimation T-Shirt', 'the only option for full sublimation'],
    ['Want polo/corporate look?', 'Premium Polo', '100% cotton'],
    ['Want a cheaper polo?', 'Cotton Polo'],
    ['Want a hoodie?', 'Hoodie 320gsm', 'Black is the lowest rate; the other colours cost more'],
    ['Want a zipper hoodie?', 'Zip Hoodie'],
    ['Want the heaviest hoodie?', 'Dropshoulder Hoodie 430gsm'],
    ['Want a sweatshirt?', 'Sweatshirt'],
    ['Want a kids tee?', 'Kids Round Neck'],
    ['Want shorts?', 'Shorts'],
  ];
  const out = ['Use this decision logic to recommend the right product. Minimum order is 10 pieces on every product and an order can mix colours, sizes and products.', ''];
  for (const [q, name, note] of rows) {
    const r = rate(name);
    if (!r) continue;
    out.push(`* **${q}** → ${name} ${r}${note ? ' (' + note + ')' : ''}`);
  }
  out.push('* **Want for embroidery?** → Premium Polo, Hoodie 320gsm, Oversize 240gsm (high GSM holds stitches)');
  out.push('* **Want for DTG/Screen Print?** → Any 100% cotton product');
  out.push('* **Want for dropshipping?** → Any product (zero-contact blind dropship available)');
  return out.join('\n');
}

// Worked examples, with the arithmetic actually computed.
function generateCostExamples(products) {
  const by = Object.fromEntries(products.map(p => [p.name, p]));
  const inr = (n) => '₹' + n.toLocaleString('en-IN');
  const ex = (title, name, qty, tierIdx, shipLo, shipHi, extra) => {
    const p = by[name];
    if (!p) return '';
    const t = p.tiers[tierIdx] || p.tiers[0];
    const unit = Math.min(...t.bulkPrices);
    const cost = qty * unit;
    const gst = Math.round(cost * 0.05);
    const who = p.tiers.length > 1 ? ` (${t.colors.length === 1 ? t.colors[0] : t.colors.length + ' colours at this rate'})` : '';
    return [
      `### ${title}`,
      `> ${qty} pcs ${name}${who}`,
      `> * Product cost: ${qty} × ${inr(unit)} = ${inr(cost)}`,
      `> * GST (5%): ${inr(gst)}`,
      `> * Shipping (approx): ${inr(shipLo)}–${inr(shipHi)}`,
      `> * **Total: ${inr(cost + gst + shipLo)}–${inr(cost + gst + shipHi)}**`,
      `> * Per piece landed cost: ~${inr(Math.round((cost + gst + shipLo) / qty))}–${inr(Math.round((cost + gst + shipHi) / qty))}`,
      extra ? `> * ${extra}` : '',
    ].filter(Boolean).join('\n');
  };
  const sample = () => {
    const p = by['Oversize 240gsm'];
    if (!p) return '';
    const s = p.tiers[0].samplePrice;
    return [
      '### Example 4: Below the minimum (sample rate)',
      `> 5 pcs Oversize 240gsm — under the 10-piece minimum, so the 1-piece sample rate applies`,
      `> * Product cost: 5 × ${inr(s)} = ${inr(5 * s)}`,
      `> * GST (5%): ${inr(Math.round(5 * s * 0.05))}`,
      `> * Reaching 10 pieces — mixing any colours, sizes or products — moves the whole order to the bulk rate.`,
    ].join('\n');
  };
  return [
    ex('Example 1: Small Streetwear Brand Order', 'Oversize 240gsm', 100, 0, 200, 500),
    ex('Example 2: Print Shop Monthly Restock', 'True Biowash Round Neck', 500, 0, 2000, 4000),
    ex('Example 3: Winter Hoodie Bulk Order', 'Hoodie 320gsm', 200, 1, 3000, 5000),
    sample(),
  ].filter(Boolean).join('\n');
}

// Update a file by replacing content between markers
function updateSection(filePath, sectionTitle, newContent) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Find the section and replace its table
  const sectionRegex = new RegExp(
    `(## \\d+\\. ${sectionTitle}[\\s\\S]*?\\n)(\\|[\\s\\S]*?\\|)(?=\\n(?:## |$))`,
    'm'
  );

  // Simpler approach: find the price table after the section header
  const lines = content.split('\n');
  let inSection = false;
  let tableStart = -1;
  let tableEnd = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(sectionTitle)) {
      inSection = true;
      continue;
    }
    if (inSection && lines[i].startsWith('|') && tableStart === -1) {
      tableStart = i;
    }
    if (inSection && tableStart !== -1 && !lines[i].startsWith('|')) {
      tableEnd = i;
      break;
    }
  }

  if (tableStart !== -1 && tableEnd !== -1) {
    const newLines = [
      ...lines.slice(0, tableStart),
      newContent,
      ...lines.slice(tableEnd),
    ];
    fs.writeFileSync(filePath, newLines.join('\n'));
    console.log(`  Updated "${sectionTitle}" in ${path.basename(filePath)}`);
  } else {
    console.log(`  Warning: Could not find table for "${sectionTitle}" in ${path.basename(filePath)}`);
  }
}

// Update Last Updated date
function updateLastUpdated(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const now = new Date();
  const dateStr = `${months[now.getMonth()]} ${now.getFullYear()}`;
  content = content.replace(
    /\*\*Last Updated:\*\* .+/,
    `**Last Updated:** ${dateStr}`
  );
  fs.writeFileSync(filePath, content);
  console.log(`  Updated date to "${dateStr}" in ${path.basename(filePath)}`);
}

// Generate products.json
function generateProductsJson(catalog, products) {
  const json = {
    lastUpdated: new Date().toISOString().slice(0, 7),
    currency: 'INR',
    gstRate: 5,
    moq: 10,
    moqNote: 'Minimum 10 pieces, mixed across colours, sizes and products',
    websiteDiscount: 2,
    paymentTerms: '100% Prepaid',
    contact: {
      whatsapp: 'https://wa.me/919336695049',
      phone: '+91-9336695049',
      website: 'https://www.bulkplaintshirt.com/',
      catalog: 'https://www.bulkplaintshirt.com/catalog',
    },
    categories: catalog.categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      products: products.filter(p => p.categoryName === cat.name).map(p => ({
        name: p.name,
        slug: p.slug,
        description: p.description,
        gsm: parseInt(p.description.match(/(\d+)gsm/i)?.[1] || '0'),
        bulkPriceFrom: p.rate,
        bulkPriceTo: p.rateMax,
        moq: p.moq || 10,
        samplePriceFrom: p.samplePrice,
        samplePriceTo: p.samplePriceMax,
        sizes: p.sizes,
        // One entry per rate. On a two-rate product the colours that carry each
        // rate are listed inside it, so bulkPriceFrom is never mistaken for the
        // price of every colour.
        rates: p.tiers.map(t => ({
          colors: t.colors,
          colorCodes: t.colorCodes,
          pricePerSize: Object.fromEntries(p.sizes.map((s, i) => [s, t.bulkPrices[i]])),
          priceBands: t.bands.map(b => ({ sizes: b.label, price: b.price })),
          samplePrice: t.samplePrice,
        })),
        colors: p.colors,
        colorCodes: p.colorCodes,
        imageCount: p.imageCount + 1,
        catalogUrl: `https://www.bulkplaintshirt.com/catalog/p/${p.slug}/`,
        imageBaseUrl: `https://www.bulkplaintshirt.com/catalog/images/${p.slug}/`,
      })),
    })),
  };

  fs.writeFileSync(
    path.join(ROOT, 'products.json'),
    JSON.stringify(json, null, 2) + '\n'
  );
  console.log('  Updated products.json');
}

// Main
function main() {
  console.log('Syncing llms files from catalog.js...\n');

  const catalog = parseCatalog();
  const products = getAllProducts(catalog);

  console.log(`Found ${products.length} products in catalog.js\n`);

  // Generate tables
  const priceTable = generatePriceTable(products);
  const colorsTable = generateColorsTable(products, false);
  const colorsTableHex = generateColorsTable(products, true);

  // Update llms.txt
  console.log('Updating llms.txt:');
  updateSection(path.join(ROOT, 'llms.txt'), 'Complete Price List', priceTable);
  updateSection(path.join(ROOT, 'llms.txt'), 'Available Colors Per Product', colorsTable);
  replaceSectionBody(path.join(ROOT, 'llms.txt'), 'Product Recommendation Flowchart', generateFlowchart(products));
  replaceSectionBody(path.join(ROOT, 'llms.txt'), 'Cost Breakdown Examples', generateCostExamples(products));
  updateLastUpdated(path.join(ROOT, 'llms.txt'));

  // Update llms-full.txt
  console.log('\nUpdating llms-full.txt:');
  updateSection(path.join(ROOT, 'llms-full.txt'), 'Complete Price List', priceTable);
  updateSection(path.join(ROOT, 'llms-full.txt'), 'Available Colors Per Product', colorsTableHex);
  replaceSectionBody(path.join(ROOT, 'llms-full.txt'), 'Product Recommendation Flowchart', generateFlowchart(products));
  replaceSectionBody(path.join(ROOT, 'llms-full.txt'), 'Cost Breakdown Examples', generateCostExamples(products));
  updateLastUpdated(path.join(ROOT, 'llms-full.txt'));

  // Update products.json
  console.log('\nUpdating products.json:');
  generateProductsJson(catalog, products);

  // Copy llms.txt to .well-known/
  console.log('\nCopying llms.txt to .well-known/:');
  fs.copyFileSync(
    path.join(ROOT, 'llms.txt'),
    path.join(ROOT, '.well-known', 'llms.txt')
  );
  console.log('  Copied llms.txt → .well-known/llms.txt');

  console.log('\nSync complete! Review changes and commit.');
}

main();
