// ===== Size Chart Data (all measurements in inches) =====
var SIZE_CHARTS = {
  oversized: {
    title: "Drop-Shoulder / Oversized T-Shirt",
    sizes: ["S", "M", "L", "XL", "XXL"],
    rows: [
      { label: "Chest", values: [42, 44, 46, 48, 50] },
      { label: "Length", values: [27.5, 28, 28.5, 29, 29.5] },
      { label: "Shoulder", values: [20, 21, 22, 23, 24] },
      { label: "Sleeve Length", values: [8.5, 9, 9.5, 10, 10.5] }
    ]
  },
  oversized260: {
    title: "Oversize 260gsm Drop-Shoulder T-Shirt",
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"],
    rows: [
      { label: "Chest", values: [40, 42, 44, 46, 48, 50, 52, 54] },
      { label: "Length", values: [25.5, 26, 27, 28, 29, 30, 31, 31] },
      { label: "Shoulder", values: [18.5, 19.5, 20.5, 21.5, 22.5, 23.5, 24.5, 25.5] },
      { label: "Sleeve Length", values: [7.5, 8, 8.5, 9, 9.5, 10, 10, 10] }
    ]
  },
  boxy: {
    title: "Boxy Fit Drop-Shoulder T-Shirt",
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    rows: [
      { label: "Chest", values: [20.5, 21.5, 22.5, 23.5, 24.5, 25.5] },
      { label: "Length", values: [25.5, 26, 26.5, 27, 27.5, 28] },
      { label: "Sleeve", values: [8.5, 9, 9.5, 10, 10.5, 11] }
    ]
  },
  roundneck: {
    title: "Regular Fit Round Neck / Polo",
    sizes: ["36", "38", "40", "42", "44", "46"],
    rows: [
      { label: "Chest", values: [36, 38, 40, 42, 44, 46] },
      { label: "Length", values: [26, 27, 28, 29, 30, 31] },
      { label: "Shoulder", values: [16, 17, 17.5, 18, 18.5, 19] },
      { label: "Sleeve Length", values: [8, 8.5, 9, 9.5, 10, 10.5] }
    ]
  },
  hoodie320: {
    title: "Hoodies / Sweatshirts / Jackets (320gsm)",
    sizes: ["S", "M", "L", "XL", "XXL"],
    rows: [
      { label: "Chest", values: [38, 40, 42, 44, 46] },
      { label: "Length", values: [27, 28, 29, 30, 31] },
      { label: "Shoulder", values: [16.5, 17.5, 18.5, 19.5, 20.5] },
      { label: "Sleeve Length", values: [23.5, 24, 24.5, 25, 25.5] }
    ]
  },
  hoodie430: {
    title: "Drop Shoulder Hoodie (430gsm)",
    sizes: ["S", "M", "L", "XL", "XXL"],
    rows: [
      { label: "Chest", values: [42, 44, 46, 48, 50] },
      { label: "Height", values: [25, 26, 27, 28, 29] }
    ]
  },
  kids: {
    title: "Kids T-Shirt",
    sizes: ["20", "22", "24", "26", "28", "30", "32", "34"],
    rows: [
      { label: "Chest", values: [20, 22, 24, 26, 28, 30, 32, 34] },
      { label: "Length", values: [15, 16, 17, 19, 20.5, 22, 23.5, 25.5] },
      { label: "Age (Year)", values: ["0-1Y", "1-2Y", "2-3Y", "3-4Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y"] }
    ]
  },
  shorts: {
    title: "Shorts",
    sizes: ["XS", "S", "M", "L", "XL"],
    rows: [
      { label: "Waist", values: ["28-30", "30-32", "32-34", "34-36", "36-38"] },
      { label: "Height", values: [18, 19, 20, 21, 22] },
      { label: "Inseam", values: [5, 5.25, 5.5, 5.75, 6] }
    ]
  }
};

// ===== Flatten all products with category info =====
// A product is either flat (one rate for every colour) or has `tiers` — the same
// garment at two rates depending on colour. Both are normalised to a tier list so
// everything downstream only ever deals with one shape.
function normalizeTiers(product, slug) {
  var raw = product.tiers || [{
    colors: product.colors,
    colorCodes: product.colorCodes,
    imageFiles: product.imageFiles,
    bulkPrices: product.bulkPrices,
    samplePrice: product.samplePrice,
    catalogUrl: product.catalogUrl
  }];
  return raw.map(function (t) {
    var dir = t.imageDir || slug;
    var files = t.imageFiles || t.colorCodes.map(function (_, i) { return i + 1; });
    return {
      label: t.label || null,
      colors: t.colors,
      colorCodes: t.colorCodes,
      imageFiles: files,
      imageDir: dir,
      images: files.map(function (n) { return '/catalog/images/' + dir + '/' + n + '.webp'; }),
      bulkPrices: t.bulkPrices,
      samplePrice: t.samplePrice,
      catalogUrl: t.catalogUrl,
      minPrice: Math.min.apply(null, t.bulkPrices),
      maxPrice: Math.max.apply(null, t.bulkPrices),
      priceGroups: buildPriceSummary(product.sizes, t.bulkPrices)
    };
  });
}

