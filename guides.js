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

function sizeChartTable(chart) {
  if (!chart) return '';
  var head = '<tr><th>Size</th>' + chart.sizes.map(function (s) { return '<th>' + esc(s) + '</th>'; }).join('') + '</tr>';
  var rows = chart.rows.map(function (r) {
    return '<tr><th>' + esc(r.label) + '</th>' + r.values.map(function (v) { return '<td>' + v + '</td>'; }).join('') + '</tr>';
  }).join('');
  return '<div class="tbl"><table class="sz"><caption>' + esc(chart.title) + ' — measurements in inches</caption>' + head + rows + '</table></div>';
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
    ['How do you deliver?',
     'By courier to any pincode in India; the website shows the delivery date for your pincode at checkout. Within about 60 km of our Delhi godown we can send same-day by Porter bike. Bulk orders can also go by train parcel to main railway cities, or by bus transport to ' + BUS_STATES + '. Or collect from the godown.'],
    ['Can I visit the godown?',
     'Yes. ' + GODOWN + '. Open ' + HOURS + '.']
  ];
  return f.filter(function (x) { return x[1]; });
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

  return '<!DOCTYPE html>\n<html lang="en-IN">\n<head>\n' +
    '<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    '<title>' + esc(title) + '</title>\n' +
    '<meta name="description" content="' + esc(desc) + '">\n' +
    '<link rel="canonical" href="' + url + '">\n' +
    '<meta property="og:type" content="product">\n<meta property="og:title" content="' + esc(title) + '">\n' +
    '<meta property="og:description" content="' + esc(desc) + '">\n<meta property="og:url" content="' + url + '">\n' +
    '<meta property="og:image" content="' + images[0] + '">\n<meta name="twitter:card" content="summary_large_image">\n' +
    ld.map(function (o) { return '<script type="application/ld+json">' + JSON.stringify(o) + '</script>'; }).join('\n') + '\n' +
    '<style>' +
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
    '</style>\n</head>\n<body>\n' +
    '<header class="top"><div class="wrap"><a class="brand" href="/">BulkPlainTshirt.com</a><nav>' +
    '<a href="/catalog/">Catalogue &amp; rates</a><a href="/delhi-stock.html">Live stock</a><a href="https://dtf.bulkplaintshirt.com/">DTF printing</a>' +
    '<a href="' + WA + waText + '">WhatsApp</a></nav></div></header>\n' +
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
    '<h2>Delivery</h2>\n<ul>' +
    '<li><b>Courier</b> to any pincode in India.</li>' +
    '<li><b>Same-day bike (Porter)</b> within about 60 km of our Delhi godown.</li>' +
    '<li><b>Train parcel</b> to main railway cities, and <b>bus transport</b> to ' + BUS_STATES + ', for bulk orders.</li>' +
    '<li><b>Pick up</b> from the godown: ' + esc(GODOWN) + ' · ' + HOURS + '.</li>' +
    '</ul>\n' +
    '<h2>Also in 240 GSM</h2>\n<ul>' +
    ['acidwash-oversize', 'shorts'].filter(function (s) { return bySlug[s]; }).map(function (s) {
      var q = bySlug[s];
      return '<li><a href="/catalog/p/' + q.slug + '/">' + esc(q.name) + '</a> — ' + esc(q.description) + ' · ' + esc(priceLine(q)) + ', ' + q.colors.length + ' colours</li>';
    }).join('') +
    '</ul>\n' +
    '<h2>Questions buyers ask</h2>\n' + faqHtml + '\n' +
    '<h2>More guides</h2>\n<ul>' + related + '<li><a href="/catalog/">Full catalogue with live rates</a></li></ul>\n' +
    '</main>\n' +
    '<footer class="end"><div class="wrap"><b>OWN KNITTED BLANK WEARS</b> · ' + esc(GODOWN) + ' · GSTIN ' + GSTIN + '<br>' +
    'Godown: ' + HOURS + ' · Call or WhatsApp ' + PHONE_DISPLAY + ' · <a href="/">bulkplaintshirt.com</a> · <a href="/catalog/">Catalogue</a></div></footer>\n' +
    '</body>\n</html>\n';
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
      var f = path.join(__dirname, 'images', p.slug, ph[0] + '.webp');
      if (!fs.existsSync(f)) throw new Error('guides.js: photo missing ' + f);
    });
    var html = render(g, p, list, bySlug, ctx.sizeCharts);
    var out = path.join(__dirname, 'guides', g.out);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, html);
    console.log('Generated guide: guides/' + g.out);
  });
}

module.exports = { generateGuides: generateGuides, GUIDES: GUIDES };
