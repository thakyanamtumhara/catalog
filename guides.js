// Product guide pages: long-form pages for one GSM / product family, served from the blog path
// (/p/...) because that URL already ranks, but built from the SAME catalog data as the product
// pages so a rate, colour or size change reaches the guide on the next generate. Ketu 17-Oct-2026:
// "4 to 5 real product pages a month" instead of the auto-blog. Output is deterministic (the date
// lives in the guide config, never Date.now()) because CI re-runs the generator and diffs it.
var fs = require('fs');
var path = require('path');

var HOST = 'https://www.bulkplaintshirt.com';
var WA = 'https://api.whatsapp.com/send/?phone=919336695049&text=';
var PHONE_DISPLAY = '+91 93366 95049';
var GODOWN = 'F-120, Shutter Wali Gali, Near Gujjar Chowk, Khanpur, New Delhi 110062';
var HOURS = 'Mon–Sat 10 am–6 pm, Sun 12–4 pm';
var GSTIN = '07BBNPG0866M2Z7';
var BUS_STATES = 'Bihar, Chandigarh, Haryana, Himachal Pradesh, J&K, Madhya Pradesh, Punjab, Rajasthan, Uttar Pradesh and Uttarakhand';

var GUIDES = [
  {
    out: 'p/Dropshoulders.html',
    updated: '2026-10-17',
    main: 'oversize-240gsm',
    gsm: 240,
    compare: ['oversize-180gsm', 'oversize-210gsm', 'oversize-240gsm', 'acidwash-oversize', 'oversize-260gsm', 'shorts'],
    photos: [[15, 'Black'], [4, 'White'], [17, 'Off-white'], [12, 'Beige'], [3, 'Rose Pink'], [6, 'Powder Blue'],
             [11, 'Lavender'], [8, 'Brown'], [20, 'Red'], [23, 'Maroon'], [24, 'Army Green'], [27, 'Charcoal']],
    video: { src: '/ph/vid/oversize-240gsm-royalblue-navy.mp4', poster: '/ph/vid/oversize-240gsm-royalblue-navy.jpg', label: 'Royal Blue and Navy' },
    related: [
      ['/p/dtf-vs-screen-print-vs-embroidery-real-cost-breakdown-on.html', 'DTF vs screen print vs embroidery: real cost on a ₹500 T-shirt'],
      ['/p/index.html', 'All buyer guides']
    ]
  },
  {
    kind: 'sublimation',
    out: 'p/sublimation-t-shirts-wholesale.html',
    updated: '2026-10-23',
    main: 'sublimation-t-shirt',
    crumb: 'Sublimation T-shirts',
    linkText: 'Read the full sublimation T-shirt buyer guide: how sublimation works, size chart, prices and delivery',
    compare: ['sublimation-t-shirt', 'true-biowash-round-neck', 'biowash-round-neck'],
    photos: [[1, 'White, front'], [2, 'White, side'], [3, 'Back and shoulder'], [4, 'Sleeve'], [5, 'Fabric close-up'], [6, 'After sublimation printing']],
    video: { src: '/ph/vid/sublimation.mp4', poster: '/ph/vid/sublimation.jpg', label: 'The sublimation T-shirt' },
    related: [
      ['/p/Dropshoulders.html', '240 GSM drop-shoulder T-shirts: buyer guide'],
      ['/p/index.html', 'All buyer guides']
    ]
  },
  {
    kind: 'hoodie',
    out: 'p/plainhoodie.html',
    updated: '2026-10-24',
    main: 'hoodie-320gsm',
    crumb: 'Plain hoodies wholesale',
    h1: 'Plain Hoodies Wholesale in India',
    titleLead: 'Plain Hoodies Wholesale India',
    titleGsm: true,
    descLead: 'Blank plain hoodies wholesale',
    faqName: 'a plain hoodie',
    tab: 'Hoodie 320gsm',
    wa: 'Hi, I want plain hoodies',
    linkText: 'Read the full plain hoodie buyer guide: prices by colour, size chart, 320 vs 430 GSM and delivery',
    compare: ['hoodie-320gsm', 'hoodie-430gsm', 'zip-hoodie', 'sweatshirt'],
    photos: [['hoodie-320gsm-black', 1, 'Black'], ['hoodie-320gsm', 20, 'White'], ['hoodie-320gsm', 17, 'Navy'], ['hoodie-320gsm', 23, 'Grey'],
             ['hoodie-320gsm', 5, 'Off-white'], ['hoodie-320gsm', 9, 'Red'], ['hoodie-320gsm', 12, 'Army Green'], ['hoodie-320gsm', 24, 'Maroon']],
    video: { src: '/ph/vid/hoodie-320gsm-black-v2.mp4', poster: '/ph/vid/hoodie-320gsm-black-v2.jpg', label: 'The Black hoodie' },
    related: [
      ['/p/430gsm-dropshoulder-hoodie.html', '430 GSM drop-shoulder hoodies: buyer guide'],
      ['/p/Dropshoulders.html', '240 GSM drop-shoulder T-shirts: buyer guide'],
      ['/p/index.html', 'All buyer guides']
    ]
  },
  {
    kind: 'hoodie',
    out: 'p/430gsm-dropshoulder-hoodie.html',
    updated: '2026-10-24',
    main: 'hoodie-430gsm',
    crumb: '430 GSM drop-shoulder hoodies',
    h1: '430 GSM Drop-Shoulder Hoodies: Wholesale in India',
    titleLead: '430 GSM Drop-Shoulder Hoodies Wholesale India',
    descLead: 'Drop-shoulder hoodies wholesale',
    faqName: 'a 430 GSM drop-shoulder hoodie',
    tab: 'Hoodie 430gsm',
    wa: 'Hi, I want 430 GSM drop-shoulder hoodies',
    linkText: 'Read the full 430 GSM drop-shoulder hoodie buyer guide: prices by colour, size chart, 430 vs 320 GSM and delivery',
    compare: ['hoodie-320gsm', 'hoodie-430gsm', 'zip-hoodie', 'sweatshirt'],
    photos: [['dropshoulder-hoodie-430gsm', 1, 'Black'], ['dropshoulder-hoodie-430gsm', 10, 'Black, side'], ['dropshoulder-hoodie-430gsm', 11, 'Black, back'],
             ['hoodie-430gsm', 6, 'Navy'], ['hoodie-430gsm', 8, 'Navy, back'], ['hoodie-430gsm', 12, 'White'], ['hoodie-430gsm', 1, 'Off-white'],
             ['hoodie-430gsm', 4, 'Off-white, hood up']],
    video: { src: '/ph/vid/hoodie-430gsm-black-v2.mp4', poster: '/ph/vid/hoodie-430gsm-black-v2.jpg', label: 'The Black 430 GSM hoodie' },
    related: [
      ['/p/plainhoodie.html', 'Plain hoodies wholesale: buyer guide'],
      ['/p/Dropshoulders.html', '240 GSM drop-shoulder T-shirts: buyer guide'],
      ['/p/index.html', 'All buyer guides']
    ]
  }
];

function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function rs(n) { return '₹' + n; }
function range(lo, hi) { return lo === hi ? rs(lo) : rs(lo) + '–' + hi; }
function sizeSpan(sizes) { return sizes.length > 1 ? sizes[0] + '–' + sizes[sizes.length - 1] : sizes[0]; }
function gsmOf(p) { var m = (p.description + ' ' + p.name).match(/(\d{3})\s*gsm/i); return m ? +m[1] : null; }
function prettyDate(iso) {
  var M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var d = iso.split('-');
  return (+d[2]) + ' ' + M[+d[1] - 1] + ' ' + d[0];
}
function sameAllSizes(p) { return p.rate === p.rateMax; }

function priceLine(p) {
  return sameAllSizes(p) ? rs(p.rate) + '/pc' : range(p.rate, p.rateMax) + '/pc by size';
}

function sizeChartTable(chart, sep) {
  if (!chart) return '';
  var head = '<tr><th>Size</th>' + chart.sizes.map(function (s) { return '<th>' + esc(s) + '</th>'; }).join('') + '</tr>';
  var rows = chart.rows.map(function (r) {
    return '<tr><th>' + esc(r.label) + '</th>' + r.values.map(function (v) { return '<td>' + v + '</td>'; }).join('') + '</tr>';
  }).join('');
  return '<div class="tbl"><table class="sz"><caption>' + esc(chart.title) + (sep || ' — ') + 'measurements in inches</caption>' + head + rows + '</table></div>';
}