function getAllProducts() {
  var products = [];
  CATALOG_DATA.categories.forEach(function (cat) {
    cat.products.forEach(function (product, idx) {
      var slug = product.slug || slugify(product.name);
      var tiers = normalizeTiers(product, slug);
      var colors = [], colorCodes = [], images = [];
      tiers.forEach(function (t) {
        colors = colors.concat(t.colors);
        colorCodes = colorCodes.concat(t.colorCodes);
        images = images.concat(t.images);
      });
      var mins = tiers.map(function (t) { return t.minPrice; });
      var maxs = tiers.map(function (t) { return t.maxPrice; });
      var samples = tiers.map(function (t) { return t.samplePrice; });
      products.push({
        id: product.id || (cat.id + '-' + idx),
        aliases: product.aliases || [],
        hidden: product.hidden,
        categoryId: cat.id,
        name: product.name,
        slug: slug,
        nickname: product.nickname,
        description: product.description,
        rate: Math.min.apply(null, mins),
        rateMax: Math.max.apply(null, maxs),
        samplePrice: Math.min.apply(null, samples),
        samplePriceMax: Math.max.apply(null, samples),
        moq: product.moq,
        tiers: tiers,
        colors: colors,
        colorCodes: colorCodes,
        mainImage: product.mainImage || 'm',
        mainImageTier: product.mainImageTier || 0,
        sizes: product.sizes,
        catalogUrl: product.catalogUrl || tiers[0].catalogUrl,
        images: images,
        sizeChart: product.sizeChart,
        videos: product.videos || (product.video ? [{ src: product.video }] : []),
        categoryName: cat.name,
        categoryIcon: cat.icon,
        categoryColor: cat.color
      });
    });
  });
  return products;
}

// ===== The advertised rate =====
// A ₹5 or ₹10 step at the biggest sizes is normal in the trade, so it does not
// widen the price we quote — Hoodie 320gsm reads ₹295–325, not ₹295–335, because
// the ₹335 is only the XXL step on the ₹325 colours. What DOES widen it is a
// genuinely different rate: a colour tier, or a real ladder like the 260gsm.
var NORMAL_SIZE_STEP = 10;
function headlineRange(product) {
  var low = Infinity, high = -Infinity;
  product.tiers.forEach(function (t) {
    var hi = t.maxPrice - t.minPrice <= NORMAL_SIZE_STEP ? t.minPrice : t.maxPrice;
    low = Math.min(low, t.minPrice);
    high = Math.max(high, hi);
  });
  return { low: low, high: high };
}
function rateText(product) {
  var r = headlineRange(product);
  return r.high > r.low ? '₹' + r.low + '–' + r.high : '₹' + r.low;
}

// ===== GSM pulled out of the description, used as a spec chip =====
function gsmOf(product) {
  var m = product.description.match(/(\d{3})\s*gsm/i);
  return m ? m[1] : null;
}

// ===== Slugify =====
function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ===== Get product page URL =====
function getProductPageUrl(slug) {
  return window.location.origin + '/catalog/p/' + slug + '/';
}

// ===== SVG Placeholder =====
function placeholder(icon, color, w, h) {
  return 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">' +
    '<rect width="' + w + '" height="' + h + '" fill="' + color + '" opacity="0.1"/>' +
    '<text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" font-size="' + (Math.min(w, h) * 0.25) + '">' + icon + '</text>' +
    '</svg>'
  );
}

// ===== Build price summary (group sizes by price) =====
function buildPriceSummary(sizes, bulkPrices) {
  var groups = [];
  var currentPrice = bulkPrices[0];
  var startIdx = 0;

  for (var i = 1; i <= bulkPrices.length; i++) {
    if (i === bulkPrices.length || bulkPrices[i] !== currentPrice) {
      var startSize = sizes[startIdx];
      var endSize = sizes[i - 1];
      var label = startIdx === i - 1 ? startSize : startSize + '–' + endSize;
      groups.push({ label: label, price: currentPrice });
      if (i < bulkPrices.length) {
        currentPrice = bulkPrices[i];
        startIdx = i;
      }
    }
  }
  return groups;
}

// ===== Swatch row =====
function swatchDots(codes, limit) {
  var html = '';
  var n = limit ? Math.min(codes.length, limit) : codes.length;
  for (var i = 0; i < n; i++) {
    var light = ['#FFFFFF', '#FAF5E4', '#D4C5A9', '#B0D4F1', '#87CEEB'].indexOf(codes[i].toUpperCase()) > -1;
    html += '<span class="color-dot-small' + (light ? ' cd-light' : '') + '" style="background:' + codes[i] + '"></span>';
  }
  return html;
}

// ===== Rate bands =====
// Collapse adjacent sizes whose price is identical in EVERY tier. Hoodie 320gsm
// becomes two bands (S–XL, XXL) rather than five columns; Oversize 240gsm becomes
// a single band; Oversize 260gsm keeps all eight because all eight really differ.
// One rule, so the block is only ever as big as the pricing genuinely is.
function rateBands(product) {
  var bands = [], sizes = product.sizes, tiers = product.tiers;
  var key = function (i) { return tiers.map(function (t) { return t.bulkPrices[i]; }).join('|'); };
  var start = 0;
  for (var i = 1; i <= sizes.length; i++) {
    if (i === sizes.length || key(i) !== key(start)) {
      bands.push({
        label: start === i - 1 ? sizes[start] : sizes[start] + '–' + sizes[i - 1],
        prices: tiers.map(function (t) { return t.bulkPrices[start]; })
      });
      start = i;
    }
  }
  return bands;
}

