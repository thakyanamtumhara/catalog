(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.OwnCatalogPdf = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var SOURCES = {
    'oversize-210gsm': { pc: ['Oversize 210gsm'], ph: 'oversize-210gsm' },
    'oversize-180gsm': { pc: ['Oversize 180gsm'], ph: 'oversize-180gsm' },
    'oversize-240gsm': { pc: ['Oversize 240gsm'], ph: 'oversize-240gsm' },
    'oversize-260gsm': { pc: ['Oversize 260gsm'], ph: 'oversize-260gsm' },
    'acidwash-oversize': { pc: ['AcidWash OS'], ph: 'acidwash-os' },
    'true-biowash-round-neck': { pc: ['True Bio Rneck'], ph: 'true-bio-rneck' },
    'biowash-round-neck': { pc: ['Bio Rneck'], ph: 'bio-rneck' },
    'sublimation-t-shirt': { pc: ['Sublimation tshirt'], ph: 'sublimation' },
    'non-bio-round-neck': { pc: ['Non Bio Rneck'], ph: 'non-bio-rneck' },
    'premium-polo': { pc: ['Premium Polo'], ph: 'premium-polo' },
    'cotton-polo': { pc: ['Cotton Polo'], ph: 'cotton-polo' },
    'zip-hoodie': { pc: ['Zip Hoodie'], ph: 'zip-hoodie' },
    'hoodie-320gsm': { pc: ['Hoodie 320gsm-1', 'Hoodie 320gsm-2'], ph: 'hoodie-320gsm' },
    'hoodie-430gsm': { pc: ['Dropsho Hoodie 430gsm', 'Hoodie 430gsm-2'], ph: 'hoodie-430gsm' },
    'sweatshirt': { pc: ['Sweatshirt', 'Sweatshirt-2'], ph: 'sweatshirt' },
    'kids-round-neck': { pc: ['Kids Rneck'], ph: 'kids-rneck' },
    'shorts': { pc: ['Shorts'], ph: 'shorts' }
  };

  var COLOUR_ALIAS = { biege: 'beige', charcol: 'charcoal', gray: 'grey' };
  var COLOUR_NAME = { beige: 'Beige', charcoal: 'Charcoal', grey: 'Grey', offwhite: 'Off-white' };
  var FALLBACK_HEX = {
    black: '#222222', white: '#FFFFFF', navy: '#1E3A5F', red: '#DC143C', maroon: '#800020',
    offwhite: '#FAF5E4', beige: '#D4C5A9', lavender: '#C4B7D5', brown: '#8B4513', rosepink: '#FF8FAB',
    charcoal: '#36454F', armygreen: '#4B5320', powderblue: '#B0D4F1', royalblue: '#4169E1', sky: '#87CEEB',
    grey: '#9E9E9E', bottlegreen: '#006A4E', mustardyellow: '#E1AD01', bhagwa: '#FF9933', babypink: '#F4C2C2',
    sagegreen: '#9CAF88', orange: '#FF6B35'
  };

  function slugify(t) {
    return String(t).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function colourKey(name) {
    var k = String(name || '').toLowerCase().replace(/[^a-z]/g, '');
    return COLOUR_ALIAS[k] || k;
  }

  function fixText(s) {
    return String(s || '').replace(/\bLable\b/g, 'Label').replace(/\s+/g, ' ').trim();
  }

  function catalogColours(p) {
    var out = [];
    var groups = p.tiers && p.tiers.length ? p.tiers : [p];
    groups.forEach(function (g) {
      (g.colors || []).forEach(function (name, i) {
        out.push({ name: name, hex: (g.colorCodes || [])[i] || null });
      });
    });
    return out;
  }

  function catalogImages(p, slug) {
    var out = [];
    var groups = p.tiers && p.tiers.length ? p.tiers : [p];
    groups.forEach(function (g) {
      var dir = g.imageDir || slug;
      (g.imageFiles || []).forEach(function (n) {
        out.push({ url: '/catalog/images/' + dir + '/' + n + '.webp', colour: null, key: '' });
      });
    });
    return out;
  }

  function productList(catalog) {
    var out = [];
    ((catalog && catalog.categories) || []).forEach(function (cat) {
      (cat.products || []).forEach(function (p) {
        if (p.hidden || p.kind === 'dtf' || !p.sizes || !p.sizes.length) return;
        out.push({ slug: p.slug || slugify(p.name), name: p.name, category: cat.name, raw: p });
      });
    });
    return out;
  }

  function collect(catalog, live, slugs) {
    live = live || {};
    var all = productList(catalog);
    var bySlug = {};
    all.forEach(function (x) { bySlug[x.slug] = x; });
    var wanted = slugs && slugs.length ? slugs : all.map(function (x) { return x.slug; });
    var out = [];
    wanted.forEach(function (slug) {
      var item = bySlug[slug];
      if (!item) return;
      var p = item.raw;
      var src = SOURCES[slug] || null;
      var known = catalogColours(p);
      var hexByKey = {}, nameByKey = {};
      known.forEach(function (c) {
        var k = colourKey(c.name);
        if (!hexByKey[k] && c.hex) hexByKey[k] = c.hex;
        if (!nameByKey[k]) nameByKey[k] = c.name;
      });
      var colours = [], seen = {};
      var add = function (name) {
        var k = colourKey(name);
        if (!k || k === 'assorted' || seen[k]) return;
        seen[k] = true;
        colours.push({ key: k, name: nameByKey[k] || COLOUR_NAME[k] || String(name).trim(), hex: hexByKey[k] || FALLBACK_HEX[k] || '#9CA3AF' });
      };
      if (src && live.tbl0) {
        src.pc.forEach(function (key) {
          var m = live.tbl0[key];
          if (m && typeof m === 'object') Object.keys(m).forEach(add);
        });
      }
      if (!colours.length) known.forEach(function (c) { add(c.name); });

      var photos = [];
      var list = src && live.photos ? live.photos[src.ph] : null;
      if (list && list.length) {
        var rank = {};
        colours.forEach(function (c, i) { rank[c.key] = i; });
        photos = list
          .map(function (ph, i) { return { url: ph.u, key: colourKey(ph.c), i: i }; })
          .filter(function (ph) { return ph.url && rank[ph.key] != null; })
          .sort(function (a, b) { return rank[a.key] - rank[b.key] || a.i - b.i; })
          .map(function (ph) { return { url: ph.url, key: ph.key, colour: colours[rank[ph.key]].name }; });
      }
      if (!photos.length) photos = catalogImages(p, slug);

      out.push({
        slug: slug,
        name: fixText(item.name),
        category: fixText(item.category),
        description: fixText(p.description),
        sizes: (p.sizes || []).map(String),
        chart: p.sizeChart || null,
        colours: colours,
        photos: photos,
        hero: '/catalog/images/' + slug + '/' + (p.mainImage || 'm') + '.webp'
      });
    });
    return out;
  }

  var CP1252_EXTRA = '€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ';
  function drawable(ch) {
    var c = ch.charCodeAt(0);
    return (c >= 32 && c <= 126) || (c >= 160 && c <= 255) || CP1252_EXTRA.indexOf(ch) !== -1;
  }
  function undrawable(s) {
    return Array.from(String(s || '')).filter(function (ch) { return !drawable(ch); });
  }
  function safe(s) {
    return Array.from(String(s || '').replace(/[\r\n\t]+/g, ' ')).filter(drawable).join('');
  }

  function inr(n) {
    var v = Math.round(Number(n) * 100) / 100;
    var parts = String(v).split('.');
    var whole = parts[0], last3 = whole.slice(-3), rest = whole.slice(0, -3);
    var grouped = (rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' : '') + last3;
    return grouped + (parts[1] ? '.' + (parts[1].length === 1 ? parts[1] + '0' : parts[1]) : '');
  }

  function cleanRate(v) {
    var s = String(v == null ? '' : v).replace(/[^\d.]/g, '');
    if (!s) return null;
    var n = Number(s);
    if (!isFinite(n) || n <= 0 || n > 1000000) return null;
    return n;
  }

  function trimBox(px, w, h, channels) {
    var n = channels || 4;
    function white(i) { return px[i] > 238 && px[i + 1] > 238 && px[i + 2] > 238; }
    function colWhite(x, y0, y1) {
      var bad = 0, lim = Math.max(2, (y1 - y0) * 0.015);
      for (var y = y0; y < y1; y++) if (!white((y * w + x) * n) && ++bad > lim) return false;
      return true;
    }
    function rowWhite(y, x0, x1) {
      var bad = 0, lim = Math.max(2, (x1 - x0) * 0.015);
      for (var x = x0; x < x1; x++) if (!white((y * w + x) * n) && ++bad > lim) return false;
      return true;
    }
    var l = 0, r = w - 1, t = 0, b = h - 1;
    while (l < r && colWhite(l, 0, h)) l++;
    while (r > l && colWhite(r, 0, h)) r--;
    while (t < b && rowWhite(t, l, r + 1)) t++;
    while (b > t && rowWhite(b, l, r + 1)) b--;
    var cw = r - l + 1, ch = b - t + 1;
    if (cw < w * 0.4 || ch < h * 0.4 || (cw > w - 6 && ch > h - 6)) return { x: 0, y: 0, w: w, h: h };
    return { x: l, y: t, w: cw, h: ch };
  }

  function fileName(products, shop) {
    var base = products.length === 1 ? products[0].name + ' - Catalogue' : (shop ? shop + ' - Catalogue' : 'Catalogue');
    base = safe(base).replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim() || 'Catalogue';
    return base + '.pdf';
  }

  var W = 595.28, H = 841.89, M = 34;
  var CW = W - 2 * M;
  var RUPEE = 'M0 1 H8.6 M0 4.4 H8.6 M2.4 1 C7.6 1 7.6 8 2.4 8 H0.4 L7.4 14';

  function hexRgb(PDFLib, hex) {
    var h = String(hex || '#9CA3AF').replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(h, 16);
    if (!isFinite(n)) n = 0x9CA3AF;
    return PDFLib.rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
  }

  function isLight(hex) {
    var h = String(hex || '').replace('#', '');
    if (h.length !== 6) return false;
    var r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 215;
  }

  function wrap(text, font, size, maxW) {
    var words = String(text || '').split(/\s+/).filter(Boolean);
    var lines = [], cur = '';
    words.forEach(function (w) {
      var t = cur ? cur + ' ' + w : w;
      if (!cur || font.widthOfTextAtSize(t, size) <= maxW) cur = t;
      else { lines.push(cur); cur = w; }
    });
    if (cur) lines.push(cur);
    return lines;
  }

  function fit(text, font, size, maxW) {
    var t = String(text || '');
    if (font.widthOfTextAtSize(t, size) <= maxW) return t;
    while (t.length > 1 && font.widthOfTextAtSize(t + '...', size) > maxW) t = t.slice(0, -1);
    return t.replace(/\s+$/, '') + '...';
  }

  async function buildPdf(PDFLib, opts) {
    var rgb = PDFLib.rgb;
    var INK = rgb(0.067, 0.094, 0.153);
    var MUTED = rgb(0.42, 0.45, 0.5);
    var LINE = rgb(0.886, 0.894, 0.906);
    var PANEL = rgb(0.965, 0.969, 0.976);
    var WHITE = rgb(1, 1, 1);

    var products = opts.products || [];
    var shop = safe(opts.shop || '').trim();
    var phone = safe(opts.phone || '').trim();
    var rates = opts.rates || {};
    var charts = opts.charts || {};

    var doc = await PDFLib.PDFDocument.create();
    var font = await doc.embedFont(PDFLib.StandardFonts.Helvetica);
    var bold = await doc.embedFont(PDFLib.StandardFonts.HelveticaBold);
    var title = products.length === 1 ? products[0].name + ' - Catalogue' : (shop ? shop + ' - Catalogue' : 'Catalogue');
    doc.setTitle(safe(title));
    doc.setAuthor(shop);
    doc.setSubject('');
    doc.setKeywords([]);
    doc.setCreator(shop);
    doc.setProducer(shop);

    var imgCache = new Map();
    async function embed(img) {
      if (!img || !img.bytes) return null;
      if (imgCache.has(img.bytes)) return imgCache.get(img.bytes);
      var e = null;
      try { e = await doc.embedJpg(img.bytes); } catch (err) { e = null; }
      imgCache.set(img.bytes, e);
      return e;
    }

    function text(page, s, x, yTop, size, f, color) {
      page.drawText(safe(s), { x: x, y: H - yTop - size * 0.8, size: size, font: f || font, color: color || INK });
    }

    function rupee(page, x, yTop, size, color) {
      var s = (size * 0.74) / 14;
      page.drawSvgPath(RUPEE, { x: x, y: H - yTop - size * 0.06, scale: s, borderColor: color || INK, borderWidth: Math.max(0.6, size * 0.085) });
      return 8.6 * s + size * 0.16;
    }

    function money(page, n, x, yTop, size, f, color) {
      var w = rupee(page, x, yTop, size, color);
      var t = inr(n);
      text(page, t, x + w, yTop, size, f, color);
      return w + (f || font).widthOfTextAtSize(t, size);
    }

    function label(page, s, x, yTop) {
      text(page, s.toUpperCase(), x, yTop, 8.5, bold, MUTED);
    }

    function swatch(page, cx, cyTop, r, hex) {
      page.drawCircle({ x: cx, y: H - cyTop, size: r, color: hexRgb(PDFLib, hex), borderColor: isLight(hex) ? rgb(0.75, 0.77, 0.8) : undefined, borderWidth: isLight(hex) ? 0.7 : 0 });
    }

    function drawImageContain(page, emb, x, yTop, w, h) {
      if (!emb) {
        page.drawRectangle({ x: x, y: H - yTop - h, width: w, height: h, color: PANEL });
        return;
      }
      var r = Math.min(w / emb.width, h / emb.height);
      var dw = emb.width * r, dh = emb.height * r;
      page.drawImage(emb, { x: x + (w - dw) / 2, y: H - yTop - (h - dh) / 2 - dh, width: dw, height: dh });
    }

    var coverCount = products.length > 1 ? Math.ceil(products.length / 9) : 0;
    var coverPages = [];
    for (var ci = 0; ci < coverCount; ci++) coverPages.push(doc.addPage([W, H]));
    var startPage = {};

    function photoPageHeader(page, p) {
      text(page, fit(p.name, bold, 14, CW - 80), M, M, 14, bold);
      var w = bold.widthOfTextAtSize(fit(p.name, bold, 14, CW - 80), 14);
      text(page, '  ·  Colours', M + w, M + 2, 11, font, MUTED);
      page.drawLine({ start: { x: M, y: H - M - 24 }, end: { x: W - M, y: H - M - 24 }, thickness: 0.8, color: LINE });
      return M + 36;
    }

    for (var pi = 0; pi < products.length; pi++) {
      var p = products[pi];
      var page = doc.addPage([W, H]);
      startPage[p.slug] = doc.getPageCount();
      var y = M;

      var nameSize = bold.widthOfTextAtSize(p.name, 26) > CW ? 20 : 26;
      text(page, fit(p.name, bold, nameSize, CW), M, y, nameSize, bold);
      y += nameSize + 8;
      if (p.category) { text(page, p.category, M, y, 11.5, font, MUTED); y += 18; }
      page.drawLine({ start: { x: M, y: H - y }, end: { x: W - M, y: H - y }, thickness: 0.8, color: LINE });
      y += 16;

      var heroSize = 232;
      var heroEmb = await embed(p.heroImg);
      if (!heroEmb && p.photos && p.photos[0]) heroEmb = await embed(p.photos[0].img);
      drawImageContain(page, heroEmb, M, y, heroSize, heroSize);
      var leftBottom = y + heroSize;

      var r = rates[p.slug] || {};
      var sample = cleanRate(r.sample), bulk = cleanRate(r.bulk);
      if (sample || bulk) {
        var boxTop = leftBottom + 12;
        var rows = (sample ? 1 : 0) + (bulk ? 1 : 0);
        var boxH = 30 + rows * 22;
        page.drawRectangle({ x: M, y: H - boxTop - boxH, width: heroSize, height: boxH, color: PANEL, borderColor: LINE, borderWidth: 0.8 });
        label(page, 'Rate per piece', M + 12, boxTop + 11);
        var ry = boxTop + 27;
        if (sample) {
          text(page, 'Sample', M + 12, ry, 12.5, font, MUTED);
          var sw = money(page, sample, M + 92, ry - 0.5, 14, bold);
          text(page, ' / pc', M + 92 + sw, ry + 1, 10.5, font, MUTED);
          ry += 22;
        }
        if (bulk) {
          text(page, 'Bulk', M + 12, ry, 12.5, font, MUTED);
          var bw = money(page, bulk, M + 92, ry - 0.5, 14, bold);
          text(page, ' / pc', M + 92 + bw, ry + 1, 10.5, font, MUTED);
        }
        leftBottom = boxTop + boxH;
      }

      var rx = M + heroSize + 22, rw = W - M - rx, ry2 = y + 2;
      label(page, 'Details', rx, ry2);
      ry2 += 15;
      wrap(p.description, font, 10.5, rw).forEach(function (line) {
        text(page, line, rx, ry2, 10.5, font, INK);
        ry2 += 14.5;
      });
      ry2 += 10;

      label(page, 'Sizes', rx, ry2);
      ry2 += 15;
      var sx = rx;
      p.sizes.forEach(function (s) {
        var tw = bold.widthOfTextAtSize(s, 10);
        var bw2 = Math.max(26, tw + 14);
        if (sx + bw2 > W - M) { sx = rx; ry2 += 24; }
        page.drawRectangle({ x: sx, y: H - ry2 - 19, width: bw2, height: 19, borderColor: rgb(0.8, 0.82, 0.85), borderWidth: 0.8, color: WHITE });
        text(page, s, sx + (bw2 - tw) / 2, ry2 + 5, 10, bold, INK);
        sx += bw2 + 6;
      });
      ry2 += 32;

      label(page, 'Colours (' + p.colours.length + ')', rx, ry2);
      ry2 += 16;
      var colW = rw / 2;
      p.colours.forEach(function (c, i) {
        var cx = rx + (i % 2) * colW;
        var cy = ry2 + Math.floor(i / 2) * 17;
        swatch(page, cx + 5, cy + 5.5, 5, c.hex);
        text(page, fit(c.name, font, 10.5, colW - 18), cx + 15, cy + 0.5, 10.5, font, INK);
      });
      ry2 += Math.ceil(p.colours.length / 2) * 17;

      y = Math.max(leftBottom, ry2) + 24;

      var chart = p.chart && charts[p.chart];
      if (chart && chart.sizes && chart.rows && y + 40 + chart.rows.length * 20 < H - M - 30) {
        label(page, 'Size chart (inches)', M, y);
        y += 15;
        var firstW = 92;
        var cellW = (CW - firstW) / chart.sizes.length;
        var rowH = 21;
        page.drawRectangle({ x: M, y: H - y - rowH, width: CW, height: rowH, color: PANEL });
        text(page, 'Size', M + 8, y + 6, 10, bold, INK);
        chart.sizes.forEach(function (s, i) {
          var tw = bold.widthOfTextAtSize(String(s), 10);
          text(page, String(s), M + firstW + i * cellW + (cellW - tw) / 2, y + 6, 10, bold, INK);
        });
        y += rowH;
        chart.rows.forEach(function (row) {
          page.drawLine({ start: { x: M, y: H - y }, end: { x: W - M, y: H - y }, thickness: 0.6, color: LINE });
          text(page, fit(row.label, font, 10, firstW - 12), M + 8, y + 6, 10, font, MUTED);
          (row.values || []).forEach(function (v, i) {
            var t = String(v);
            var tw = font.widthOfTextAtSize(t, 10);
            text(page, t, M + firstW + i * cellW + (cellW - tw) / 2, y + 6, 10, font, INK);
          });
          y += rowH;
        });
        page.drawLine({ start: { x: M, y: H - y }, end: { x: W - M, y: H - y }, thickness: 0.6, color: LINE });
        y += 18;
      }

      var groups = [];
      (p.photos || []).forEach(function (ph) {
        var g = groups[groups.length - 1];
        if (!g || g.colour !== ph.colour) { g = { colour: ph.colour, key: ph.key, items: [] }; groups.push(g); }
        g.items.push(ph);
      });
      if (!groups.length) continue;

      var hexOf = {};
      p.colours.forEach(function (c) { hexOf[c.key] = c.hex; });
      var gap = 10;
      var cell = (CW - 2 * gap) / 3;
      var labelH = 22;
      var bottom = H - M - 26;
      var rowHeight = function (items) {
        var a = 1;
        items.forEach(function (it) { if (it.img && it.img.w) a = Math.max(a, it.img.h / it.img.w); });
        return cell * Math.min(1.45, a);
      };

      var spaceLeft = bottom - y;
      if (spaceLeft < labelH + rowHeight(groups[0].items.slice(0, 3)) + 20) {
        page = doc.addPage([W, H]);
        y = photoPageHeader(page, p);
      } else {
        page.drawLine({ start: { x: M, y: H - y + 8 }, end: { x: W - M, y: H - y + 8 }, thickness: 0.8, color: LINE });
        text(page, 'Colours', M, y, 13, bold, INK);
        y += 22;
      }

      for (var gi = 0; gi < groups.length; gi++) {
        var g2 = groups[gi];
        for (var k = 0; k < g2.items.length; k += 3) {
          var rowItems = g2.items.slice(k, k + 3);
          var rh = rowHeight(rowItems);
          var needLabel = k === 0;
          var need = (needLabel ? labelH : 0) + rh;
          if (y + need > bottom) {
            page = doc.addPage([W, H]);
            y = photoPageHeader(page, p);
            needLabel = true;
          }
          if (needLabel) {
            if (g2.colour) {
              swatch(page, M + 6, y + 6.5, 6, hexOf[g2.key] || FALLBACK_HEX[g2.key] || '#9CA3AF');
              text(page, g2.colour, M + 18, y + 1, 12, bold, INK);
            } else {
              text(page, 'Photos', M, y + 1, 12, bold, INK);
            }
            y += labelH;
          }
          for (var j = 0; j < rowItems.length; j++) {
            var emb = await embed(rowItems[j].img);
            drawImageContain(page, emb, M + j * (cell + gap), y, cell, rh);
          }
          y += rh + gap;
        }
        y += 6;
      }
    }

    coverPages.forEach(function (page, idx) {
      var y = M + 6;
      if (idx === 0) {
        var head = shop || 'Product Catalogue';
        var hs = bold.widthOfTextAtSize(head, 30) > CW ? 22 : 30;
        text(page, fit(head, bold, hs, CW), M, y, hs, bold);
        y += hs + 10;
        if (shop) { text(page, 'Product Catalogue', M, y, 13, font, MUTED); y += 20; }
        if (phone) { text(page, 'WhatsApp / Call: ' + phone, M, y, 12, font, INK); y += 20; }
      } else {
        text(page, 'Products (contd.)', M, y, 16, bold);
        y += 26;
      }
      page.drawLine({ start: { x: M, y: H - y }, end: { x: W - M, y: H - y }, thickness: 0.8, color: LINE });
      y += 18;
      var gap = 14, cell = (CW - 2 * gap) / 3;
      var slice = products.slice(idx * 9, idx * 9 + 9);
      slice.forEach(function (p, i) {
        var cx = M + (i % 3) * (cell + gap);
        var cy = y + Math.floor(i / 3) * (cell + 58);
        page.drawRectangle({ x: cx, y: H - cy - cell, width: cell, height: cell, color: PANEL });
        var emb = imgCache.get(p.heroImg && p.heroImg.bytes) || null;
        drawImageContain(page, emb, cx, cy, cell, cell);
        var lines = wrap(p.name, bold, 11, cell).slice(0, 2);
        lines.forEach(function (ln, li) { text(page, ln, cx, cy + cell + 8 + li * 14, 11, bold, INK); });
        text(page, 'Page ' + startPage[p.slug], cx, cy + cell + 8 + lines.length * 14 + 2, 9.5, font, MUTED);
      });
    });

    var total = doc.getPageCount();
    var foot = [shop, phone].filter(Boolean).join('  ·  ');
    doc.getPages().forEach(function (page, i) {
      if (foot) text(page, fit(foot, font, 9, CW - 60), M, H - M + 10, 9, font, MUTED);
      var n = (i + 1) + ' / ' + total;
      text(page, n, W - M - font.widthOfTextAtSize(n, 9), H - M + 10, 9, font, MUTED);
    });

    return doc.save();
  }

  return {
    SOURCES: SOURCES,
    slugify: slugify,
    colourKey: colourKey,
    productList: productList,
    collect: collect,
    undrawable: undrawable,
    trimBox: trimBox,
    cleanRate: cleanRate,
    inr: inr,
    fileName: fileName,
    buildPdf: buildPdf
  };
});
