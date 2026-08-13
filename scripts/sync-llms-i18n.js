#!/usr/bin/env node
/**
 * sync-llms-i18n.js — refresh the Hindi and Tamil price tables from catalog.js
 *
 * llms-hi.txt and llms-ta.txt carry their own hand-written price tables, which
 * had drifted badly (Oversize 240gsm quoted at ₹180 when it is ₹190, Non Bio at
 * ₹102 when it is ₹105) and still listed products that are merged or hidden.
 * These files are what Hindi- and Tamil-speaking assistants read, so a stale row
 * here is a wrong quote to a real buyer.
 *
 * Rows are matched on the localised product name, so the surrounding prose,
 * section headings and column order stay exactly as written.
 *
 *   node scripts/sync-llms-i18n.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const slugify = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function catalog() {
  const src = fs.readFileSync(path.join(ROOT, 'data', 'catalog.js'), 'utf-8');
  return new Function(`return ${src.match(/const CATALOG_DATA = (\{[\s\S]*\});/)[1]}`)();
}

const products = {};
for (const cat of catalog().categories) {
  for (const p of cat.products) {
    if (p.hidden) continue;
    const tiers = p.tiers || [{ colors: p.colors, bulkPrices: p.bulkPrices, samplePrice: p.samplePrice }];
    const all = tiers.flatMap(t => t.bulkPrices);
    products[p.name] = {
      slug: p.slug || slugify(p.name),
      colors: tiers.reduce((a, t) => a + t.colors.length, 0),
      rate: Math.min(...all),
      rateMax: Math.max(...all),
      sample: Math.min(...tiers.map(t => t.samplePrice)),
      sampleMax: Math.max(...tiers.map(t => t.samplePrice)),
      moq: p.moq || 10,
    };
  }
}

// localised row name -> English product name, or null to drop the row
// (merged into another product, or hidden from the catalogue)
const MAP = {
  'llms-hi.txt': {
    unit: '/पीस', colourWord: ' रंग',
    rows: {
      'ओवरसाइज़ 210gsm': 'Oversize 210gsm',
      'ओवरसाइज़ 240gsm': 'Oversize 240gsm',
      'ओवरसाइज़ 260gsm': 'Oversize 260gsm',
      'ओवरसाइज़ 180gsm': 'Oversize 180gsm',
      'बॉक्सी फिट': null,
      'एसिडवॉश ओवरसाइज़': 'AcidWash Oversize',
      'ट्रू बायोवॉश राउंड नेक': 'True Biowash Round Neck',
      'बायोवॉश राउंड नेक': 'Biowash Round Neck',
      'नॉन बायो राउंड नेक': 'Non Bio Round Neck',
      'सब्लिमेशन टी-शर्ट': 'Sublimation T-Shirt',
      'प्रीमियम पोलो': 'Premium Polo',
      'कॉटन पोलो': 'Cotton Polo',
      'ज़िप हुडी': 'Zip Hoodie',
      'हुडी 320gsm (ब्लैक)': null,
      'हुडी 320gsm': 'Hoodie 320gsm',
      'ड्रॉपशोल्डर हुडी 430gsm': 'Dropshoulder Hoodie 430gsm',
      'हुडी 430gsm': null,
      'स्वेटशर्ट': 'Sweatshirt',
      'स्वेटशर्ट 2': null,
      'वार्सिटी जैकेट': null,
      'किड्स राउंड नेक': 'Kids Round Neck',
      'शॉर्ट्स': 'Shorts',
    },
  },
  'llms-ta.txt': {
    unit: '/பீஸ்', colourWord: '',
    rows: {
      'ஓவர்சைஸ் 210gsm': 'Oversize 210gsm',
      'ஓவர்சைஸ் 240gsm': 'Oversize 240gsm',
      'ஓவர்சைஸ் 260gsm': 'Oversize 260gsm',
      'ஓவர்சைஸ் 180gsm': 'Oversize 180gsm',
      'பாக்ஸி ஃபிட்': null,
      'ஆசிட்வாஷ் ஓவர்சைஸ்': 'AcidWash Oversize',
      'ட்ரூ பயோவாஷ் ரவுண்ட் நெக்': 'True Biowash Round Neck',
      'பயோவாஷ் ரவுண்ட் நெக்': 'Biowash Round Neck',
      'நான் பயோ ரவுண்ட் நெக்': 'Non Bio Round Neck',
      'சப்ளிமேஷன் டி-ஷர்ட்': 'Sublimation T-Shirt',
      'பிரீமியம் போலோ': 'Premium Polo',
      'காட்டன் போலோ': 'Cotton Polo',
      'ஜிப் ஹுடி': 'Zip Hoodie',
      'ஹுடி 320gsm (கருப்பு)': null,
      'ஹுடி 320gsm': 'Hoodie 320gsm',
      'ட்ராப்ஷோல்டர் ஹுடி 430gsm': 'Dropshoulder Hoodie 430gsm',
      'ஹுடி 430gsm': null,
      'ஸ்வெட்ஷர்ட்': 'Sweatshirt',
      'வார்சிட்டி ஜாக்கெட்': null,
      'குழந்தைகள் ரவுண்ட் நெக்': 'Kids Round Neck',
      'ஷார்ட்ஸ்': 'Shorts',
    },
  },
};

let exitCode = 0;
for (const [file, cfg] of Object.entries(MAP)) {
  const p = path.join(ROOT, file);
  const lines = fs.readFileSync(p, 'utf-8').split('\n');
  const out = [];
  let updated = 0, dropped = 0;
  const seen = new Set();

  for (const line of lines) {
    const m = line.match(/^\|\s*([^|]+?)\s*\|/);
    const key = m && Object.prototype.hasOwnProperty.call(cfg.rows, m[1]) ? m[1] : null;
    if (!key) { out.push(line); continue; }
    seen.add(key);
    const name = cfg.rows[key];
    if (name === null) { dropped++; continue; }
    const d = products[name];
    if (!d) { console.log(`  ! ${file}: no product data for "${name}"`); exitCode = 1; out.push(line); continue; }

    const cells = line.split('|');
    // | name | bulk | sample | gsm | colours | material |
    const money = (lo, hi) => (hi > lo ? `₹${lo}–${hi}${cfg.unit}` : `₹${lo}${cfg.unit}`);
    cells[2] = ` ${money(d.rate, d.rateMax)} `;
    cells[3] = ` ${money(d.sample, d.sampleMax)} `;
    cells[5] = ` ${d.colors}${cfg.colourWord} `;
    out.push(cells.join('|'));
    updated++;
  }

  // Rows mapped to null are meant to disappear, so a second run finding them
  // gone is the expected outcome, not a problem. Only a missing live product
  // means the map has fallen out of date.
  for (const [k, v] of Object.entries(cfg.rows)) {
    if (v !== null && !seen.has(k)) { console.log(`  ! ${file}: row "${k}" not found — map is out of date`); exitCode = 1; }
  }
  fs.writeFileSync(p, out.join('\n'));
  console.log(`${file}: ${updated} rows refreshed, ${dropped} removed`);
}

process.exit(exitCode);