// ===== Rate block =====
// One component for every pricing shape the catalogue has: a flat rate, a rate
// that steps up at the big sizes, a long per-size ladder, and two colour tiers of
// the same garment. Sizes run across, colour rate-tiers run down, and each tier's
// colours are printed inside that tier — so colour-to-price needs no legend and
// never depends on being able to tell two hues apart.
function rateBlockHtml(product) {
  var multi = product.tiers.length > 1;
  var bands = rateBands(product);
  var wide = bands.length > 4;
  var cheapest = Math.min.apply(null, product.tiers.map(function (t) { return t.minPrice; }));

  var html = '<div class="rate-block">';
  html += '<div class="rate-head">' +
    '<span class="rate-head-title">Bulk rate per piece</span>' +
    '<span class="rate-head-moq">Min ' + (product.moq || 10) + ' pcs</span>' +
    '</div>';

  // The grid
  html += '<div class="rate-grid-wrap"><table class="rate-grid' + (wide ? ' rate-grid-wide' : '') + '">';
  html += '<tr class="rg-sizes">' + (multi ? '<th class="rg-stub"></th>' : '');
  bands.forEach(function (b) { html += '<th>' + b.label + '</th>'; });
  html += '</tr>';
  product.tiers.forEach(function (t, ti) {
    var delta = t.minPrice - cheapest;
    html += '<tr>';
    if (multi) {
      html += '<td class="rg-stub">' +
        '<span class="rg-num">' + (ti + 1) + '</span>' +
        '<span class="rg-stub-name">' + (t.colors.length === 1 ? t.colors[0] : t.colors.length + ' colours') + '</span>' +
        (delta > 0 ? '<span class="rg-delta">+₹' + delta + '</span>' : '<span class="rg-lowest">lowest</span>') +
      '</td>';
    }
    bands.forEach(function (b) { html += '<td class="rg-price">₹' + b.prices[ti] + '</td>'; });
    html += '</tr>';
  });
  html += '</table></div>';

  // Colours, printed inside their own rate
  product.tiers.forEach(function (t, ti) {
    var single = t.colors.length === 1;
    var title = !multi ? 'All colours — same rate'
      : single ? t.colors[0]
      : t.colors.length + ' colours';
    html += '<div class="rate-cols">';
    html += '<div class="rc-head">' +
      (multi ? '<span class="rg-num">' + (ti + 1) + '</span>' : '') +
      '<span class="rc-title">' + title + '</span>' +
      '<span class="rc-sample">1 pc sample ₹' + t.samplePrice + '</span>' +
    '</div>';
    if (!single) {
      html += '<div class="rc-chips">';
      t.colors.forEach(function (c, ci) {
        var code = t.colorCodes[ci];
        var light = ['#FFFFFF', '#FAF5E4', '#D4C5A9', '#B0D4F1', '#87CEEB'].indexOf(code.toUpperCase()) > -1;
        html += '<span class="rc-chip"><span class="color-dot-small' + (light ? ' cd-light' : '') + '" style="background:' + code + '"></span>' + c + '</span>';
      });
      html += '</div>';
    }
    html += '</div>';
  });

  html += '<div class="rate-foot">Minimum ' + (product.moq || 10) + ' pcs — mix any colours, sizes and products. GST 5% extra. Under ' + (product.moq || 10) + ' pcs the 1-pc sample rate applies.</div>';
  html += '</div>';
  return html;
}

// ===== Spec chips =====
function specStripHtml(product) {
  var chips = [];
  var gsm = gsmOf(product);
  if (gsm) chips.push(gsm + ' GSM');
  chips.push(product.description.indexOf('100% Cotton') > -1 || product.description.indexOf('100% cotton') > -1
    ? '100% Cotton' : '88% Cotton');
  return '<div class="spec-strip">' + chips.map(function (c) {
    return '<span class="spec-chip">' + c + '</span>';
  }).join('') + '</div>';
}

// ===== Family ladder =====
// The comparison every reseller makes ("210 or 240?") as tap-throughs instead of
// a WhatsApp question: the product's own category siblings, each with its weight
// and advertised rate.
function familyStripHtml(product, all) {
  var sibs = [];
  for (var i = 0; i < all.length; i++) {
    var s = all[i];
    if (s.hidden || s.id === product.id || s.categoryId !== product.categoryId) continue;
    sibs.push(s);
  }
  if (!sibs.length) return '';
  // A sibling that shares this product's GSM (Zip Hoodie next to Hoodie 320gsm)
  // must not be labelled by weight alone — "320 GSM" would read as this product.
  // And a weight-only label is only meaningful within the same garment family:
  // on the Kids page, "240 GSM" meaning the Shorts would be nonsense.
  function chartFam(p) { return String(p.sizeChart || '').replace(/\d+$/, ''); }
  var ownGsm = gsmOf(product);
  var gsmCount = {};
  sibs.forEach(function (s) { var g = gsmOf(s); if (g) gsmCount[g] = (gsmCount[g] || 0) + 1; });
  var html = '<div class="family-strip"><span class="family-strip-label">Also in ' +
    product.categoryName.toLowerCase() + ':</span>';
  sibs.forEach(function (s) {
    var gsm = gsmOf(s);
    var label = gsm && gsm !== ownGsm && gsmCount[gsm] === 1 && chartFam(s) === chartFam(product)
      ? gsm + ' GSM' : s.nickname;
    html += '<button class="family-chip" onclick="openProduct(\'' + s.id + '\')">' +
      label + ' <b>' + rateText(s) + '</b></button>';
  });
  html += '</div>';
  return html;
}

// ===== Open Product Detail =====
function findProduct(productId) {
  var all = getAllProducts();
  for (var i = 0; i < all.length; i++) {
    if (all[i].id === productId) return all[i];
  }
  for (var j = 0; j < all.length; j++) {
    if (all[j].aliases && all[j].aliases.indexOf(productId) > -1) return all[j];
  }
  return null;
}

