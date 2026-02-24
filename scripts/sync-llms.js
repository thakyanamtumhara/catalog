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

// Get all products flattened
function getAllProducts(catalog) {
  const products = [];
  for (const category of catalog.categories) {
    for (const product of category.products) {
      products.push({ ...product, categoryName: category.name });
    }
  }
  return products;
}

// Generate the markdown price table
function generatePriceTable(products) {
  const lines = [
    '| Product | Bulk Price | Sample Price | GSM | Colors | Material |',
    '|---|---|---|---|---|---|',
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
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
    const material = materialMap[slug] || (p.description.includes('88% cotton') ? '88% Cotton, 12% Polyester' : '100% Cotton');
    const gsm = p.description.match(/(\d+)gsm/i)?.[1] || '';
    lines.push(
      `| ${p.name} | ₹${p.rate}/pc | ₹${p.samplePrice}/pc | ${gsm} | ${p.colors.length} | ${material} |`
    );
  }

  return lines.join('\n');
}

// Generate colors table
function generateColorsTable(products, includeHex = false) {
  const header = includeHex
    ? '| Product | Available Colors | Hex Codes |\n|---|---|---|'
    : '| Product | Available Colors |\n|---|---|';

  const rows = products.map(p => {
    if (includeHex) {
      return `| ${p.name} | ${p.colors.join(', ')} | ${p.colorCodes.map(c => c.replace('#', '#')).join(', ')} |`;
    }
    return `| ${p.name} | ${p.colors.join(', ')} |`;
  });

  return header + '\n' + rows.join('\n');
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
      products: cat.products.map(p => {
        const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
        return {
          name: p.name,
          slug,
          description: p.description,
          gsm: parseInt(p.description.match(/(\d+)gsm/i)?.[1] || '0'),
          bulkPrice: p.rate,
          samplePrice: p.samplePrice,
          weightKg: p.weight,
          colors: p.colors,
          colorCodes: p.colorCodes,
          sizes: p.sizes,
          imageCount: (p.imageFiles?.length || 0) + 1,
          catalogUrl: `https://www.bulkplaintshirt.com/catalog/p/${slug}/`,
          imageBaseUrl: `https://www.bulkplaintshirt.com/catalog/images/${slug}/`,
        };
      }),
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
  updateLastUpdated(path.join(ROOT, 'llms.txt'));

  // Update llms-full.txt
  console.log('\nUpdating llms-full.txt:');
  updateSection(path.join(ROOT, 'llms-full.txt'), 'Complete Price List', priceTable);
  updateSection(path.join(ROOT, 'llms-full.txt'), 'Available Colors Per Product', colorsTableHex);
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