function compareTable(list, mainSlug) {
  var rows = list.map(function (p) {
    var g = gsmOf(p);
    var fit = /short/i.test(p.name) ? 'Shorts' : /acid/i.test(p.name) ? 'Oversized, acid wash' : 'Oversized drop-shoulder';
    var cls = p.slug === mainSlug ? ' class="here"' : '';
    return '<tr' + cls + '><td><a href="/catalog/p/' + p.slug + '/">' + esc(p.name) + '</a></td><td>' + (g || '') + '</td><td>' + esc(fit) +
      '</td><td>' + esc(priceLine(p)) + '</td><td>' + esc(range(p.samplePrice, p.samplePriceMax)) + '</td><td>' + p.colors.length +
      '</td><td>' + esc(sizeSpan(p.sizes)) + '</td></tr>';
  }).join('');
  return '<div class="tbl"><table class="cmp"><tr><th>Product</th><th>GSM</th><th>Fit</th><th>Bulk price</th><th>1 sample</th><th>Colours</th><th>Sizes</th></tr>' + rows + '</table></div>';
}

function faqList(g, p, bySlug) {
  var heavy = bySlug['oversize-260gsm'];
  var acid = bySlug['acidwash-oversize'];
  var shorts = bySlug['shorts'];
  var f = [
    ['What is the wholesale price of a 240 GSM T-shirt?',
     'Our ' + p.name + ' drop-shoulder T-shirt is ' + rs(p.rate) + ' per piece for 10 pieces or more' +
     (sameAllSizes(p) ? ', the same for every size and colour' : ' (' + priceLine(p) + ')') + '. GST 5% is extra and you get a GST bill.'],
    ['What is the minimum order?',
     (p.moq || 10) + ' pieces. You can mix any products, colours and sizes to reach it.'],
    ['Can I buy one piece as a sample first?',
     'Yes. A single sample piece costs ' + range(p.samplePrice, p.samplePriceMax) + ' plus GST, so you can check the fabric and test your print before a bulk order.'],
    ['Which colours are available in 240 GSM?',
     p.colors.length + ' colours: ' + p.colors.join(', ') + '. The website shows which colours and sizes are in stock right now.'],
    ['Which sizes do you have, and how big is the oversized fit?',
     'Sizes ' + p.sizes.join(', ') + '. In the oversized fit, chest goes from ' + g._chest[0] + ' to ' + g._chest[1] + ' inches and length from ' +
     g._len[0] + ' to ' + g._len[1] + ' inches (S to XXL). See the size chart on this page.'],
    ['What fabric is it?',
     'Terry cotton / loopknit, heavy gauge, 100% cotton, bio-washed — 240 GSM.'],
    ['What is the difference between 240 GSM and 260 GSM?',
     heavy ? '260 GSM is heavier. Our ' + heavy.name + ' comes in ' + heavy.colors.join(' and ') + ', sizes ' + sizeSpan(heavy.sizes) +
       ', and costs ' + priceLine(heavy) + '. 240 GSM gives you ' + p.colors.length + ' colours at ' + rs(p.rate) + '/pc.' : ''],
    ['Do you have acid wash or shorts in 240 GSM?',
     (acid ? 'Yes: ' + acid.name + ' (240 GSM, ' + acid.colors.length + ' colours, ' + priceLine(acid) + ')' : '') +
     (acid && shorts ? ' and ' : '') +
     (shorts ? shorts.name + ' in 240 GSM terry cotton (' + shorts.colors.length + ' colours, ' + priceLine(shorts) + ')' : '') + '.'],
    ['How do you deliver?', DELIVERY_FAQ],
    ['Can I visit the godown?', GODOWN_FAQ]
  ];
  return f.filter(function (x) { return x[1]; });
}

var CSS = '<style>' +
  ':root{--ink:#111827;--muted:#4b5563;--line:#e5e7eb;--bg:#ffffff;--soft:#f3f4f6;--brand:#1d4ed8;--ok:#047857}' +
  '*{box-sizing:border-box}body{margin:0;font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;color:var(--ink);background:var(--bg)}' +
  'a{color:var(--brand)}header.top,footer.end{background:var(--soft);border-bottom:1px solid var(--line)}footer.end{border-top:1px solid var(--line);border-bottom:0;margin-top:40px}' +
  '.wrap{max-width:980px;margin:0 auto;padding:0 16px}.top .wrap{display:flex;flex-wrap:wrap;gap:8px 18px;align-items:center;padding:12px 16px}' +
  '.top .brand{font-weight:800;text-decoration:none;color:var(--ink)}.top nav a{margin-right:14px;font-size:15px}' +
  '.crumbs{font-size:14px;color:var(--muted);margin:14px 0 0}h1{font-size:30px;line-height:1.2;margin:10px 0 8px}' +
  'h2{font-size:23px;margin:34px 0 10px}h3{font-size:18px;margin:18px 0 6px}.lede{font-size:18px;color:var(--muted);margin:0 0 16px}' +
  '.price{display:flex;flex-wrap:wrap;gap:10px;margin:16px 0}.pill{border:1px solid var(--line);border-radius:12px;padding:10px 14px;background:var(--soft)}' +
  '.pill b{display:block;font-size:22px}.pill span{font-size:14px;color:var(--muted)}' +
  '.cta{display:flex;flex-wrap:wrap;gap:10px;margin:8px 0 6px}.btn{display:inline-block;padding:12px 18px;border-radius:10px;font-weight:700;text-decoration:none}' +
  '.btn.main{background:var(--brand);color:#fff}.btn.alt{border:2px solid var(--brand);color:var(--brand);background:#fff}' +
  '.note{font-size:14px;color:var(--muted)}.gal{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;margin:14px 0}' +
  '.gal figure{margin:0}.gal img{width:100%;height:auto;border-radius:10px;display:block;background:var(--soft)}.gal figcaption{font-size:13px;color:var(--muted);text-align:center}' +
  '.tbl{overflow-x:auto;margin:10px 0}table{border-collapse:collapse;width:100%;font-size:15px}th,td{border:1px solid var(--line);padding:8px 10px;text-align:left;vertical-align:top}' +
  'th{background:var(--soft)}caption{text-align:left;font-size:14px;color:var(--muted);padding:4px 0}tr.here td{background:#eef2ff;font-weight:600}' +
  '.specs th{width:38%}.colors{list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:8px 16px}.colors li{display:flex;align-items:center;gap:6px;font-size:15px}' +
  '.sw{width:18px;height:18px;border-radius:50%;border:1px solid #9ca3af;display:inline-block}' +
  'details{border:1px solid var(--line);border-radius:10px;padding:10px 14px;margin:8px 0}summary{font-weight:700;cursor:pointer}' +
  'video{width:100%;max-width:420px;border-radius:12px;display:block;margin:8px 0}' +
  '.end .wrap{padding:18px 16px;font-size:14px;color:var(--muted)}' +
  '@media(max-width:600px){h1{font-size:25px}h2{font-size:20px}}' +
  '</style>\n';

var DELIVERY_FAQ = 'By courier to any pincode in India; the website shows the delivery date for your pincode at checkout. Within about 60 km of our Delhi godown we can send same-day by Porter bike. Bulk orders can also go by train parcel to main railway cities, or by bus transport to ' + BUS_STATES + '. Or collect from the godown.';
var GODOWN_FAQ = 'Yes. ' + GODOWN + '. Open ' + HOURS + '.';

function headHtml(title, desc, url, image, ld) {
  return '<!DOCTYPE html>\n<html lang="en-IN">\n<head>\n' +
    '<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    '<title>' + esc(title) + '</title>\n' +
    '<meta name="description" content="' + esc(desc) + '">\n' +
    '<link rel="canonical" href="' + url + '">\n' +
    '<meta property="og:type" content="product">\n<meta property="og:title" content="' + esc(title) + '">\n' +
    '<meta property="og:description" content="' + esc(desc) + '">\n<meta property="og:url" content="' + url + '">\n' +
    '<meta property="og:image" content="' + image + '">\n<meta name="twitter:card" content="summary_large_image">\n' +
    ld.map(function (o) { return '<script type="application/ld+json">' + JSON.stringify(o) + '</script>'; }).join('\n') + '\n' +
    CSS + '</head>\n<body>\n';
}