function openProduct(productId, skipPush) {
  var all = getAllProducts();
  var product = findProduct(productId);
  if (!product) return;

  // Update URL hash for shareable link (skip on product pages). A modal session
  // holds exactly ONE history entry: hopping between products via family chips
  // or suggestions REPLACES it, so a single Back/close always lands on the grid
  // — closing must never replay the browsing trail product by product.
  if (!skipPush && !(typeof PRODUCT_PAGE !== 'undefined' && PRODUCT_PAGE)) {
    var overlayEl = document.getElementById('modalOverlay');
    if (overlayEl && overlayEl.classList.contains('active')) {
      history.replaceState({ product: productId }, '', '#product=' + productId);
    } else {
      history.pushState({ product: productId }, '', '#product=' + productId);
    }
  }

  var overlay = document.getElementById('modalOverlay');
  var body = document.getElementById('modalBody');
  var suggestions = document.getElementById('modalSuggestions');

  // Build swipeable images — main image first, then all product photos
  var slides = '';
  var slideCount = 0;
  var imgBasePath = '/catalog/images/' + product.slug + '/';
  var fallbackPlaceholder = placeholder(product.categoryIcon, product.categoryColor, 600, 600).replace(/'/g, "\\'");

  // On a two-rate product every photo carries the rate for the colours it belongs
  // to, so a buyer swiping the gallery can never mistake a costlier colour for the
  // headline price.
  var multiTier = product.tiers.length > 1;
  function tierLabelHtml(t) {
    if (!multiTier) return '';
    var names = t.colors.length > 2 ? t.colors.slice(0, 2).join(' · ') + ' +' + (t.colors.length - 2) : t.colors.join(' · ');
    return '<div class="swipe-slide-label">' + names + ' &nbsp;₹' + t.minPrice +
      (t.maxPrice > t.minPrice ? '–' + t.maxPrice : '') + '/pc</div>';
  }

  // A video's colour decides which tier's rate its label carries, exactly like a
  // photo. A clip whose colour is not found falls back to the cheapest tier.
  function tierOfColor(color) {
    if (!color) return product.tiers[0];
    for (var ti = 0; ti < product.tiers.length; ti++) {
      if (product.tiers[ti].colors.indexOf(color) > -1) return product.tiers[ti];
    }
    return product.tiers[0];
  }

  // Main product image (m.webp) as first slide. Only this slide loads eagerly —
  // every later slide carries data-src and is hydrated as the buyer approaches
  // it, so opening a product costs one image, not the whole 24-photo gallery.
  var mainImg = imgBasePath + (product.mainImage || 'm') + '.webp';
  var mainFallback = product.images && product.images[0] ? product.images[0] : placeholder(product.categoryIcon, product.categoryColor, 600, 600);
  var heroTier = product.tiers[product.mainImageTier || 0];
  var videos = product.videos || [];
  slides += '<div class="swipe-slide" data-hero="1">' +
    '<img src="' + mainImg + '" fetchpriority="high" alt="' + product.name + '" onerror="this.onerror=function(){this.onerror=null;this.src=\'' + fallbackPlaceholder + '\'};this.src=\'' + mainFallback.replace(/'/g, "\\'") + '\'">' +
    (videos.length ? '<button class="video-play-badge hero-video-hint" id="heroVideoHint">&#9654; Watch video</button>' : '') +
    tierLabelHtml(heroTier) +
  '</div>';
  slideCount++;

  // Real factory clips, one slide each, right after the hero so they are one
  // swipe away. The clip plays when its slide arrives and pauses when it leaves.
  videos.forEach(function (v) {
    var vt = tierOfColor(v.color);
    var vLabel = multiTier
      ? '<div class="swipe-slide-label">' + (v.color || vt.colors[0]) + ' &nbsp;₹' + vt.minPrice +
        (vt.maxPrice > vt.minPrice ? '–' + vt.maxPrice : '') + '/pc</div>'
      : '';
    slides += '<div class="swipe-slide" data-video="1">' +
      '<video data-vsrc="' + v.src + '"' + (v.poster ? ' data-poster="' + v.poster + '"' : '') + ' playsinline muted loop preload="none"></video>' +
      '<div class="video-play-badge">&#9654; Video</div>' +
      vLabel +
    '</div>';
    slideCount++;
  });

  // All product photos, tier by tier. On a two-rate product every photo carries the
  // rate for the colours it belongs to, so a buyer swiping the gallery can never
  // mistake a costlier colour for the headline price.
  product.tiers.forEach(function (t) {
    var tierLabel = tierLabelHtml(t);
    t.images.forEach(function (src, s) {
      slides += '<div class="swipe-slide">' +
        '<img data-src="' + src + '" alt="' + product.name + ' - ' + t.colors[0] + ' - Photo ' + (s + 1) + '" onerror="this.onerror=null;this.src=\'' + fallbackPlaceholder + '\'">' +
        tierLabel +
      '</div>';
      slideCount++;
    });
  });

  // Past ~10 photos a dot row is an unreadable smear — switch to a counter.
  var useDots = slideCount <= 10;
  var dots = '';
  if (useDots) {
    for (var d = 0; d < slideCount; d++) {
      dots += '<span class="swipe-dot' + (d === 0 ? ' active' : '') + '" data-index="' + d + '"></span>';
    }
  } else {
    dots = '<span class="swipe-count"><b>1</b> / ' + slideCount + '</span>';
  }

  // Color list with names
  var colorList = '';
  for (var c = 0; c < product.colors.length; c++) {
    var border = (product.colorCodes[c].toUpperCase() === '#FFFFFF' || product.colorCodes[c].toUpperCase() === '#FAF5E4')
      ? 'border:2px solid #cbd5e1;' : 'border:2px solid #e2e8f0;';
    colorList += '<div class="color-swatch">' +
      '<span class="color-dot" style="background:' + product.colorCodes[c] + ';' + border + '"></span>' +
      '<span class="color-name">' + product.colors[c] + '</span>' +
    '</div>';
  }

  // Size badges
  var sizeBadges = '';
  for (var z = 0; z < product.sizes.length; z++) {
    sizeBadges += '<span class="size-badge">' + product.sizes[z] + '</span>';
  }

  // Escape product name for onclick
  var safeName = product.name.replace(/'/g, "\\'").replace(/"/g, '&quot;');

  // The website is the order channel — a 1-pc order there gets the sample rate
  // automatically. WhatsApp exists for questions, not as a detour that ends in
  // being sent to the same website.
  var orderUrl = 'https://www.bulkplaintshirt.com/?tab=' + encodeURIComponent(product.name);

  body.innerHTML =
    '<div class="swipe-container" id="swipeContainer">' +
      '<div class="swipe-track" id="swipeTrack">' + slides + '</div>' +
      '<button class="swipe-arrow swipe-arrow-left" id="swipeLeft" aria-label="Previous">&#8249;</button>' +
      '<button class="swipe-arrow swipe-arrow-right" id="swipeRight" aria-label="Next">&#8250;</button>' +
      '<div class="swipe-dots' + (useDots ? '' : ' swipe-dots-count') + '" id="swipeDots">' + dots + '</div>' +
    '</div>' +
    '<div class="detail-info">' +
      '<div class="detail-name">' + product.name + '</div>' +
      '<div class="detail-nickname">' + product.nickname + ' \u00B7 ' + product.categoryName + '</div>' +
      rateBlockHtml(product) +
      '<a class="sample-link" href="' + orderUrl + '" target="_blank" rel="noopener">Test it first — order a 1-pc sample online</a>' +
      specStripHtml(product) +
      familyStripHtml(product, all) +
      '<div class="detail-desc">' + product.description + '</div>' +
      (product.tiers.length > 1 ? '' :
        '<div class="detail-label">Colours (' + product.colors.length + ')</div>' +
        '<div class="color-swatches">' + colorList + '</div>') +
      '<div class="detail-label">Sizes (' + product.sizes.length + ')</div>' +
      '<div class="size-badges">' + sizeBadges + '</div>' +
      '<div class="detail-actions">' +
        '<div class="detail-actions-row">' +
          (product.sizeChart ? '<button class="size-chart-toggle" onclick="openSizeChart(\'' + product.sizeChart + '\')">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M21 3H3v7h2V6h3v3h2V6h3v3h2V6h3v4h2V3z"/><path d="M21 14H3v7h18v-7zM7 17H5m4 0H8m4 0h-1m4 0h-1m4 0h-1"/></svg>' +
            ' Size Chart' +
          '</button>' : '') +
          '<button class="share-product-btn" onclick="shareProduct(\'' + safeName + '\', \'' + product.slug + '\')">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>' +
            ' Share' +
          '</button>' +
        '</div>' +
        '<div class="detail-actions-row">' +
          '<a href="https://www.bulkplaintshirt.com/?tab=' + encodeURIComponent(product.name) + '" target="_blank" rel="noopener" class="order-now-btn">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>' +
            ' Order Now' +
          '</a>' +
          '<button class="whatsapp-enquiry-btn" onclick="enquireWhatsApp(\'' + product.id + '\')" aria-label="Ask a question on WhatsApp">' +
            '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' +
            ' Ask on WhatsApp' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</div>';

  // Setup swipe
  initSwipe();

  // Render suggestions (same category first, then others)
  var sameCategory = [];
  var others = [];
  for (var j = 0; j < all.length; j++) {
    if (all[j].id === productId) continue;
    if (all[j].hidden) continue;
    if (all[j].categoryId === product.categoryId) {
      sameCategory.push(all[j]);
    } else {
      others.push(all[j]);
    }
  }
  // Shuffle others
  for (var k = others.length - 1; k > 0; k--) {
    var r = Math.floor(Math.random() * (k + 1));
    var tmp = others[k]; others[k] = others[r]; others[r] = tmp;
  }
  var picks = sameCategory.concat(others);

  var sugHtml = '<div class="suggestions-heading">You May Also Like</div>' +
    '<div class="suggestion-scroll-wrapper">' +
    '<button class="suggestion-arrow suggestion-arrow-left" aria-label="Scroll left">&#8249;</button>' +
    '<div class="suggestion-scroll">';
  for (var m = 0; m < picks.length; m++) {
    var sp = picks[m];
    var sDots = '';
    var sMaxDots = Math.min(sp.colorCodes.length, 4);
    for (var sc = 0; sc < sMaxDots; sc++) {
      sDots += '<span class="color-dot-small" style="background:' + sp.colorCodes[sc] + '"></span>';
    }
    var sugMainImg = '/catalog/images/' + sp.slug + '/' + (sp.mainImage || 'm') + '.webp';
    var sugFallback = sp.images && sp.images[0] ? sp.images[0] : placeholder(sp.categoryIcon, sp.categoryColor, 200, 200);
    var sugPlaceholder = placeholder(sp.categoryIcon, sp.categoryColor, 200, 200).replace(/'/g, "\\'");

    sugHtml += '<div class="suggestion-card" onclick="openProduct(\'' + sp.id + '\')">' +
      '<div class="suggestion-card-image" style="background:' + sp.categoryColor + '10">' +
        '<img data-src="' + sugMainImg + '" alt="' + sp.name + '" onerror="this.onerror=function(){this.onerror=null;this.src=\'' + sugPlaceholder + '\'};this.src=\'' + sugFallback.replace(/'/g, "\\'") + '\'">' +
      '</div>' +
      '<div class="suggestion-card-body">' +
        '<div class="suggestion-card-name">' + sp.name + '</div>' +
        '<div class="suggestion-card-rate">\u20B9' + sp.rate + '/pc</div>' +
        '<div class="product-card-colors">' + sDots + '</div>' +
      '</div>' +
    '</div>';
  }
  sugHtml += '</div>' +
    '<button class="suggestion-arrow suggestion-arrow-right" aria-label="Scroll right">&#8250;</button>' +
    '</div>';

  // Deep-link arrivals land inside one product and never learn the grid exists —
  // give them a plain path to it.
  var visibleCount = 0;
  for (var vc = 0; vc < all.length; vc++) { if (!all[vc].hidden) visibleCount++; }
  sugHtml += (typeof PRODUCT_PAGE !== 'undefined' && PRODUCT_PAGE)
    ? '<a class="browse-all-btn" href="/catalog/">Browse all ' + visibleCount + ' products &rarr;</a>'
    : '<button class="browse-all-btn" onclick="closeModal()">Browse all ' + visibleCount + ' products &rarr;</button>';
  suggestions.innerHTML = sugHtml;

  // The always-visible order bar. This is the moment the buyer has just
  // understood the rate — it must never require a scroll to act on. The website
  // takes the order; WhatsApp is there for the question that precedes it.
  var ctaBar = document.getElementById('modalCta');
  if (ctaBar) {
    var barRate = rateText(product);
    ctaBar.innerHTML =
      '<button class="cta-ask" onclick="enquireWhatsApp(\'' + product.id + '\')">' +
        '<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' +
        '<small>Ask</small>' +
      '</button>' +
      '<a class="cta-order" href="' + orderUrl + '" target="_blank" rel="noopener">' +
        '<b>Order now</b><small>' + barRate + '/pc · min ' + (product.moq || 10) + ' pcs</small>' +
      '</a>';
  }

  // The 16 thumbnails only download when the row actually approaches the screen
  // — native loading=lazy prefetches them ~1250px early, which on a product open
  // meant the entire row rode along with the hero.
  (function () {
    var hydrateSugs = function () {
      var imgs = suggestions.querySelectorAll('img[data-src]');
      for (var i = 0; i < imgs.length; i++) {
        imgs[i].src = imgs[i].getAttribute('data-src');
        imgs[i].removeAttribute('data-src');
      }
    };
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { hydrateSugs(); io.disconnect(); }
      }, { rootMargin: '200px' });
      io.observe(suggestions);
    } else {
      hydrateSugs();
    }
  })();

  // Desktop arrow scroll handlers
  var scrollWrapper = suggestions.querySelector('.suggestion-scroll-wrapper');
  if (scrollWrapper) {
    var scrollEl = scrollWrapper.querySelector('.suggestion-scroll');
    var leftBtn = scrollWrapper.querySelector('.suggestion-arrow-left');
    var rightBtn = scrollWrapper.querySelector('.suggestion-arrow-right');
    var updateArrows = function () {
      leftBtn.style.display = scrollEl.scrollLeft > 5 ? '' : 'none';
      rightBtn.style.display = scrollEl.scrollLeft < scrollEl.scrollWidth - scrollEl.clientWidth - 5 ? '' : 'none';
    };
    leftBtn.addEventListener('click', function () {
      scrollEl.scrollBy({ left: -260, behavior: 'smooth' });
    });
    rightBtn.addEventListener('click', function () {
      scrollEl.scrollBy({ left: 260, behavior: 'smooth' });
    });
    scrollEl.addEventListener('scroll', updateArrows);
    updateArrows();
  }

  // Show modal. The body class also hides the site header, the home-page FAB and
  // the crawler-only article — the sheet owns the screen with a clean edge.
  overlay.classList.add('active');
  document.body.classList.add('modal-open');
  document.body.style.overflow = 'hidden';
  document.querySelector('.modal-container').scrollTop = 0;
}

// ===== Swipe Image Carousel =====
function initSwipe() {
  var container = document.getElementById('swipeContainer');
  var track = document.getElementById('swipeTrack');
  var dotsContainer = document.getElementById('swipeDots');
  if (!track) return;

  var slides = track.children;
  var currentIndex = 0;
  var startX = 0;
  var startY = 0;
  var diffX = 0;
  var axis = null; // 'x' once the drag commits to the carousel, 'y' when it belongs to the page scroll
  var dragging = false;
  var didDrag = false;    // a drag that returns to its start point is still not a tap
  var lastTouchEnd = 0;   // guards the synthetic click that follows a touch tap

  var leftArrow = document.getElementById('swipeLeft');
  var rightArrow = document.getElementById('swipeRight');

  // Only the slide being viewed and its two neighbours hold real image URLs.
  // Everything else waits as data-src, so opening a product downloads one photo
  // instead of the whole gallery, and each swipe stays a step ahead of the buyer.
  function hydrate(i) {
    if (i < 0 || i >= slides.length) return;
    var img = slides[i].querySelector('img[data-src]');
    if (img) {
      img.src = img.getAttribute('data-src');
      img.removeAttribute('data-src');
    }
    var vid = slides[i].querySelector('video[data-poster]');
    if (vid) {
      vid.poster = vid.getAttribute('data-poster');
      vid.removeAttribute('data-poster');
    }
  }

  // The clip plays while its slide is on screen and pauses the moment it leaves.
  // src is attached on first arrival so the 4-5MB file is only ever streamed for
  // a slide the buyer actually reached.
  function syncVideos() {
    for (var i = 0; i < slides.length; i++) {
      var vid = slides[i].querySelector('video');
      if (!vid) continue;
      if (i === currentIndex) {
        if (!vid.getAttribute('src')) vid.src = vid.getAttribute('data-vsrc');
        vid.play().catch(function () {});
      } else if (!vid.paused) {
        vid.pause();
      }
    }
  }

  function updateArrows() {
    if (leftArrow) leftArrow.style.display = currentIndex > 0 ? '' : 'none';
    if (rightArrow) rightArrow.style.display = currentIndex < slides.length - 1 ? '' : 'none';
  }

  function goToSlide(index) {
    if (index < 0) index = 0;
    if (index >= slides.length) index = slides.length - 1;
    currentIndex = index;
    hydrate(currentIndex);
    hydrate(currentIndex + 1);
    hydrate(currentIndex - 1);
    track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
    var allDots = dotsContainer.querySelectorAll('.swipe-dot');
    for (var i = 0; i < allDots.length; i++) {
      allDots[i].classList.toggle('active', i === currentIndex);
    }
    var counter = dotsContainer.querySelector('.swipe-count b');
    if (counter) counter.textContent = currentIndex + 1;
    updateArrows();
    syncVideos();
  }

  if (leftArrow) leftArrow.addEventListener('click', function () { goToSlide(currentIndex - 1); });
  if (rightArrow) rightArrow.addEventListener('click', function () { goToSlide(currentIndex + 1); });
  updateArrows();
  hydrate(1);

  var heroHint = document.getElementById('heroVideoHint');
  if (heroHint) heroHint.addEventListener('click', function () { goToSlide(1); });

  function snapBack() {
    track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
  }

  container.addEventListener('touchstart', function (e) {
    if (e.touches.length > 1) { dragging = false; return; } // pinch-zoom is not ours
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    axis = null;
    dragging = true;
    didDrag = false;
    diffX = 0;
    track.style.transition = 'none';
  });

  // Axis lock: the first move decides whether this gesture is a swipe or a page
  // scroll. A vertical scroll over the photo used to jiggle the carousel.
  container.addEventListener('touchmove', function (e) {
    if (e.touches.length > 1) {
      if (dragging) { dragging = false; track.style.transition = 'transform 0.3s ease'; snapBack(); }
      return;
    }
    if (!dragging) return;
    var dx = e.touches[0].clientX - startX;
    var dy = e.touches[0].clientY - startY;
    if (!axis) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (axis === 'y') { dragging = false; track.style.transition = 'transform 0.3s ease'; return; }
    }
    if (e.cancelable) e.preventDefault();
    diffX = dx;
    if (Math.abs(diffX) > 8) didDrag = true;
    var offset = -(currentIndex * 100) + (diffX / container.offsetWidth * 100);
    track.style.transform = 'translateX(' + offset + '%)';
  }, { passive: false });

  container.addEventListener('touchend', function (e) {
    lastTouchEnd = Date.now();
    if (!dragging) { diffX = 0; return; }
    dragging = false;
    track.style.transition = 'transform 0.3s ease';
    if (diffX > 50) {
      goToSlide(currentIndex - 1);
    } else if (diffX < -50) {
      goToSlide(currentIndex + 1);
    } else if (didDrag) {
      // dragged out and back: settle, never navigate or toggle
      goToSlide(currentIndex);
    } else {
      // A stationary touch is a tap. Left third = previous, right third = next —
      // the pattern this audience already knows from status stories. On a video
      // slide a tap toggles playback instead — and must NOT run goToSlide after,
      // whose syncVideos would instantly undo the pause.
      var t = e.target;
      var interactive = t.closest && (t.closest('.swipe-dots') || t.closest('.swipe-arrow') || t.closest('.hero-video-hint'));
      var toggledVideo = false;
      if (!interactive) {
        var slide = slides[currentIndex];
        var vid = slide && slide.querySelector('video');
        if (vid) {
          toggledVideo = true;
          if (vid.paused) { if (!vid.getAttribute('src')) vid.src = vid.getAttribute('data-vsrc'); vid.play().catch(function () {}); }
          else vid.pause();
        } else {
          var x = e.changedTouches[0].clientX - container.getBoundingClientRect().left;
          if (x < container.offsetWidth / 3) goToSlide(currentIndex - 1);
          else if (x > container.offsetWidth * 2 / 3) goToSlide(currentIndex + 1);
        }
      }
      if (toggledVideo) snapBack();
      else goToSlide(currentIndex);
    }
    diffX = 0;
  });

  // iOS cancels the touch (edge back-swipe, incoming call, control centre)
  // without a touchend — snap home or the track sits frozen between two slides.
  container.addEventListener('touchcancel', function () {
    dragging = false;
    diffX = 0;
    track.style.transition = 'transform 0.3s ease';
    snapBack();
  });

  // Desktop: click a video to pause/replay. The timestamp guard swallows the
  // synthetic click that follows a touch tap, which already toggled.
  container.addEventListener('click', function (e) {
    if (Date.now() - lastTouchEnd < 700) return;
    var t = e.target;
    if (!t || t.tagName !== 'VIDEO') return;
    if (t.paused) { if (!t.getAttribute('src')) t.src = t.getAttribute('data-vsrc'); t.play().catch(function () {}); }
    else t.pause();
  });

  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('swipe-dot')) {
      goToSlide(parseInt(e.target.getAttribute('data-index')));
    }
  });
}

