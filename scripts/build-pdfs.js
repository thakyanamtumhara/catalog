#!/usr/bin/env node
// One no-rate catalogue PDF per product -> out/pdf/<slug>.pdf + out/pdf/index.json.
// The catalog-pdfs workflow uploads them to /catalog/pdf/ (the clone sends them as WhatsApp documents).
// Same layout code as the /catalog/my-catalog/ page (js/own-catalog-pdf.js), so both always match.
// Needs: npm install --no-save pdf-lib@1.17.1 sharp@0.33.5
// Test locally with SITE_DIR=<folder with ph/ and catalog/> to read images from disk.

var fs = require('fs');
var path = require('path');
var PDFLib = require('pdf-lib');
var sharp = require('sharp');
var Core = require('../js/own-catalog-pdf.js');

var ROOT = path.join(__dirname, '..');
var SITE = process.env.SITE || 'https://www.bulkplaintshirt.com';
var OUT = process.env.OUT || path.join(ROOT, 'out', 'pdf');
var SITE_DIR = process.env.SITE_DIR || '';
var ONLY = (process.env.ONLY || '').split(',').filter(Boolean);

function loadCatalog() {
  var src = fs.readFileSync(path.join(ROOT, 'data/catalog.js'), 'utf8');
  var m = src.match(/const CATALOG_DATA\s*=\s*(\{[\s\S]*\});?\s*$/);
  if (!m) throw new Error('Could not parse data/catalog.js');
  return eval('(' + m[1] + ')');
}

function loadCharts() {
  var src = fs.readFileSync(path.join(ROOT, 'js/main.js'), 'utf8');
  var m = src.match(/var SIZE_CHARTS = (\{[\s\S]*?\n\});/);
  if (!m) throw new Error('Could not find SIZE_CHARTS in js/main.js');
  return eval('(' + m[1] + ')');
}

async function fetchText(url) {
  var r = await fetch(url, { headers: { 'cache-control': 'no-cache' } });
  if (!r.ok) throw new Error(url + ' -> HTTP ' + r.status);
  return r.text();
}

async function loadLive() {
  var stamp = Date.now();
  var pcSrc = await fetchText(SITE + '/pc.js?t=' + stamp);
  var tbl = new Function(pcSrc + '\n;return typeof tbl !== "undefined" ? tbl : null;')();
  if (!tbl || !tbl[0] || typeof tbl[0] !== 'object') throw new Error('pc.js has no colour table');
  var phSrc = await fetchText(SITE + '/phphotos.js?t=' + stamp);
  var w = {};
  new Function('window', phSrc)(w);
  if (!w.PH_PHOTOS) throw new Error('phphotos.js has no PH_PHOTOS');
  return { tbl0: tbl[0], photos: w.PH_PHOTOS };
}

async function readImage(url) {
  var buf;
  if (SITE_DIR) {
    var file = path.join(SITE_DIR, url.split('?')[0]);
    if (!fs.existsSync(file)) return null;
    buf = fs.readFileSync(file);
  } else {
    var r = await fetch(SITE + url);
    if (!r.ok) return null;
    buf = Buffer.from(await r.arrayBuffer());
  }
  var raw = await sharp(buf).flatten({ background: '#ffffff' }).raw().toBuffer({ resolveWithObject: true });
  var box = Core.trimBox(raw.data, raw.info.width, raw.info.height, raw.info.channels);
  var res = await sharp(buf)
    .flatten({ background: '#ffffff' })
    .extract({ left: box.x, top: box.y, width: box.w, height: box.h })
    .resize({ width: 600, height: 600, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer({ resolveWithObject: true });
  return { bytes: new Uint8Array(res.data), w: res.info.width, h: res.info.height };
}

async function mapLimit(items, limit, fn) {
  var out = new Array(items.length), next = 0;
  async function worker() {
    while (next < items.length) {
      var i = next++;
      out[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

async function main() {
  var catalog = loadCatalog();
  var charts = loadCharts();
  var live = await loadLive();
  var products = Core.collect(catalog, live, ONLY.length ? ONLY : null);
  if (!products.length) throw new Error('No products to build');
  fs.mkdirSync(OUT, { recursive: true });
  var index = [];
  for (var i = 0; i < products.length; i++) {
    var p = products[i];
    p.heroImg = await readImage(p.hero);
    var imgs = await mapLimit(p.photos, 6, function (ph) { return readImage(ph.url); });
    p.photos.forEach(function (ph, k) { ph.img = imgs[k]; });
    var missing = imgs.filter(function (x) { return !x; }).length;
    if (missing > p.photos.length / 2) throw new Error(p.slug + ': ' + missing + ' of ' + p.photos.length + ' photos missing');
    var bytes = await Core.buildPdf(PDFLib, { products: [p], charts: charts });
    var file = p.slug + '.pdf';
    fs.writeFileSync(path.join(OUT, file), bytes);
    index.push({
      slug: p.slug,
      name: p.name,
      file: file,
      filename: p.name + '.pdf',
      bytes: bytes.length,
      colours: p.colours.map(function (c) { return c.name; }),
      photos: p.photos.length - missing
    });
    console.log(file + '  ' + Math.round(bytes.length / 1024) + ' KB  ' + p.colours.length + ' colours  ' + (p.photos.length - missing) + ' photos' + (missing ? '  (' + missing + ' missing)' : ''));
  }
  fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify({ builtAt: new Date().toISOString(), products: index }, null, 1));
  console.log('Done: ' + index.length + ' PDFs in ' + OUT);
}

main().catch(function (err) {
  console.error(err && err.stack || err);
  process.exit(1);
});