function topHeader(waText) {
  return '<header class="top"><div class="wrap"><a class="brand" href="/">BulkPlainTshirt.com</a><nav>' +
    '<a href="/catalog/">Catalogue &amp; rates</a><a href="/delhi-stock.html">Live stock</a><a href="https://dtf.bulkplaintshirt.com/">DTF printing</a>' +
    '<a href="' + WA + waText + '">WhatsApp</a></nav></div></header>\n';
}

function deliveryHtml() {
  return '<h2>Delivery</h2>\n<ul>' +
    '<li><b>Courier</b> to any pincode in India.</li>' +
    '<li><b>Same-day bike (Porter)</b> within about 60 km of our Delhi godown.</li>' +
    '<li><b>Train parcel</b> to main railway cities, and <b>bus transport</b> to ' + BUS_STATES + ', for bulk orders.</li>' +
    '<li><b>Pick up</b> from the godown: ' + esc(GODOWN) + ' · ' + HOURS + '.</li>' +
    '</ul>\n';
}

function footerHtml() {
  return '<footer class="end"><div class="wrap"><b>OWN KNITTED BLANK WEARS</b> · ' + esc(GODOWN) + ' · GSTIN ' + GSTIN + '<br>' +
    'Godown: ' + HOURS + ' · Call or WhatsApp ' + PHONE_DISPLAY + ' · <a href="/">bulkplaintshirt.com</a> · <a href="/catalog/">Catalogue</a></div></footer>\n' +
    '</body>\n</html>\n';
}

function render(g, p, list, bySlug, sizeCharts) {
  var url = HOST + '/' + g.out;
  var chart = sizeCharts[p.sizeChart];
  var chestRow = chart && chart.rows.filter(function (r) { return /chest/i.test(r.label); })[0];
  var lenRow = chart && chart.rows.filter(function (r) { return /length/i.test(r.label) && !/sleeve/i.test(r.label); })[0];
  g._chest = chestRow ? [chestRow.values[0], chestRow.values[chestRow.values.length - 1]] : ['', ''];
  g._len = lenRow ? [lenRow.values[0], lenRow.values[lenRow.values.length - 1]] : ['', ''];

  var title = g.gsm + ' GSM Drop-Shoulder T-Shirts Wholesale India – ' + rs(p.rate) + '/pc, ' + p.colors.length + ' Colours | BulkPlainTshirt.com';
  var desc = g.gsm + ' GSM oversized drop-shoulder T-shirts wholesale: ' + rs(p.rate) + '/pc + GST for ' + (p.moq || 10) + '+ pcs, sample ' +
    rs(p.samplePrice) + ', ' + p.colors.length + ' colours, ' + sizeSpan(p.sizes) + ', 100% cotton terry bio-wash. Ships from our Delhi godown.';
  var imgBase = '/catalog/images/' + p.slug + '/';
  var images = g.photos.map(function (ph) { return HOST + imgBase + ph[0] + '.webp'; });
  var faqs = faqList(g, p, bySlug);
  var waText = encodeURIComponent('Hi, I want ' + g.gsm + ' GSM oversized T-shirts');

  var ld = [
    {
      '@context': 'https://schema.org', '@type': 'Product',
      name: p.name + ' Drop-Shoulder T-Shirt (blank)', sku: p.nickname || p.slug,
      description: p.description, material: '100% Cotton',
      brand: { '@type': 'Brand', name: 'Sale91' },
      image: images,
      offers: {
        '@type': 'Offer', url: url, priceCurrency: 'INR', price: p.rate.toFixed(2),
        availability: 'https://schema.org/InStock', itemCondition: 'https://schema.org/NewCondition',
        eligibleQuantity: { '@type': 'QuantitativeValue', minValue: p.moq || 10, unitCode: 'C62' },
        priceSpecification: { '@type': 'UnitPriceSpecification', price: p.rate.toFixed(2), priceCurrency: 'INR', valueAddedTaxIncluded: false },
        seller: { '@id': HOST + '/#business' }
      }
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: faqs.map(function (x) { return { '@type': 'Question', name: x[0], acceptedAnswer: { '@type': 'Answer', text: x[1] } }; })
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: HOST + '/' },
        { '@type': 'ListItem', position: 2, name: 'Buyer guides', item: HOST + '/p/index.html' },
        { '@type': 'ListItem', position: 3, name: g.gsm + ' GSM drop-shoulder T-shirts', item: url }
      ]
    },
    {
      '@context': 'https://schema.org', '@type': 'WebPage', '@id': url, url: url, name: title, description: desc,
      dateModified: g.updated, isPartOf: { '@id': HOST + '/#website' }, about: { '@id': HOST + '/#business' }
    }
  ];

  var swatches = p.colors.map(function (c, i) {
    return '<li><span class="sw" style="background:' + esc(p.colorCodes[i] || '#ccc') + '"></span>' + esc(c) + '</li>';
  }).join('');
  var gallery = g.photos.map(function (ph, i) {
    return '<figure><img src="' + imgBase + ph[0] + '.webp" width="600" height="600" alt="' + esc(p.name + ' drop-shoulder T-shirt in ' + ph[1]) + '"' +
      (i < 2 ? '' : ' loading="lazy"') + ' decoding="async"><figcaption>' + esc(ph[1]) + '</figcaption></figure>';
  }).join('');
  var faqHtml = faqs.map(function (x) { return '<details><summary>' + esc(x[0]) + '</summary><p>' + esc(x[1]) + '</p></details>'; }).join('');
  var related = g.related.map(function (r) { return '<li><a href="' + r[0] + '">' + esc(r[1]) + '</a></li>'; }).join('');
  var heavy = bySlug['oversize-260gsm'], light = bySlug['oversize-180gsm'], mid = bySlug['oversize-210gsm'];

  return headHtml(title, desc, url, images[0], ld) +
    topHeader(waText) +
    '<main class="wrap">\n' +
    '<p class="crumbs"><a href="/">Home</a> › <a href="/p/index.html">Buyer guides</a> › ' + g.gsm + ' GSM drop-shoulder T-shirts</p>\n' +
    '<h1>' + g.gsm + ' GSM Drop-Shoulder T-Shirts — Wholesale in India</h1>\n' +
    '<p class="lede">Blank oversized T-shirts in heavyweight ' + g.gsm + ' GSM terry cotton, in ' + p.colors.length +
    ' colours, shipped from our Delhi godown. Buy from ' + (p.moq || 10) + ' pieces, or one sample piece first; the website shows live stock.</p>\n' +
    '<div class="price"><div class="pill"><b>' + esc(priceLine(p)) + '</b><span>bulk, ' + (p.moq || 10) + '+ pcs · GST 5% extra</span></div>' +
    '<div class="pill"><b>' + esc(range(p.samplePrice, p.samplePriceMax)) + '</b><span>one sample piece</span></div>' +
    '<div class="pill"><b>' + p.colors.length + ' colours</b><span>sizes ' + esc(sizeSpan(p.sizes)) + '</span></div></div>\n' +
    '<div class="cta"><a class="btn main" href="/">Order on the website</a><a class="btn alt" href="/delhi-stock.html">See live stock</a>' +
    '<a class="btn alt" href="' + WA + waText + '">WhatsApp ' + PHONE_DISPLAY + '</a></div>\n' +
    '<p class="note">Prices and colours on this page come from our live catalogue. Guide updated ' + prettyDate(g.updated) + '.</p>\n' +
    '<div class="gal">' + gallery + '</div>\n' +
    '<h2>Specifications</h2>\n<div class="tbl"><table class="specs">' +
    '<tr><th>Product</th><td>' + esc(p.name) + ' (' + esc(p.nickname || '') + ')</td></tr>' +
    '<tr><th>Fabric</th><td>' + esc(p.description) + '</td></tr>' +
    '<tr><th>Weight</th><td>' + g.gsm + ' GSM (grams per square metre)</td></tr>' +
    '<tr><th>Fit</th><td>Oversized, drop shoulder</td></tr>' +
    '<tr><th>Sizes</th><td>' + esc(p.sizes.join(', ')) + '</td></tr>' +
    '<tr><th>Bulk price</th><td>' + esc(priceLine(p)) + (sameAllSizes(p) ? ', same for every size and colour' : '') + ' · GST 5% extra</td></tr>' +
    '<tr><th>Minimum order</th><td>' + (p.moq || 10) + ' pieces — mix any products, colours and sizes</td></tr>' +
    '<tr><th>Sample</th><td>1 piece for ' + esc(range(p.samplePrice, p.samplePriceMax)) + ' + GST</td></tr>' +
    '<tr><th>Ships from</th><td>Our godown in Khanpur, New Delhi · GST bill with every order</td></tr>' +
    '</table></div>\n' +
    '<h2>Colours</h2>\n<ul class="colors">' + swatches + '</ul>\n' +
    (g.video ? '<p>' + esc(g.video.label) + ' on video:</p><video controls preload="none" playsinline poster="' + g.video.poster + '"><source src="' + g.video.src + '" type="video/mp4"></video>\n' : '') +
    '<h2>Size chart</h2>\n' + sizeChartTable(chart) +
    '<p class="note">Drop-shoulder tees are cut wide on purpose. Measure a T-shirt you like and compare it with this chart.</p>\n' +
    '<h2>What does ' + g.gsm + ' GSM mean?</h2>\n' +
    '<p>GSM is the weight of the fabric in grams per square metre. A higher number means a thicker, heavier fabric. Everyday T-shirts are usually 160–180 GSM; ' +
    g.gsm + ' GSM is a heavyweight fabric.</p>\n' +
    '<p>For an oversized drop-shoulder T-shirt the weight matters a lot. Heavier fabric falls straight and keeps the wide, boxy shape instead of clinging to the body. ' +
    'It is also less see-through in light colours like White, Off-white and Beige, and it feels more premium in the hand — which is why many streetwear brands choose 220–260 GSM.</p>\n' +
    '<h2>' + g.gsm + ' GSM vs 180, 210 and 260 GSM</h2>\n' +
    '<p>All our oversized tees in one table. Bulk prices are per piece for ' + (p.moq || 10) + '+ pieces, before 5% GST.</p>\n' +
    compareTable(list, p.slug) +
    '<h3>Which one should you pick?</h3>\n<ul>' +
    (light ? '<li><b>' + esc(light.name) + '</b> — lightest and lowest price (' + esc(priceLine(light)) + '); good for summer and budget orders.</li>' : '') +
    (mid ? '<li><b>' + esc(mid.name) + '</b> — a step heavier (' + esc(priceLine(mid)) + ') in ' + mid.colors.length + ' colours.</li>' : '') +
    '<li><b>' + esc(p.name) + '</b> — the heavyweight streetwear choice with the widest colour range (' + p.colors.length + ' colours) at ' + esc(priceLine(p)) + '.</li>' +
    (heavy ? '<li><b>' + esc(heavy.name) + '</b> — heaviest, in ' + esc(heavy.colors.join(' and ')) + ', priced by size (' + esc(priceLine(heavy)) + ').</li>' : '') +
    '</ul>\n' +
    '<h2>Printing on 240 GSM</h2>\n<ul>' +
    '<li><b>DTF</b> — works on 100% cotton. We print DTF sheets too: <a href="https://dtf.bulkplaintshirt.com/">order DTF prints</a>. They come as a separate parcel from the T-shirts.</li>' +
    '<li><b>Screen printing</b> — the thick, stable fabric gives a smooth base for plastisol and water-based inks.</li>' +
    '<li><b>DTG</b> — direct-to-garment printing gives its best colours on 100% cotton.</li>' +
    '<li><b>Embroidery and puff print</b> — heavier fabric holds stitches and raised prints better than a thin tee.</li>' +
    '</ul>\n<p class="note">Always test your print on one sample piece before a bulk run.</p>\n' +
    '<h2>How to order</h2>\n<ol>' +
    '<li>Open <a href="/">bulkplaintshirt.com</a> (same as sale91.com), choose <b>' + esc(p.name) + '</b>, and pick your colours and sizes.</li>' +
    '<li>Reach ' + (p.moq || 10) + ' pieces in total — you can mix products, colours and sizes. For one piece, choose the sample.</li>' +
    '<li>Enter your pincode: the website shows the delivery options and the delivery date for it.</li>' +
    '<li>Pay at checkout. Every order gets a GST bill.</li>' +
    '</ol>\n' +
    deliveryHtml() +
    '<h2>Also in 240 GSM</h2>\n<ul>' +
    ['acidwash-oversize', 'shorts'].filter(function (s) { return bySlug[s]; }).map(function (s) {
      var q = bySlug[s];
      return '<li><a href="/catalog/p/' + q.slug + '/">' + esc(q.name) + '</a> — ' + esc(q.description) + ' · ' + esc(priceLine(q)) + ', ' + q.colors.length + ' colours</li>';
    }).join('') +
    '</ul>\n' +
    '<h2>Questions buyers ask</h2>\n' + faqHtml + '\n' +
    '<h2>More guides</h2>\n<ul>' + related + '<li><a href="/catalog/">Full catalogue with live rates</a></li></ul>\n' +
    '</main>\n' +
    footerHtml();
}