// ===== Size Chart Popup =====
function openSizeChart(chartKey) {
  var chart = SIZE_CHARTS[chartKey];
  if (!chart) return;
  var html = '<div class="sc-popup-container">';
  html += '<div class="sc-popup-header"><span class="sc-popup-title">Size Chart</span><button class="sc-popup-close" onclick="closeSizeChart()">&times;</button></div>';
  html += '<div class="sc-popup-body">';
  html += '<div class="sc-chart-name">' + chart.title + '</div>';
  html += '<div class="sc-table-wrap"><table class="sc-table"><thead><tr><th></th>';
  for (var i = 0; i < chart.sizes.length; i++) {
    html += '<th>' + chart.sizes[i] + '</th>';
  }
  html += '</tr></thead><tbody>';
  for (var r = 0; r < chart.rows.length; r++) {
    html += '<tr><td class="sc-label">' + chart.rows[r].label + '</td>';
    for (var v = 0; v < chart.rows[r].values.length; v++) {
      html += '<td>' + chart.rows[r].values[v] + '</td>';
    }
    html += '</tr>';
  }
  html += '</tbody></table></div>';
  html += '<div class="sc-note">All in inches. Expect tolerance by \u00B11 inch.</div>';
  html += '</div>';
  html += '</div>';
  var popup = document.getElementById('sizeChartPopup');
  popup.innerHTML = html;
  popup.classList.add('active');
  // Only fade the edge when the chart genuinely overflows, so a chart that fits
  // does not look like it is hiding a column.
  var wrap = popup.querySelector('.sc-table-wrap');
  if (wrap && wrap.scrollWidth > wrap.clientWidth + 1) wrap.classList.add('is-scrollable');
}
function closeSizeChart() {
  document.getElementById('sizeChartPopup').classList.remove('active');
}

