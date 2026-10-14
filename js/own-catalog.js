(function () {
  'use strict';

  var Core = window.OwnCatalogPdf;
  var app = document.getElementById('ocApp');
  if (!Core || !app || typeof CATALOG_DATA === 'undefined') return;

  var STORE = 'ownCatalog:v1';
  var CHARTS = window.OC_SIZE_CHARTS || {};
  var products = Core.productList(CATALOG_DATA);
  var listEl = document.getElementById('ocList');
  var shopEl = document.getElementById('ocShop');
  var phoneEl = document.getElementById('ocPhone');
  var shopErr = document.getElementById('ocShopErr');
  var statusEl = document.getElementById('ocStatus');
  var makeBtn = document.getElementById('ocMake');
  var shareBtn = document.getElementById('ocShare');
  var downBtn = document.getElementById('ocDownload');
  var barEl = document.getElementById('ocProgress');
  var fillEl = document.getElementById('ocProgressFill');

  var state = { picked: [], shop: '', phone: '', rates: {} };
  var ready = null;
  var busy = false;
  var version = 0;
  var livePromise = null;
  var libPromise = null;

  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(STORE) || 'null');
      if (s && typeof s === 'object') {
        state.picked = Array.isArray(s.picked) ? s.picked : [];
        state.shop = typeof s.shop === 'string' ? s.shop : '';
        state.phone = typeof s.phone === 'string' ? s.phone : '';
        state.rates = s.rates && typeof s.rates === 'object' ? s.rates : {};
      }
    } catch (e) {}
  }

  function save() {
    try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {}
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function thumb(p) {
    return '/catalog/images/' + p.slug + '/' + (p.raw.mainImage || 'm') + '.webp';
  }

  function render() {
    var html = '', lastCat = '';
    products.forEach(function (p) {
      if (p.category !== lastCat) {
        html += '<div class="oc-cat">' + esc(p.category) + '</div>';
        lastCat = p.category;
      }
      var r = state.rates[p.slug] || {};
      var on = state.picked.indexOf(p.slug) !== -1;
      html += '<div class="oc-item' + (on ? ' on' : '') + '" data-slug="' + esc(p.slug) + '">' +
        '<label class="oc-pick">' +
          '<input type="checkbox" class="oc-check"' + (on ? ' checked' : '') + '>' +
          '<img src="' + thumb(p) + '" alt="" loading="lazy" width="48" height="48">' +
          '<span class="oc-name">' + esc(p.name) + '</span>' +
        '</label>' +
        '<div class="oc-rates">' +
          '<div class="oc-rates-l">Your rate per piece <span>(optional)</span></div>' +
          '<div class="oc-rates-row">' +
            '<label class="oc-rate"><span>Sample &#8377;</span><input type="text" inputmode="decimal" maxlength="8" data-k="sample" value="' + esc(r.sample || '') + '" aria-label="' + esc(p.name) + ' sample rate"></label>' +
            '<label class="oc-rate"><span>Bulk &#8377;</span><input type="text" inputmode="decimal" maxlength="8" data-k="bulk" value="' + esc(r.bulk || '') + '" aria-label="' + esc(p.name) + ' bulk rate"></label>' +
          '</div>' +
        '</div>' +
      '</div>';
    });
    listEl.innerHTML = html;
  }

  function pickedProducts() {
    return products.filter(function (p) { return state.picked.indexOf(p.slug) !== -1; }).map(function (p) { return p.slug; });
  }

  function shopProblem() {
    var bad = Core.undrawable(state.shop).concat(Core.undrawable(state.phone));
    return bad.length ? 'Please type the shop name and number in English letters and digits.' : '';
  }

  function stale() {
    version++;
    if (ready && ready.url) URL.revokeObjectURL(ready.url);
    ready = null;
    shareBtn.hidden = true;
    downBtn.hidden = true;
    makeBtn.hidden = false;
    refresh();
  }

  function refresh() {
    var n = pickedProducts().length;
    var problem = shopProblem();
    shopErr.textContent = problem;
    shopErr.hidden = !problem;
    if (busy) return;
    if (ready) {
      statusEl.textContent = 'Your PDF is ready · ' + ready.size;
      return;
    }
    makeBtn.disabled = !n || !!problem;
    if (!n) statusEl.textContent = 'Tick the products you sell';
    else {
      var withRates = pickedProducts().filter(function (s) {
        var r = state.rates[s] || {};
        return Core.cleanRate(r.sample) || Core.cleanRate(r.bulk);
      }).length;
      statusEl.textContent = n + (n === 1 ? ' product' : ' products') + (withRates ? ' · your rates on ' + withRates : ' · no rates');
    }
  }

  function onListChange(e) {
    var item = e.target.closest('.oc-item');
    if (!item) return;
    var slug = item.getAttribute('data-slug');
    if (e.target.classList.contains('oc-check')) {
      var i = state.picked.indexOf(slug);
      if (e.target.checked && i === -1) state.picked.push(slug);
      if (!e.target.checked && i !== -1) state.picked.splice(i, 1);
      item.classList.toggle('on', e.target.checked);
    } else if (e.target.hasAttribute('data-k')) {
      var clean = e.target.value.replace(/[^\d.]/g, '').replace(/(\..*)\./g, '$1');
      if (clean !== e.target.value) e.target.value = clean;
      var r = state.rates[slug] || (state.rates[slug] = {});
      r[e.target.getAttribute('data-k')] = clean;
    } else return;
    save();
    stale();
  }

  function loadLibrary() {
    if (window.PDFLib) return Promise.resolve(window.PDFLib);
    if (libPromise) return libPromise;
    libPromise = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = app.getAttribute('data-pdflib');
      s.onload = function () { window.PDFLib ? resolve(window.PDFLib) : reject(new Error('pdf-lib missing')); };
      s.onerror = function () { libPromise = null; reject(new Error('Could not load the PDF maker')); };
      document.head.appendChild(s);
    });
    return libPromise;
  }

  function fetchText(url) {
    return fetch(url, { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error(url + ' ' + r.status);
      return r.text();
    });
  }

  function loadLive() {
    if (livePromise) return livePromise;
    var t = Date.now();
    livePromise = Promise.all([
      fetchText('/pc.js?t=' + t).then(function (src) {
        var tbl = new Function(src + '\n;return typeof tbl !== "undefined" ? tbl : null;')();
        return tbl && tbl[0] && typeof tbl[0] === 'object' ? tbl[0] : null;
      }).catch(function () { return null; }),
      fetchText('/phphotos.js?t=' + t).then(function (src) {
        var w = {};
        new Function('window', src)(w);
        return w.PH_PHOTOS || null;
      }).catch(function () { return null; })
    ]).then(function (res) { return { tbl0: res[0], photos: res[1] }; });
    return livePromise;
  }

  function blobBytes(blob) {
    if (blob.arrayBuffer) return blob.arrayBuffer().then(function (b) { return new Uint8Array(b); });
    return new Promise(function (resolve, reject) {
      var fr = new FileReader();
      fr.onload = function () { resolve(new Uint8Array(fr.result)); };
      fr.onerror = reject;
      fr.readAsArrayBuffer(blob);
    });
  }

  function decode(blob) {
    if (window.createImageBitmap) return createImageBitmap(blob);
    return new Promise(function (resolve, reject) {
      var u = URL.createObjectURL(blob);
      var im = new Image();
      im.onload = function () { URL.revokeObjectURL(u); resolve(im); };
      im.onerror = function () { URL.revokeObjectURL(u); reject(new Error('image')); };
      im.src = u;
    });
  }

  async function toJpeg(url) {
    try {
      var r = await fetch(url);
      if (!r.ok) return null;
      var bmp = await decode(await r.blob());
      var w = bmp.width, h = bmp.height;
      var c = document.createElement('canvas');
      c.width = w; c.height = h;
      var x = c.getContext('2d');
      x.fillStyle = '#fff';
      x.fillRect(0, 0, w, h);
      x.drawImage(bmp, 0, 0);
      if (bmp.close) bmp.close();
      var box = Core.trimBox(x.getImageData(0, 0, w, h).data, w, h, 4);
      var s = Math.min(1, 600 / Math.max(box.w, box.h));
      var c2 = document.createElement('canvas');
      c2.width = Math.max(1, Math.round(box.w * s));
      c2.height = Math.max(1, Math.round(box.h * s));
      var x2 = c2.getContext('2d');
      x2.fillStyle = '#fff';
      x2.fillRect(0, 0, c2.width, c2.height);
      x2.imageSmoothingQuality = 'high';
      x2.drawImage(c, box.x, box.y, box.w, box.h, 0, 0, c2.width, c2.height);
      var jpg = await new Promise(function (resolve) { c2.toBlob(resolve, 'image/jpeg', 0.82); });
      if (!jpg) return null;
      return { bytes: await blobBytes(jpg), w: c2.width, h: c2.height };
    } catch (e) {
      return null;
    }
  }

  function progress(done, total) {
    var pct = total ? Math.round(done * 100 / total) : 0;
    fillEl.style.width = pct + '%';
    statusEl.textContent = 'Making your PDF… ' + done + ' of ' + total + ' photos';
  }

  function sizeText(n) {
    return n >= 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB';
  }

  async function make() {
    if (busy) return;
    var slugs = pickedProducts();
    if (!slugs.length || shopProblem()) return;
    busy = true;
    var startVersion = version;
    makeBtn.disabled = true;
    barEl.hidden = false;
    fillEl.style.width = '0%';
    statusEl.textContent = 'Getting the latest colours…';
    try {
      var both = await Promise.all([loadLibrary(), loadLive()]);
      var PDFLib = both[0], live = both[1];
      var list = Core.collect(CATALOG_DATA, live, slugs);
      var jobs = [];
      list.forEach(function (p) {
        jobs.push({ p: p, hero: true, url: p.hero });
        p.photos.forEach(function (ph) { jobs.push({ ph: ph, url: ph.url }); });
      });
      var done = 0, next = 0;
      progress(0, jobs.length);
      async function worker() {
        while (next < jobs.length) {
          var job = jobs[next++];
          var img = await toJpeg(job.url);
          if (job.hero) job.p.heroImg = img; else job.ph.img = img;
          progress(++done, jobs.length);
        }
      }
      await Promise.all([worker(), worker(), worker(), worker()]);
      statusEl.textContent = 'Putting the pages together…';
      var rates = {};
      slugs.forEach(function (s) { rates[s] = state.rates[s] || {}; });
      var bytes = await Core.buildPdf(PDFLib, { products: list, charts: CHARTS, shop: state.shop, phone: state.phone, rates: rates });
      if (version !== startVersion) {
        busy = false;
        barEl.hidden = true;
        refresh();
        return;
      }
      var name = Core.fileName(list, state.shop.trim());
      var blob = new Blob([bytes], { type: 'application/pdf' });
      ready = { blob: blob, name: name, url: URL.createObjectURL(blob), size: sizeText(bytes.length) };
      var canShare = false;
      try {
        var f = new File([blob], name, { type: 'application/pdf' });
        canShare = !!(navigator.canShare && navigator.share && navigator.canShare({ files: [f] }));
        ready.file = f;
      } catch (e) { canShare = false; }
      makeBtn.hidden = true;
      downBtn.hidden = false;
      shareBtn.hidden = !canShare;
    } catch (err) {
      statusEl.textContent = 'Could not make the PDF. Check your internet and try again.';
      makeBtn.disabled = false;
      busy = false;
      barEl.hidden = true;
      return;
    }
    busy = false;
    barEl.hidden = true;
    refresh();
  }

  function download() {
    if (!ready) return;
    var a = document.createElement('a');
    a.href = ready.url;
    a.download = ready.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function share() {
    if (!ready || !ready.file) return;
    navigator.share({ files: [ready.file], title: ready.name.replace(/\.pdf$/, '') }).catch(function () {});
  }

  load();
  var params = new URLSearchParams(location.search);
  var want = (params.get('p') || '').split(',').map(function (s) { return s.trim(); }).filter(function (s) {
    return products.some(function (p) { return p.slug === s; });
  });
  if (want.length) state.picked = want;
  state.picked = state.picked.filter(function (s) { return products.some(function (p) { return p.slug === s; }); });
  shopEl.value = state.shop;
  phoneEl.value = state.phone;
  render();
  refresh();

  listEl.addEventListener('change', onListChange);
  listEl.addEventListener('input', function (e) { if (e.target.hasAttribute('data-k')) onListChange(e); });
  shopEl.addEventListener('input', function () { state.shop = shopEl.value; save(); stale(); });
  phoneEl.addEventListener('input', function () {
    var clean = phoneEl.value.replace(/[^\d+\s-]/g, '');
    if (clean !== phoneEl.value) phoneEl.value = clean;
    state.phone = clean;
    save();
    stale();
  });
  makeBtn.addEventListener('click', make);
  downBtn.addEventListener('click', download);
  shareBtn.addEventListener('click', share);

  if (want.length) {
    var first = listEl.querySelector('.oc-item[data-slug="' + want[0] + '"]');
    if (first && first.scrollIntoView) setTimeout(function () { first.scrollIntoView({ block: 'center' }); }, 60);
  }
  setTimeout(function () { loadLive(); loadLibrary().catch(function () {}); }, 1200);
})();