function fabricOf(p) {
  var d = p.description;
  if (/100% cotton/i.test(d)) return '100% cotton';
  var m = d.match(/(\d+)%\s*cotton,?\s*(\d+)%\s*polyester/i);
  if (m) return m[1] + '% cotton, ' + m[2] + '% polyester';
  if (/polyester/i.test(d)) return /cotton feel/i.test(d) ? 'cotton-feel polyester' : 'polyester';
  return '';
}

function fitOf(p) {
  var d = p.description;
  var fit = /regular fit/i.test(d) ? 'Regular fit' : /oversize/i.test(d) ? 'Oversized' : '';
  var neck = /round neck/i.test(d) ? 'round neck' : /polo/i.test(d) ? 'polo collar' : '';
  return [fit, neck].filter(Boolean).join(', ');
}

function priceBySize(p) {
  if (sameAllSizes(p)) return rs(p.rate) + ' for every size';
  var groups = p.tiers.length === 1 ? p.tiers[0].priceGroups : null;
  if (!groups) return priceLine(p);
  return groups.map(function (gr) { return rs(gr.price) + ' for sizes ' + gr.label; }).join(' and ');
}

function compareTableRegular(list, mainSlug) {
  var rows = list.map(function (p) {
    var cls = p.slug === mainSlug ? ' class="here"' : '';
    return '<tr' + cls + '><td><a href="/catalog/p/' + p.slug + '/">' + esc(p.name) + '</a></td><td>' + (gsmOf(p) || '') + '</td><td>' + esc(fabricOf(p)) +
      '</td><td>' + esc(priceLine(p)) + '</td><td>' + esc(range(p.samplePrice, p.samplePriceMax)) + '</td><td>' + p.colors.length +
      '</td><td>' + esc(sizeSpan(p.sizes)) + '</td></tr>';
  }).join('');
  return '<div class="tbl"><table class="cmp"><tr><th>Product</th><th>GSM</th><th>Fabric</th><th>Bulk price</th><th>1 sample</th><th>Colours</th><th>Sizes</th></tr>' + rows + '</table></div>';
}