// ===== Close Modal =====
function closeModal(skipHistory) {
  var overlay = document.getElementById('modalOverlay');
  if (!overlay.classList.contains('active')) return;
  overlay.classList.remove('active');
  document.body.classList.remove('modal-open');
  document.body.style.overflow = '';
  var vids = overlay.querySelectorAll('video');
  for (var i = 0; i < vids.length; i++) { if (!vids[i].paused) vids[i].pause(); }
  // Product page: close → go to main catalog
  if (typeof PRODUCT_PAGE !== 'undefined' && PRODUCT_PAGE) {
    window.location.href = PRODUCT_PAGE.baseUrl;
    return;
  }
  // Go back in history to remove the product hash (unless already triggered by popstate)
  if (!skipHistory && window.location.hash.indexOf('#product=') === 0) {
    history.back();
  }
}

// ===== Share Product =====
function shareProduct(name, slug) {
  var url = getProductPageUrl(slug);
  var text = name + ' — sale91.com Catalog';

  if (navigator.share) {
    navigator.share({ title: text, url: url }).catch(function() {});
  } else {
    // Fallback: copy to clipboard
    var temp = document.createElement('input');
    document.body.appendChild(temp);
    temp.value = url;
    temp.select();
    document.execCommand('copy');
    document.body.removeChild(temp);
    showToast('Link copied!');
  }
}

