// ===== State =====
var currentCategory = 'all';

// ===== Flatten all products with category info =====
function getAllProducts() {
  var products = [];
  CATALOG_DATA.categories.forEach(function (cat) {
    cat.products.forEach(function (product, idx) {
      products.push({
        id: cat.id + '-' + idx,
        categoryId: cat.id,
        name: product.name,
        nickname: product.nickname,
        description: product.description,
        rate: product.rate,
        samplePrice: product.samplePrice,
        weight: product.weight,
        colors: product.colors,
        colorCodes: product.colorCodes,
        sizes: product.sizes,
        bulkPrices: product.bulkPrices,
        catalogUrl: product.catalogUrl,
        images: product.images || product.colorCodes.map(function (_, i) {
          return 'images/' + slugify(product.name) + '/' + (i + 1) + '.webp';
        }),
        video: product.video,
        categoryName: cat.name,
        categoryIcon: cat.icon,
        categoryColor: cat.color
      });
    });
  });
  return products;
}

// ===== Slugify =====
function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ===== Get product page URL =====
function getProductPageUrl(productName) {
  var slug = slugify(productName);
  var path = window.location.pathname;
  var idx = path.indexOf('/catalog');
  var base = idx >= 0 ? path.substring(0, idx + 8) : '';
  return window.location.origin + base + '/p/' + slug + '/';
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

// ===== Render Category Tabs =====
function renderCategoryTabs() {
  var container = document.getElementById('categoryTabs');
  if (!container) return;

  var all = getAllProducts();
  var html = '<button class="category-tab active" data-category="all">All <span class="tab-count">' + all.length + '</span></button>';

  CATALOG_DATA.categories.forEach(function (cat) {
    html += '<button class="category-tab" data-category="' + cat.id + '">' +
      cat.icon + ' ' + cat.name +
      ' <span class="tab-count">' + cat.products.length + '</span>' +
    '</button>';
  });

  container.innerHTML = html;

  // Tab click handler
  container.addEventListener('click', function (e) {
    var tab = e.target.closest('.category-tab');
    if (!tab) return;

    currentCategory = tab.getAttribute('data-category');
    container.querySelectorAll('.category-tab').forEach(function (t) {
      t.classList.toggle('active', t === tab);
    });
    renderAllProducts();
  });
}

// ===== Render All Products — Grid =====
function renderAllProducts() {
  var grid = document.getElementById('productGrid');
  if (!grid) return;

  var all = getAllProducts();
  var filtered = currentCategory === 'all'
    ? all
    : all.filter(function (p) { return p.categoryId === currentCategory; });

  var html = '';

  for (var i = 0; i < filtered.length; i++) {
    var p = filtered[i];
    var dots = '';
    var maxDots = Math.min(p.colorCodes.length, 6);
    for (var c = 0; c < maxDots; c++) {
      var border = (p.colorCodes[c].toUpperCase() === '#FFFFFF' || p.colorCodes[c].toUpperCase() === '#FAF5E4')
        ? 'border:1.5px solid #cbd5e1;' : 'border:1.5px solid #e2e8f0;';
      dots += '<span class="color-dot-small" style="background:' + p.colorCodes[c] + ';' + border + '"></span>';
    }
    if (p.colorCodes.length > 6) {
      dots += '<span style="font-size:10px;color:#94a3b8;font-weight:600;">+' + (p.colorCodes.length - 6) + '</span>';
    }

    html += '<div class="product-card" onclick="openProduct(\'' + p.id + '\')">' +
      '<div class="product-card-image" style="background:' + p.categoryColor + '10">' +
        '<img src="' + (p.images && p.images[0] ? p.images[0] : placeholder(p.categoryIcon, p.categoryColor, 400, 400)) + '" alt="' + p.name + '" loading="lazy" onerror="this.onerror=null;this.src=\'' + placeholder(p.categoryIcon, p.categoryColor, 400, 400).replace(/'/g, "\\'") + '\'">' +
        '<span class="product-card-badge">' + p.weight + ' kg</span>' +
      '</div>' +
      '<div class="product-card-body">' +
        '<div class="product-card-name">' + p.name + '</div>' +
        '<div class="product-card-nickname">' + p.nickname + '</div>' +
        '<div class="product-card-rate">\u20B9' + p.rate + '/pc <span class="rate-label">Bulk</span></div>' +
        '<div class="product-card-sample">Sample: \u20B9' + p.samplePrice + '/pc</div>' +
        '<div class="product-card-colors">' + dots + '</div>' +
      '</div>' +
    '</div>';
  }

  if (filtered.length === 0) {
    html = '<div style="grid-column:1/-1;text-align:center;padding:40px 16px;color:#94a3b8;">No products in this category</div>';
  }

  grid.innerHTML = html;
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

// ===== Open Product Detail =====
function openProduct(productId, skipPush) {
  var all = getAllProducts();
  var product = null;
  for (var i = 0; i < all.length; i++) {
    if (all[i].id === productId) { product = all[i]; break; }
  }
  if (!product) return;

  // Update URL hash for shareable link (skip on product pages)
  if (!skipPush && !(typeof PRODUCT_PAGE !== 'undefined' && PRODUCT_PAGE)) {
    history.pushState({ product: productId }, '', '#product=' + productId);
  }

  var overlay = document.getElementById('modalOverlay');
  var body = document.getElementById('modalBody');
  var suggestions = document.getElementById('modalSuggestions');

  // Build swipeable images (one per color variant)
  var slides = '';
  var slideCount = product.colorCodes.length;

  if (product.video) {
    slides += '<div class="swipe-slide">' +
      '<video src="' + product.video + '" playsinline muted loop preload="metadata" onclick="this.paused?this.play():this.pause()"></video>' +
      '<div class="video-play-badge">&#9654; Video</div>' +
      '<div class="swipe-slide-label">Product Video</div>' +
    '</div>';
    slideCount++;
  }

  for (var s = 0; s < product.colorCodes.length; s++) {
    slides += '<div class="swipe-slide">' +
      '<img src="' + (product.images && product.images[s] ? product.images[s] : placeholder(product.categoryIcon, product.colorCodes[s], 600, 600)) + '" alt="' + product.colors[s] + '" onerror="this.onerror=null;this.src=\'' + placeholder(product.categoryIcon, product.colorCodes[s], 600, 600).replace(/'/g, "\\'") + '\'">' +
      '<div class="swipe-slide-label">' + product.colors[s] + '</div>' +
    '</div>';
  }

  var dots = '';
  for (var d = 0; d < slideCount; d++) {
    dots += '<span class="swipe-dot' + (d === 0 ? ' active' : '') + '" data-index="' + d + '"></span>';
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

  // Price table
  var priceGroups = buildPriceSummary(product.sizes, product.bulkPrices);
  var priceTableHtml = '<div class="price-table-wrap"><table class="price-table">';
  priceTableHtml += '<tr><th>Size</th><th>Bulk Price/pc</th></tr>';
  for (var pt = 0; pt < priceGroups.length; pt++) {
    priceTableHtml += '<tr><td>' + priceGroups[pt].label + '</td><td class="price-cell">\u20B9' + priceGroups[pt].price + '</td></tr>';
  }
  priceTableHtml += '</table></div>';

  // Meta tags (weight, gsm)
  var metaHtml = '<div class="detail-meta">' +
    '<span class="detail-meta-tag">\u2696\uFE0F ' + product.weight + ' kg</span>' +
  '</div>';

  // Escape product name for onclick
  var safeName = product.name.replace(/'/g, "\\'").replace(/"/g, '&quot;');

  body.innerHTML =
    '<div class="swipe-container" id="swipeContainer">' +
      '<div class="swipe-track" id="swipeTrack">' + slides + '</div>' +
      '<button class="swipe-arrow swipe-arrow-left" id="swipeLeft" aria-label="Previous">&#8249;</button>' +
      '<button class="swipe-arrow swipe-arrow-right" id="swipeRight" aria-label="Next">&#8250;</button>' +
      '<div class="swipe-dots" id="swipeDots">' + dots + '</div>' +
    '</div>' +
    '<div class="detail-info">' +
      '<div class="detail-name">' + product.name + '</div>' +
      '<div class="detail-nickname">' + product.nickname + ' \u00B7 ' + product.categoryName + '</div>' +
      '<div class="detail-rate">\u20B9' + product.rate + '/pc <span style="font-size:14px;color:#64748b;font-weight:600;">Bulk</span></div>' +
      '<div class="detail-sample-price">Sample: <strong>\u20B9' + product.samplePrice + '/pc</strong></div>' +
      metaHtml +
      '<div class="detail-desc">' + product.description + '</div>' +
      '<div class="detail-label">Pricing by Size</div>' +
      priceTableHtml +
      '<div class="detail-label">Colors (' + product.colors.length + ')</div>' +
      '<div class="color-swatches">' + colorList + '</div>' +
      '<div class="detail-label">Sizes (' + product.sizes.length + ')</div>' +
      '<div class="size-badges">' + sizeBadges + '</div>' +
      '<div class="size-chart-section">' +
        '<button class="size-chart-toggle" onclick="this.parentElement.classList.toggle(\'open\')">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M21 3H3v7h2V6h3v3h2V6h3v3h2V6h3v4h2V3z"/><path d="M21 14H3v7h18v-7zM7 17H5m4 0H8m4 0h-1m4 0h-1m4 0h-1"/></svg>' +
          ' Size Chart' +
          '<svg class="size-chart-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><polyline points="6 9 12 15 18 9"/></svg>' +
        '</button>' +
        '<div class="size-chart-image">' +
          '<img src="images/' + slugify(product.name) + '/size-chart.webp" alt="Size Chart for ' + product.name + '" onerror="this.parentElement.parentElement.style.display=\'none\'">' +
        '</div>' +
      '</div>' +
      '<div class="detail-actions">' +
        '<button class="share-product-btn" onclick="shareProduct(\'' + safeName + '\', \'' + product.id + '\')">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>' +
          ' Share This Product' +
        '</button>' +
        '<a href="https://sale91.com" target="_blank" rel="noopener" class="order-now-btn">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>' +
          ' Order Now' +
        '</a>' +
        '<button class="whatsapp-enquiry-btn" onclick="enquireWhatsApp(\'' + safeName + '\', ' + product.rate + ', ' + product.samplePrice + ', \'' + product.nickname + '\')">' +
          '<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' +
          ' Enquire on WhatsApp' +
        '</button>' +
      '</div>' +
    '</div>';

  // Setup swipe
  initSwipe();

  // Render suggestions (same category first, then others)
  var sameCategory = [];
  var others = [];
  for (var j = 0; j < all.length; j++) {
    if (all[j].id === productId) continue;
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
    sugHtml += '<div class="suggestion-card" onclick="openProduct(\'' + sp.id + '\')">' +
      '<div class="suggestion-card-image" style="background:' + sp.categoryColor + '10">' +
        '<img src="' + (sp.images && sp.images[0] ? sp.images[0] : placeholder(sp.categoryIcon, sp.categoryColor, 200, 200)) + '" alt="' + sp.name + '" loading="lazy" onerror="this.onerror=null;this.src=\'' + placeholder(sp.categoryIcon, sp.categoryColor, 200, 200).replace(/'/g, "\\'") + '\'">' +
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
  suggestions.innerHTML = sugHtml;

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

  // Show modal
  overlay.classList.add('active');
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
  var diffX = 0;
  var dragging = false;

  var leftArrow = document.getElementById('swipeLeft');
  var rightArrow = document.getElementById('swipeRight');

  function updateArrows() {
    if (leftArrow) leftArrow.style.display = currentIndex > 0 ? '' : 'none';
    if (rightArrow) rightArrow.style.display = currentIndex < slides.length - 1 ? '' : 'none';
  }

  function goToSlide(index) {
    if (index < 0) index = 0;
    if (index >= slides.length) index = slides.length - 1;
    currentIndex = index;
    track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
    var allDots = dotsContainer.querySelectorAll('.swipe-dot');
    for (var i = 0; i < allDots.length; i++) {
      allDots[i].classList.toggle('active', i === currentIndex);
    }
    updateArrows();
  }

  if (leftArrow) leftArrow.addEventListener('click', function () { goToSlide(currentIndex - 1); });
  if (rightArrow) rightArrow.addEventListener('click', function () { goToSlide(currentIndex + 1); });
  updateArrows();

  container.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
    dragging = true;
    track.style.transition = 'none';
  });

  container.addEventListener('touchmove', function (e) {
    if (!dragging) return;
    diffX = e.touches[0].clientX - startX;
    var offset = -(currentIndex * 100) + (diffX / container.offsetWidth * 100);
    track.style.transform = 'translateX(' + offset + '%)';
  });

  container.addEventListener('touchend', function () {
    dragging = false;
    track.style.transition = 'transform 0.3s ease';
    if (diffX > 50) {
      goToSlide(currentIndex - 1);
    } else if (diffX < -50) {
      goToSlide(currentIndex + 1);
    } else {
      goToSlide(currentIndex);
    }
    diffX = 0;
  });

  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('swipe-dot')) {
      goToSlide(parseInt(e.target.getAttribute('data-index')));
    }
  });
}

// ===== Close Modal =====
function closeModal(skipHistory) {
  var overlay = document.getElementById('modalOverlay');
  if (!overlay.classList.contains('active')) return;
  overlay.classList.remove('active');
  document.body.style.overflow = '';
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
function shareProduct(name, productId) {
  var url = getProductPageUrl(name);
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
function enquireWhatsApp(name, bulkRate, sampleRate, nickname) {
  window.open('https://whatsapp.sale91.com', '_blank');
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', function () {
  // Render category tabs
  renderCategoryTabs();

  // WhatsApp FAB
  var fab = document.getElementById('whatsappBtn');
  if (fab) {
    fab.addEventListener('click', function () {
      window.open('https://whatsapp.sale91.com', '_blank');
    });
  }

  // Modal close
  document.getElementById('modalOverlay').addEventListener('click', function (e) {
    if (e.target === this) closeModal();
  });
  document.getElementById('modalClose').addEventListener('click', function () {
    closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  // ===== Product Page Mode =====
  if (typeof PRODUCT_PAGE !== 'undefined' && PRODUCT_PAGE) {
    openProduct(PRODUCT_PAGE.id, true);
    return;
  }

  // ===== Catalog: History / Back Button =====
  // Capture hash before history setup overwrites it
  var startHash = window.location.hash;

  history.replaceState({ page: 'exit' }, '');
  history.pushState({ page: 'catalog' }, '', window.location.pathname + window.location.search);

  window.addEventListener('popstate', function (e) {
    var state = e.state;
    if (state && state.product) {
      openProduct(state.product, true);
    } else if (state && state.page === 'catalog') {
      closeModal(true);
    } else {
      window.location.href = 'https://sale91.com';
    }
  });

  // Open product from hash URL (on refresh / direct link)
  if (startHash.indexOf('#product=') === 0) {
    var pid = startHash.replace('#product=', '');
    if (pid) {
      openProduct(pid);
    }
  }
});