function renderSublimation(g, p, list, bySlug, sizeCharts) {
  var url = HOST + '/' + g.out;
  var chart = sizeCharts[p.sizeChart];
  var chestRow = chart && chart.rows.filter(function (r) { return /chest/i.test(r.label); })[0];
  var lenRow = chart && chart.rows.filter(function (r) { return /length/i.test(r.label) && !/sleeve/i.test(r.label); })[0];
  var chest = chestRow ? [chestRow.values[0], chestRow.values[chestRow.values.length - 1]] : null;
  var len = lenRow ? [lenRow.values[0], lenRow.values[lenRow.values.length - 1]] : null;
  var sizeIsChest = chestRow && chestRow.values.join() === p.sizes.join();
  var gsm = gsmOf(p);
  var fabric = fabricOf(p);
  var fit = fitOf(p);
  var moq = p.moq || 10;
  var oneColour = p.colors.length === 1;
  var colourWord = oneColour ? p.colors[0] : p.colors.length + ' colours';
  var whiteOnly = oneColour && /white/i.test(p.colors[0]);
  var sample = range(p.samplePrice, p.samplePriceMax);

  var title = 'Sublimation T-Shirts Wholesale India: from ' + rs(p.rate) + '/pc, ' + gsm + ' GSM ' + (oneColour ? p.colors[0] + ' ' : '') + 'Polyester | BulkPlainTshirt.com';
  var desc = 'Blank sublimation T-shirts wholesale: ' + gsm + ' GSM ' + fabric + ', ' + colourWord.toLowerCase() + ', ' + fit.toLowerCase() + ', sizes ' + sizeSpan(p.sizes) + '. ' +
    priceLine(p) + ' + GST for ' + moq + '+ pcs, sample ' + sample + '. Ships from our Delhi godown.';
  var imgBase = '/catalog/images/' + p.slug + '/';
  var images = g.photos.map(function (ph) { return HOST + imgBase + ph[0] + '.webp'; });
  var waText = encodeURIComponent('Hi, I want sublimation T-shirts');

  var faqs = [
    ['What is the wholesale price of a sublimation T-shirt?',
     'Our ' + p.name + ' is ' + priceBySize(p) + ', per piece for ' + moq + ' pieces or more. GST 5% is extra and you get a GST bill.'],
    ['What is the minimum order?',
     moq + ' pieces. You can mix any products, colours and sizes to reach it.'],
    ['Can I buy one piece as a sample first?',
     'Yes. A single sample piece costs ' + sample + ' plus GST, so you can test your print before a bulk order.'],
    ['Which colours are available?',
     oneColour ? 'Only ' + p.colors[0] + '.' + (whiteOnly ? ' Sublimation needs a white or very light fabric, because the inks are see-through and there is no white ink.' : '')
       : p.colors.length + ' colours: ' + p.colors.join(', ') + '.'],
    ['Which sizes do you have?',
     'Sizes ' + p.sizes.join(', ') + (sizeIsChest ? ' (the size is the chest in inches)' : '') + '.' +
     (chest && len ? ' Chest goes from ' + chest[0] + ' to ' + chest[1] + ' inches and length from ' + len[0] + ' to ' + len[1] + ' inches. See the size chart on this page.' : '')],
    ['What fabric is it?',
     gsm + ' GSM ' + fabric + (fit ? ', ' + fit.toLowerCase() : '') + '. It is made for sublimation printing.'],
    ['Can I do sublimation on a cotton T-shirt?',
     'No. Sublimation ink bonds with polyester, so on cotton the print fades or washes out. For cotton T-shirts use DTF, screen printing or DTG.'],
    ['Can I use sublimation on a black or dark T-shirt?',
     'No. Sublimation inks are see-through and there is no white ink, so a design only shows its real colours on white or very light fabric.'],
    ['How do you deliver?', DELIVERY_FAQ],
    ['Can I visit the godown?', GODOWN_FAQ]
  ];

  var offers = {
    '@type': sameAllSizes(p) ? 'Offer' : 'AggregateOffer', url: url, priceCurrency: 'INR',
    availability: 'https://schema.org/InStock', itemCondition: 'https://schema.org/NewCondition',
    eligibleQuantity: { '@type': 'QuantitativeValue', minValue: moq, unitCode: 'C62' },
    seller: { '@id': HOST + '/#business' }
  };
  if (sameAllSizes(p)) offers.price = p.rate.toFixed(2);
  else { offers.lowPrice = p.rate.toFixed(2); offers.highPrice = p.rateMax.toFixed(2); offers.offerCount = p.sizes.length; }

  var ld = [
    {
      '@context': 'https://schema.org', '@type': 'Product',
      name: p.name + ' (blank' + (oneColour ? ', ' + p.colors[0].toLowerCase() : '') + ')', sku: p.nickname || p.slug,
      description: p.description, material: 'Polyester',
      brand: { '@type': 'Brand', name: 'Sale91' },
      image: images,
      offers: offers
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: faqs.map(function (x) { return { '@type': 'Question', name: x[0], acceptedAnswer: { '@type': 'Answer', text: x[1] } }; })
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: HOST + '/' },
        { '@type': 'ListItem', position: 2, name: 'Buyer guides', item: HOST + '/p/index.html' },
        { '@type': 'ListItem', position: 3, name: g.crumb, item: url }
      ]
    },
    {
      '@context': 'https://schema.org', '@type': 'WebPage', '@id': url, url: url, name: title, description: desc,
      dateModified: g.updated, isPartOf: { '@id': HOST + '/#website' }, about: { '@id': HOST + '/#business' }
    }
  ];

  var gallery = g.photos.map(function (ph, i) {
    return '<figure><img src="' + imgBase + ph[0] + '.webp" width="600" height="600" alt="' + esc('Blank sublimation T-shirt: ' + ph[1].toLowerCase()) + '"' +
      (i < 2 ? '' : ' loading="lazy"') + ' decoding="async"><figcaption>' + esc(ph[1]) + '</figcaption></figure>';
  }).join('');
  var faqHtml = faqs.map(function (x) { return '<details><summary>' + esc(x[0]) + '</summary><p>' + esc(x[1]) + '</p></details>'; }).join('');
  var related = g.related.map(function (r) { return '<li><a href="' + r[0] + '">' + esc(r[1]) + '</a></li>'; }).join('');
  var others = list.filter(function (q) { return q.slug !== p.slug; });

  return headHtml(title, desc, url, images[0], ld) +
    topHeader(waText) +
    '<main class="wrap">\n' +
    '<p class="crumbs"><a href="/">Home</a> › <a href="/p/index.html">Buyer guides</a> › ' + esc(g.crumb) + '</p>\n' +
    '<h1>Sublimation T-Shirts Wholesale in India</h1>\n' +
    '<p class="lede">Blank ' + (oneColour ? p.colors[0].toLowerCase() + ' ' : '') + 'sublimation T-shirts in ' + gsm + ' GSM ' + fabric + (fit ? ', ' + fit.toLowerCase() : '') +
    ', shipped from our Delhi godown. Buy from ' + moq + ' pieces, or one sample piece first. The website shows live stock.</p>\n' +
    '<div class="price"><div class="pill"><b>' + esc(priceLine(p)) + '</b><span>bulk, ' + moq + '+ pcs · GST 5% extra</span></div>' +
    '<div class="pill"><b>' + esc(sample) + '</b><span>one sample piece</span></div>' +
    '<div class="pill"><b>' + esc(oneColour ? p.colors[0] + ' only' : colourWord) + '</b><span>sizes ' + esc(sizeSpan(p.sizes)) + '</span></div></div>\n' +
    '<div class="cta"><a class="btn main" href="/">Order on the website</a><a class="btn alt" href="/delhi-stock.html">See live stock</a>' +
    '<a class="btn alt" href="' + WA + waText + '">WhatsApp ' + PHONE_DISPLAY + '</a></div>\n' +
    '<p class="note">Prices and colours on this page come from our live catalogue. Guide updated ' + prettyDate(g.updated) + '.</p>\n' +
    '<div class="gal">' + gallery + '</div>\n' +
    '<h2>Specifications</h2>\n<div class="tbl"><table class="specs">' +
    '<tr><th>Product</th><td>' + esc(p.name) + (p.nickname ? ' (' + esc(p.nickname) + ')' : '') + '</td></tr>' +
    '<tr><th>Fabric</th><td>' + esc(p.description) + '</td></tr>' +
    '<tr><th>Weight</th><td>' + gsm + ' GSM (grams per square metre)</td></tr>' +
    (fit ? '<tr><th>Fit</th><td>' + esc(fit) + '</td></tr>' : '') +
    '<tr><th>' + (oneColour ? 'Colour' : 'Colours') + '</th><td>' + esc(p.colors.join(', ')) + '</td></tr>' +
    '<tr><th>Sizes</th><td>' + esc(p.sizes.join(', ')) + (sizeIsChest ? ' (chest in inches)' : '') + '</td></tr>' +
    '<tr><th>Bulk price</th><td>' + esc(priceBySize(p)) + ' · GST 5% extra</td></tr>' +
    '<tr><th>Minimum order</th><td>' + moq + ' pieces, mix any products, colours and sizes</td></tr>' +
    '<tr><th>Sample</th><td>1 piece for ' + esc(sample) + ' + GST</td></tr>' +
    '<tr><th>Ships from</th><td>Our godown in Khanpur, New Delhi · GST bill with every order</td></tr>' +
    '</table></div>\n' +
    (g.video ? '<p>' + esc(g.video.label) + ' on video:</p><video controls preload="none" playsinline poster="' + g.video.poster + '"><source src="' + g.video.src + '" type="video/mp4"></video>\n' : '') +
    '<h2>Size chart</h2>\n' + sizeChartTable(chart, ': ') +
    '<p class="note">' + (fit ? fit + '. ' : '') + 'Measure a T-shirt you like and compare it with this chart.</p>\n' +
    '<h2>What is sublimation printing?</h2>\n' +
    '<p>Sublimation is a heat-press printing method. The design is printed on sublimation paper with sublimation ink and then pressed onto the T-shirt. ' +
    'The heat turns the ink into a gas that bonds with the polyester fibres, so the print becomes part of the fabric instead of a layer on top.</p>\n' +
    '<p>Because there is no layer on top, the print does not crack or peel, and the printed area feels the same as the rest of the T-shirt. ' +
    'Sublimation suits full-colour designs and photos, sports and team jerseys, school and event T-shirts, and all-over prints.</p>\n' +
    '<h2>Before you print</h2>\n<ul>' +
    '<li><b>Polyester only.</b> Sublimation ink bonds with polyester. On cotton it has nothing to hold on to, so the print fades or washes out. This T-shirt is ' + fabric + '.</li>' +
    '<li><b>White or very light fabric.</b> Sublimation inks are see-through and there is no white ink, so colours only come out true on a white or very light base.' + (whiteOnly ? ' This T-shirt is white.' : '') + '</li>' +
    '<li><b>Heat press settings.</b> Use the time, temperature and pressure your sublimation paper and ink maker recommends. Pre-press the T-shirt for a few seconds first to remove moisture and creases.</li>' +
    '<li><b>Test first.</b> Print your design on one sample piece before a bulk run.</li>' +
    '</ul>\n' +
    '<h2>Sublimation vs cotton T-shirts</h2>\n' +
    '<p>Our round-neck T-shirts in one table. Bulk prices are per piece for ' + moq + '+ pieces, before 5% GST.</p>\n' +
    compareTableRegular(list, p.slug) +
    '<h3>Which one should you pick?</h3>\n<ul>' +
    '<li><b>' + esc(p.name) + '</b>: for sublimation printing, ' + esc(priceLine(p)) + ', in ' + esc(p.colors.join(', ')) + '.</li>' +
    others.map(function (q) {
      return '<li><b>' + esc(q.name) + '</b>: ' + esc(fabricOf(q)) + ' in ' + q.colors.length + ' colours at ' + esc(priceLine(q)) + ', for DTF, screen printing, DTG and embroidery.</li>';
    }).join('') +
    '</ul>\n' +
    '<p>For cotton T-shirts we also print DTF sheets: <a href="https://dtf.bulkplaintshirt.com/">order DTF prints</a>. They come as a separate parcel from the T-shirts.</p>\n' +
    '<h2>How to order</h2>\n<ol>' +
    '<li>Open <a href="/">bulkplaintshirt.com</a> (same as sale91.com), choose <b>' + esc(p.name) + '</b>, and pick your sizes.</li>' +
    '<li>Reach ' + moq + ' pieces in total. You can mix products, colours and sizes. For one piece, choose the sample.</li>' +
    '<li>Enter your pincode: the website shows the delivery options and the delivery date for it.</li>' +
    '<li>Pay at checkout. Every order gets a GST bill.</li>' +
    '</ol>\n' +
    deliveryHtml() +
    '<h2>Questions buyers ask</h2>\n' + faqHtml + '\n' +
    '<h2>More guides</h2>\n<ul>' + related + '<li><a href="/catalog/">Full catalogue with live rates</a></li></ul>\n' +
    '</main>\n' +
    footerHtml();
}

