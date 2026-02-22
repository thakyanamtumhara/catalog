#!/usr/bin/env node
// Generates individual product pages at /p/{slug}/index.html
// Run: node generate-pages.js

var fs = require('fs');
var path = require('path');

// Load catalog data
var catalogJs = fs.readFileSync(path.join(__dirname, 'data/catalog.js'), 'utf8');
var dataMatch = catalogJs.match(/const CATALOG_DATA\s*=\s*(\{[\s\S]*\});?\s*$/);
if (!dataMatch) { console.error('Could not parse catalog data'); process.exit(1); }
var CATALOG_DATA = eval('(' + dataMatch[1] + ')');

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function esc(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Collect all products
var products = [];
CATALOG_DATA.categories.forEach(function (cat) {
  cat.products.forEach(function (product, idx) {
    products.push({
      id: cat.id + '-' + idx,
      slug: slugify(product.name),
      name: product.name,
      nickname: product.nickname,
      description: product.description,
      rate: product.rate,
      samplePrice: product.samplePrice,
      weight: product.weight,
      colors: product.colors,
      colorCodes: product.colorCodes,
      sizes: product.sizes,
      images: product.images || [],
      categoryName: cat.name
    });
  });
});

// Ensure /p/ directory exists
var pDir = path.join(__dirname, 'p');
if (!fs.existsSync(pDir)) fs.mkdirSync(pDir);

products.forEach(function (p) {
  var dir = path.join(pDir, p.slug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  var title = p.name + ' (' + p.nickname + ') — sale91.com Catalog';
  var desc = p.description + '. \u20B9' + p.rate + '/pc bulk. ' +
    p.colors.length + ' colors. Sizes: ' + p.sizes.join(', ') +
    '. Premium blank apparel at wholesale prices from sale91.com';
  var ogImage = p.images[0] || '';
  var canonicalUrl = 'https://thakyanamtumhara.github.io/catalog/p/' + p.slug + '/';

  // JSON-LD structured data
  var jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": p.name + ' (' + p.nickname + ')',
    "description": p.description,
    "brand": { "@type": "Brand", "name": "sale91.com" },
    "category": p.categoryName,
    "weight": { "@type": "QuantitativeValue", "value": p.weight, "unitCode": "KGM" },
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": p.rate,
      "highPrice": p.samplePrice,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "offerCount": p.sizes.length
    }
  };
  if (ogImage) jsonLd.image = ogImage;

  var html = '<!DOCTYPE html>\n' +
'<html lang="en">\n' +
'<head>\n' +
'  <meta charset="UTF-8">\n' +
'  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
'  <title>' + esc(title) + '</title>\n' +
'  <meta name="description" content="' + esc(desc) + '">\n' +
'  <link rel="canonical" href="' + canonicalUrl + '">\n' +
'\n' +
'  <!-- Open Graph / WhatsApp -->\n' +
'  <meta property="og:type" content="product">\n' +
'  <meta property="og:site_name" content="sale91.com">\n' +
'  <meta property="og:title" content="' + esc(title) + '">\n' +
'  <meta property="og:description" content="' + esc(desc) + '">\n' +
'  <meta property="og:url" content="' + canonicalUrl + '">\n' +
(ogImage ? '  <meta property="og:image" content="' + ogImage + '">\n' : '') +
'\n' +
'  <!-- JSON-LD Structured Data -->\n' +
'  <script type="application/ld+json">' + JSON.stringify(jsonLd) + '</script>\n' +
'\n' +
'  <link rel="stylesheet" href="../../css/style.css">\n' +
'</head>\n' +
'<body>\n' +
'\n' +
'  <!-- Header -->\n' +
'  <header class="site-header">\n' +
'    <div class="header-content">\n' +
'      <div>\n' +
'        <a href="../../" style="color:inherit;text-decoration:none;">\n' +
'          <div class="site-logo">sale<span>91</span>.com</div>\n' +
'          <div class="site-tagline">Premium Blank Apparel Catalog</div>\n' +
'        </a>\n' +
'      </div>\n' +
'    </div>\n' +
'  </header>\n' +
'\n' +
'  <!-- Category Tabs -->\n' +
'  <div class="category-tabs" id="categoryTabs"></div>\n' +
'\n' +
'  <!-- Main Content -->\n' +
'  <main class="main-content">\n' +
'    <div class="product-grid" id="productGrid"></div>\n' +
'  </main>\n' +
'\n' +
'  <!-- Product Detail Modal -->\n' +
'  <div class="modal-overlay" id="modalOverlay">\n' +
'    <div class="modal-container">\n' +
'      <button class="modal-close" id="modalClose" aria-label="Close">&times;</button>\n' +
'      <div class="modal-body" id="modalBody"></div>\n' +
'      <div class="modal-suggestions" id="modalSuggestions"></div>\n' +
'    </div>\n' +
'  </div>\n' +
'\n' +
'  <!-- Footer -->\n' +
'  <footer class="site-footer">\n' +
'    &copy; 2026 <a href="https://sale91.com">sale91.com</a>. All rights reserved.\n' +
'  </footer>\n' +
'\n' +
'  <!-- Product Page Config -->\n' +
'  <script>var PRODUCT_PAGE = { id: "' + p.id + '", baseUrl: "../../" };</script>\n' +
'\n' +
'  <script src="../../data/catalog.js"></script>\n' +
'  <script src="../../js/main.js"></script>\n' +
'  <script>renderAllProducts();</script>\n' +
'</body>\n' +
'</html>\n';

  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log('Generated: p/' + p.slug + '/index.html');
});

console.log('\nDone! Generated ' + products.length + ' product pages.');