// ===== Toast notification =====
function showToast(msg) {
  var existing = document.querySelector('.toast-msg');
  if (existing) existing.remove();
  var el = document.createElement('div');
  el.className = 'toast-msg';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(function() { el.remove(); }, 2000);
}

// ===== WhatsApp Enquiry =====
// whatsapp.sale91.com is a stub that hard-redirects to api.whatsapp.com with a
// fixed "Share Details" message, so it cannot carry a prefill. Going direct is
// the only way an enquiry can arrive already saying what it is about. Keep this
// number in sync with that stub.
var WA_NUMBER = '919336695049';
function waLink(text) {
  return 'https://api.whatsapp.com/send/?phone=' + WA_NUMBER + '&text=' + encodeURIComponent(text);
}
// WhatsApp is the QUESTION channel — orders go straight to the website, because
// a WhatsApp "order" just gets redirected to the same website anyway. The
// prefill names the product so the answer can be immediate.
function enquireWhatsApp(productId) {
  var p = findProduct(productId);
  if (!p) { window.open(waLink('Hi, I saw the sale91 catalog. I have a question.'), '_blank'); return; }
  var lines = ['Hi, I have a question about *' + p.name + '* (' + p.nickname + ').'];
  lines.push(getProductPageUrl(p.slug));
  window.open(waLink(lines.join('\n')), '_blank');
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', function () {
  // Product card click handler — intercept <a> tags to open modal
  var grid = document.getElementById('productGrid');
  if (grid) {
    grid.addEventListener('click', function (e) {
      var card = e.target.closest('.product-card');
      if (card && card.dataset.id) {
        e.preventDefault();
        openProduct(card.dataset.id);
      }
    });
  }

  // Switching category four screens deep used to keep the old scroll offset and
  // dump the buyer past the end of the now-shorter grid — snap to the chips.
  var catTabs = document.getElementById('categoryTabs');
  if (catTabs) {
    var catRadios = document.querySelectorAll('.cat-radio');
    var onCatChange = function () {
      var top = catTabs.offsetTop;
      if (window.pageYOffset > top) window.scrollTo(0, top);
    };
    for (var ci = 0; ci < catRadios.length; ci++) {
      catRadios[ci].addEventListener('change', onCatChange);
    }
  }

  // WhatsApp FAB
  var fab = document.getElementById('whatsappBtn');
  if (fab) {
    fab.addEventListener('click', function () {
      window.open(waLink('Hi, I saw the sale91 catalog (sale91.com/catalog). I have a question.'), '_blank');
    });
  }

  // Modal close
  document.getElementById('modalOverlay').addEventListener('click', function (e) {
    if (e.target === this) closeModal();
  });
  document.getElementById('modalClose').addEventListener('click', function () {
    closeModal();
  });
  // Escape dismisses the topmost layer only — the size chart sits above the
  // product modal, and closing the one underneath left it floating over the grid.
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var sc = document.getElementById('sizeChartPopup');
    if (sc && sc.classList.contains('active')) { closeSizeChart(); return; }
    closeModal();
  });

  // ===== Product Page Mode =====
  if (typeof PRODUCT_PAGE !== 'undefined' && PRODUCT_PAGE) {
    if (findProduct(PRODUCT_PAGE.id)) {
      openProduct(PRODUCT_PAGE.id, true);
    } else {
      // A /p/ page for a product no longer in the data: fall back to the
      // static article instead of a hidden-header blank.
      document.body.classList.remove('modal-open');
    }
    return;
  }

  // ===== Catalog: History / Back Button =====
  // Back closes an open product and otherwise means what the browser means by
  // Back. It used to push a synthetic entry that sent the visitor to the
  // storefront instead, which stranded anyone arriving from search or WhatsApp.
  var startHash = window.location.hash;

  window.addEventListener('popstate', function (e) {
    var state = e.state;
    if (state && state.product) openProduct(state.product, true);
    else closeModal(true);
  });

  // Open product from hash URL (on refresh / direct link)
  if (startHash.indexOf('#product=') === 0) {
    var pid = startHash.replace('#product=', '');
    if (pid) {
      openProduct(pid);
    }
  }
});