function joinAnd(a) { return a.length < 2 ? (a[0] || '') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]; }
function knitOf(p) { var m = p.description.match(/cotton brushed loopknit/i); return m ? m[0].toLowerCase() : ''; }
function isDrop(p) { return /dropshoulder|drop shoulder/i.test(p.description); }

function hoodieFeatures(p) {
  var d = p.description.replace(/non-zipper/ig, 'pullover');
  var f = /sweatshirt/i.test(d) ? 'no hood' : /zipper/i.test(d) ? 'with a zip' : 'pullover, no zip';
  return isDrop(p) ? f + ', drop shoulder' : f;
}

function hoodieStyle(p) {
  var d = p.description;
  if (/sweatshirt/i.test(d)) return 'Sweatshirt, no hood';
  var s = /non-zipper/i.test(d) ? 'Pullover hoodie, no zip' : /zipper/i.test(d) ? 'Zip hoodie' : 'Hoodie';
  return isDrop(p) ? s + ', drop shoulder' : s;
}

function chartSpan(chart, re) {
  var row = chart && chart.rows.filter(function (r) { return re.test(r.label); })[0];
  return row ? { lo: row.values[0], hi: row.values[row.values.length - 1], label: row.label.toLowerCase() } : null;
}

function tierColourWords(p, t, i) {
  return i > 0 && t.colors.length > 3 ? 'the other ' + t.colors.length + ' colours' : joinAnd(t.colors);
}

function tierPriceSentence(p) {
  return joinAnd(p.tiers.map(function (t, i) {
    var gr = t.priceGroups;
    return rs(gr[0].price) + (gr.length > 1 ? ' (' + gr.slice(1).map(function (x) { return rs(x.price) + ' for ' + x.label; }).join(', ') + ')' : '') +
      (p.tiers.length > 1 ? ' in ' + tierColourWords(p, t, i) : '');
  }));
}

function tierSampleSentence(p) {
  if (p.tiers.length < 2) return rs(p.samplePrice);
  return joinAnd(p.tiers.map(function (t, i) { return rs(t.samplePrice) + ' in ' + tierColourWords(p, t, i); }));
}

function tierTable(p) {
  var rows = p.tiers.map(function (t) {
    return '<tr><td>' + esc(t.colors.join(', ')) + '</td><td>' + esc(t.priceGroups.map(function (gr) { return rs(gr.price) + ' (' + gr.label + ')'; }).join(' · ')) +
      '</td><td>' + esc(rs(t.samplePrice)) + '</td></tr>';
  }).join('');
  return '<div class="tbl"><table class="cmp"><tr><th>Colours</th><th>Bulk price per piece</th><th>1 sample</th></tr>' + rows + '</table></div>';
}

function hoodieCompareTable(list, mainSlug) {
  var rows = list.map(function (q) {
    var cls = q.slug === mainSlug ? ' class="here"' : '';
    return '<tr' + cls + '><td><a href="/catalog/p/' + q.slug + '/">' + esc(q.name) + '</a></td><td>' + (gsmOf(q) || '') + '</td><td>' + esc(hoodieStyle(q)) +
      '</td><td>' + esc(range(q.rate, q.rateMax)) + '/pc</td><td>' + esc(range(q.samplePrice, q.samplePriceMax)) + '</td><td>' + esc(sizeSpan(q.sizes)) + '</td></tr>';
  }).join('');
  return '<div class="tbl"><table class="cmp"><tr><th>Product</th><th>GSM</th><th>Style</th><th>Bulk price</th><th>1 sample</th><th>Sizes</th></tr>' + rows + '</table></div>';
}

function renderHoodie(g, p, list, bySlug, sizeCharts) {
  var url = HOST + '/' + g.out;
  var chart = sizeCharts[p.sizeChart];
  var chest = chartSpan(chart, /^chest$/i);
  var len = chartSpan(chart, /^(length|height)$/i);
  var gsm = gsmOf(p);
  var fabric = fabricOf(p);
  var knit = knitOf(p);
  var style = hoodieStyle(p);
  var drop = isDrop(p);
  var moq = p.moq || 10;
  var sample = range(p.samplePrice, p.samplePriceMax);
  var price = range(p.rate, p.rateMax) + '/pc';
  var shop = '/?tab=' + encodeURIComponent(g.tab);
  var others = list.filter(function (q) { return q.slug !== p.slug; });
  var heaviest = list.every(function (q) { return (gsmOf(q) || 0) <= gsm; });
  var hoodies = others.filter(function (q) { return /hoodie/i.test(q.description) && !/zipper hoodie/i.test(q.description.replace(/non-zipper/ig, '')); });
  var heavier = hoodies.filter(function (q) { return gsmOf(q) > gsm; })[0];
  var lighter = hoodies.filter(function (q) { return gsmOf(q) < gsm; })[0];
  var zip = others.filter(function (q) { return /zipper hoodie/i.test(q.description.replace(/non-zipper/ig, '')); })[0];
  var sweat = others.filter(function (q) { return /sweatshirt/i.test(q.description); })[0];
  var cheapest = list.reduce(function (a, q) { return q.rate < a.rate ? q : a; }, list[0]);
  var byColour = p.tiers.length > 1 ? 'by colour and size' : 'by size';
  var photos = g._photos;

  var title = g.titleLead + ': ' + (g.titleGsm ? gsm + ' GSM ' : '') + 'from ' + rs(p.rate) + '/pc, ' + p.colors.length + ' Colours | BulkPlainTshirt.com';
  var desc = g.descLead + ': ' + gsm + ' GSM ' + knit + ' (' + fabric + ')' + (heaviest ? ', our heaviest hoodie' : '') + ', ' + p.colors.length +
    ' colours, sizes ' + sizeSpan(p.sizes) + '. ' + price + ' + GST for ' + moq + '+ pcs, sample ' + sample + '. ' +
    (heaviest ? '' : 'Also ' + joinAnd(others.map(function (q) { return q.name; })) + '. ') + 'Ships from our Delhi godown.';
  var images = photos.map(function (ph) { return HOST + '/catalog/images/' + ph[0] + '/' + ph[1] + '.webp'; });
  var waText = encodeURIComponent(g.wa);
  var lede = (heaviest ? 'Our heaviest blank hoodie: ' + gsm + ' GSM ' + knit + (drop ? ' with a drop-shoulder fit' : '')
    : 'Blank ' + (/non-zipper/i.test(p.description) ? 'pullover ' : '') + 'hoodies in ' + gsm + ' GSM ' + knit) +
    ', in ' + p.colors.length + ' colours, sold wholesale from ' + moq + ' pieces and shipped from our Delhi godown. Or buy one sample piece first. The website shows live stock.';

  var faqs = [
    ['What is the wholesale price of ' + g.faqName + '?',
     'Our ' + p.name + ' is ' + tierPriceSentence(p) + ', per piece for ' + moq + ' pieces or more. GST 5% is extra and you get a GST bill.'],
    ['What is the minimum order?',
     moq + ' pieces. You can mix any products, colours and sizes to reach it.'],
    ['Can I buy one piece as a sample first?',
     'Yes. A single sample piece costs ' + tierSampleSentence(p) + ', plus GST, so you can check the fabric and test your print before a bulk order.'],
    ['Which colours are available?',
     p.colors.length + ' colours: ' + joinAnd(p.colors) + '. The website shows which colours and sizes are in stock right now.'],
    ['Which sizes do you have?',
     'Sizes ' + p.sizes.join(', ') + '.' + (chest && len ? ' Chest goes from ' + chest.lo + ' to ' + chest.hi + ' inches and ' + len.label + ' from ' + len.lo + ' to ' + len.hi +
       ' inches (' + p.sizes[0] + ' to ' + p.sizes[p.sizes.length - 1] + '). See the size chart on this page.' : '')],
    ['What fabric is it?',
     gsm + ' GSM ' + knit + ', ' + fabric + '. The inside is brushed, so it feels soft like fleece.'],
    heavier ? ['Do you have a heavier hoodie?',
     'Yes. Our ' + heavier.name + ' is ' + gsmOf(heavier) + ' GSM (' + hoodieStyle(heavier).toLowerCase() + ') at ' + range(heavier.rate, heavier.rateMax) + '/pc.'] :
    lighter ? ['What is the difference between ' + gsm + ' GSM and ' + gsmOf(lighter) + ' GSM hoodies?',
     (function () {
       var lc = chartSpan(sizeCharts[lighter.sizeChart], /^chest$/i);
       return gsm + ' GSM is heavier and warmer.' + (drop && chest ? ' Our ' + p.name + ' also has a drop-shoulder cut, chest ' + chest.lo + ' to ' + chest.hi + ' inches' +
         (lc ? ' against ' + lc.lo + ' to ' + lc.hi + ' inches on the ' + lighter.name : '') + '.' : '') +
         ' The ' + lighter.name + ' costs ' + range(lighter.rate, lighter.rateMax) + '/pc.';
     })()] : null,
    (zip || sweat) ? ['Do you have zip hoodies and sweatshirts?',
     (zip ? 'Yes. ' + zip.name + ': ' + gsmOf(zip) + ' GSM with a zip, ' + range(zip.rate, zip.rateMax) + '/pc. ' : '') +
     (sweat ? (zip ? '' : 'Yes. ') + sweat.name + ': ' + gsmOf(sweat) + ' GSM, no hood, ' + range(sweat.rate, sweat.rateMax) + '/pc by colour and size.' : '')] : null,
    ['How do you deliver?', DELIVERY_FAQ],
    ['Can I visit the godown?', GODOWN_FAQ]
  ].filter(Boolean);

  var offers = {
    '@type': 'AggregateOffer', url: url, priceCurrency: 'INR',
    lowPrice: p.rate.toFixed(2), highPrice: p.rateMax.toFixed(2), offerCount: p.colors.length * p.sizes.length,
    itemCondition: 'https://schema.org/NewCondition',
    eligibleQuantity: { '@type': 'QuantitativeValue', minValue: moq, unitCode: 'C62' },
    seller: { '@id': HOST + '/#business' }
  };
  var ld = [
    {
      '@context': 'https://schema.org', '@type': 'Product',
      name: p.name + ' (blank ' + (drop ? 'drop-shoulder ' : '') + (/non-zipper/i.test(p.description) ? 'pullover ' : '') + 'hoodie)', sku: p.nickname || p.slug,
      description: p.description, material: fabric,
      brand: { '@type': 'Brand', name: 'Sale91' },
      image: images,
      offers: offers
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: faqs.map(function (x) { return { '@type': 'Question', name: x[0], acceptedAnswer: { '@type': 'Answer', text: x[1] } }; })
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: HOST + '/' },
        { '@type': 'ListItem', position: 2, name: 'Buyer guides', item: HOST + '/p/index.html' },
        { '@type': 'ListItem', position: 3, name: g.crumb, item: url }
      ]
    },
    {
      '@context': 'https://schema.org', '@type': 'WebPage', '@id': url, url: url, name: title, description: desc,
      dateModified: g.updated, isPartOf: { '@id': HOST + '/#website' }, about: { '@id': HOST + '/#business' }
    }
  ];

  var swatches = p.colors.map(function (c, i) {
    return '<li><span class="sw" style="background:' + esc(p.colorCodes[i] || '#ccc') + '"></span>' + esc(c) + '</li>';
  }).join('');
  var gallery = photos.map(function (ph, i) {
    return '<figure><img src="/catalog/images/' + ph[0] + '/' + ph[1] + '.webp" width="600" height="600" alt="' + esc(p.name + ' in ' + ph[2]) + '"' +
      (i < 2 ? '' : ' loading="lazy"') + ' decoding="async"><figcaption>' + esc(ph[2]) + '</figcaption></figure>';
  }).join('');
  var faqHtml = faqs.map(function (x) { return '<details><summary>' + esc(x[0]) + '</summary><p>' + esc(x[1]) + '</p></details>'; }).join('');
  var related = g.related.map(function (r) { return '<li><a href="' + r[0] + '">' + esc(r[1]) + '</a></li>'; }).join('');
  var guideOf = {};
  GUIDES.forEach(function (x) { if (x.out !== g.out) guideOf[x.main] = '/' + x.out; });

  return headHtml(title, desc, url, images[0], ld) +
    topHeader(waText) +
    '<main class="wrap">\n' +
    '<p class="crumbs"><a href="/">Home</a> › <a href="/p/index.html">Buyer guides</a> › ' + esc(g.crumb) + '</p>\n' +
    '<h1>' + esc(g.h1) + '</h1>\n' +
    '<p class="lede">' + esc(lede) + '</p>\n' +
    '<div class="price"><div class="pill"><b>' + esc(price) + '</b><span>bulk, ' + moq + '+ pcs · ' + byColour + ' · GST 5% extra</span></div>' +
    '<div class="pill"><b>' + esc(sample) + '</b><span>one sample piece</span></div>' +
    '<div class="pill"><b>' + p.colors.length + ' colours</b><span>sizes ' + esc(sizeSpan(p.sizes)) + '</span></div></div>\n' +
    '<div class="cta"><a class="btn main" href="' + shop + '">Order on the website</a><a class="btn alt" href="/delhi-stock.html">See live stock</a>' +
    '<a class="btn alt" href="' + WA + waText + '">WhatsApp ' + PHONE_DISPLAY + '</a></div>\n' +
    '<p class="note">Prices and colours on this page come from our live catalogue. Guide updated ' + prettyDate(g.updated) + '.</p>\n' +
    '<div class="gal">' + gallery + '</div>\n' +
    '<h2>Price by colour</h2>\n' + tierTable(p) +
    '<p class="note">Bulk price per piece for ' + moq + ' pieces or more in total, before 5% GST. You can mix any products, colours and sizes.</p>\n' +
    '<h2>Specifications</h2>\n<div class="tbl"><table class="specs">' +
    '<tr><th>Product</th><td>' + esc(p.name) + (p.nickname ? ' (' + esc(p.nickname) + ')' : '') + '</td></tr>' +
    '<tr><th>Fabric</th><td>' + esc(p.description) + '</td></tr>' +
    '<tr><th>Weight</th><td>' + gsm + ' GSM (grams per square metre)</td></tr>' +
    '<tr><th>Style</th><td>' + esc(style) + '</td></tr>' +
    '<tr><th>Sizes</th><td>' + esc(p.sizes.join(', ')) + '</td></tr>' +
    '<tr><th>Bulk price</th><td>' + esc(tierPriceSentence(p)) + ' · GST 5% extra</td></tr>' +
    '<tr><th>Minimum order</th><td>' + moq + ' pieces, mix any products, colours and sizes</td></tr>' +
    '<tr><th>Sample</th><td>1 piece: ' + esc(tierSampleSentence(p)) + ', plus GST</td></tr>' +
    '<tr><th>Ships from</th><td>Our godown in Khanpur, New Delhi · GST bill with every order</td></tr>' +
    '</table></div>\n' +
    '<h2>Colours</h2>\n<ul class="colors">' + swatches + '</ul>\n' +
    '<p class="note">The website shows which colours and sizes are in stock right now.</p>\n' +
    (g.video ? '<p>' + esc(g.video.label) + ' on video:</p><video controls preload="none" playsinline poster="' + g.video.poster + '"><source src="' + g.video.src + '" type="video/mp4"></video>\n' : '') +
    '<h2>Size chart</h2>\n' + sizeChartTable(chart, ': ') +
    '<p class="note">' + (drop ? 'A drop-shoulder hoodie is cut wide on purpose. ' : '') + 'Measure a hoodie you like and compare it with this chart.</p>\n' +
    '<h2>What does ' + gsm + ' GSM brushed loopknit mean?</h2>\n' +
    '<p>GSM is the weight of the fabric in grams per square metre. A higher number means a thicker, heavier fabric. Everyday T-shirts are usually 160–180 GSM, so a ' +
    gsm + ' GSM hoodie is ' + (heaviest ? 'very heavy and warm.' : 'a warm winter weight.') + '</p>\n' +
    '<p>Loopknit has small loops on the inside of the fabric. In brushed loopknit those loops are brushed up, so the inside feels soft like fleece and holds more warmth. ' +
    'This fabric is ' + esc(fabric) + '.</p>\n' +
    (drop ? '<p>In a drop-shoulder hoodie the shoulder seam sits lower, on the upper arm, and the body is cut wider. That gives the relaxed, boxy streetwear look, and the heavy fabric helps it keep that shape.</p>\n' : '') +
    '<h2>Our hoodies and sweatshirts</h2>\n' +
    '<p>All of them in one table. Bulk prices are per piece for ' + moq + '+ pieces, before 5% GST.</p>\n' +
    hoodieCompareTable(list, p.slug) +
    '<h3>Which one should you pick?</h3>\n<ul>' +
    list.map(function (q) {
      var notes = [];
      if (list.every(function (x) { return (gsmOf(x) || 0) <= (gsmOf(q) || 0); })) notes.push('our heaviest');
      if (q === cheapest) notes.push('lowest price');
      var link = guideOf[q.slug] ? ' <a href="' + guideOf[q.slug] + '">Read its buyer guide</a>' : '';
      return '<li><b>' + esc(q.name) + '</b>: ' + gsmOf(q) + ' GSM, ' + esc(hoodieFeatures(q)) + ', ' + esc(range(q.rate, q.rateMax)) + '/pc' +
        (notes.length ? ', ' + notes.join(', ') : '') + '.' + link + '</li>';
    }).join('') +
    '</ul>\n' +
    '<h2>Printing on hoodies</h2>\n<ul>' +
    '<li><b>DTF</b>: works on cotton and cotton-polyester fabric like this one. We print DTF sheets too: <a href="https://dtf.bulkplaintshirt.com/">order DTF prints</a>. They come as a separate parcel from the hoodies.</li>' +
    '<li><b>Screen printing</b>: the thick, smooth outside of the fabric takes front and back prints well.</li>' +
    '<li><b>Embroidery</b>: heavy fabric holds stitches well, good for chest logos.</li>' +
    '</ul>\n<p class="note">Always test your print on one sample piece before a bulk run.</p>\n' +
    '<h2>How to order</h2>\n<ol>' +
    '<li>Open <a href="' + shop + '">' + esc(p.name) + '</a> on bulkplaintshirt.com (same as sale91.com) and pick your colours and sizes.</li>' +
    '<li>Reach ' + moq + ' pieces in total. You can mix products, colours and sizes. For one piece, choose the sample.</li>' +
    '<li>Enter your pincode: the website shows the delivery options and the delivery date for it.</li>' +
    '<li>Pay at checkout. Every order gets a GST bill.</li>' +
    '</ol>\n' +
    deliveryHtml() +
    '<h2>Questions buyers ask</h2>\n' + faqHtml + '\n' +
    '<h2>More guides</h2>\n<ul>' + related + '<li><a href="/catalog/">Full catalogue with live rates</a></li></ul>\n' +
    '</main>\n' +
    footerHtml();
}

function generateGuides(ctx) {
  var bySlug = {};
  ctx.products.forEach(function (p) { bySlug[p.slug] = p; });
  GUIDES.forEach(function (g) {
    var p = bySlug[g.main];
    if (!p) throw new Error('guides.js: product ' + g.main + ' missing from catalog data');
    var list = g.compare.map(function (s) {
      if (!bySlug[s]) throw new Error('guides.js: compare product ' + s + ' missing from catalog data');
      return bySlug[s];
    }).filter(function (q) { return !q.hidden; });
    g.photos.forEach(function (ph) {
      var f = ph.length === 3 ? path.join(__dirname, 'images', ph[0], ph[1] + '.webp') : path.join(__dirname, 'images', p.slug, ph[0] + '.webp');
      if (!fs.existsSync(f)) throw new Error('guides.js: photo missing ' + f);
    });
    if (g.kind === 'hoodie') {
      g._photos = g.photos.filter(function (ph) { return p.colors.indexOf(ph[2].split(',')[0].trim()) >= 0; });
      if (!g._photos.length) throw new Error('guides.js: no photo of a listed colour for ' + g.out);
    }
    var html = (g.kind === 'sublimation' ? renderSublimation : g.kind === 'hoodie' ? renderHoodie : render)(g, p, list, bySlug, ctx.sizeCharts);
    var out = path.join(__dirname, 'guides', g.out);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, html);
    console.log('Generated guide: guides/' + g.out);
  });
}

module.exports = { generateGuides: generateGuides, GUIDES: GUIDES };
