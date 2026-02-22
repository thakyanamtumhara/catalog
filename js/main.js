// ===== Flatten all products with category info =====
function getAllProducts() {
  var products = [];
  CATALOG_DATA.categories.forEach(function (cat) {
    cat.products.forEach(function (product, idx) {
      products.push({
        id: cat.id + '-' + idx,
        name: product.name,
        description: product.description,
        rate: product.rate,
        colors: product.colors,
        colorCodes: product.colorCodes,
        sizes: product.sizes,
        categoryName: cat.name,
        categoryIcon: cat.icon,
        categoryColor: cat.color
      });
    });
  });
  return products;
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

// ===== Render All Products — Grid: photo + rate + color dots =====
function renderAllProducts() {
  var grid = document.getElementById('productGrid');
  if (!grid) return;

  var all = getAllProducts();
  var html = '';

  for (var i = 0; i < all.length; i++) {
    var p = all[i];
    var dots = '';
    for (var c = 0; c < p.colorCodes.length; c++) {
      dots += '<span class="color-dot-small" style="background:' + p.colorCodes[c] + '"></span>';
    }

    html += '<div class="product-card" onclick="openProduct(\'' + p.id + '\')">' +
      '<div class="product-card-image" style="background:' + p.categoryColor + '10">' +
        '<img src="' + placeholder(p.categoryIcon, p.categoryColor, 400, 400) + '" alt="' + p.name + '">' +
      '</div>' +
      '<div class="product-card-body">' +
        '<div class="product-card-name">' + p.name + '</div>' +
        '<div class="product-card-rate">\u20B9' + p.rate.toLocaleString('en-IN') + '</div>' +
        '<div class="product-card-colors">' + dots + '</div>' +
      '</div>' +
    '</div>';
  }

  grid.innerHTML = html;
}

// ===== Open Product Detail =====
function openProduct(productId) {
  var all = getAllProducts();
  var product = null;
  for (var i = 0; i < all.length; i++) {
    if (all[i].id === productId) { product = all[i]; break; }
  }
  if (!product) return;

  var overlay = document.getElementById('modalOverlay');
  var body = document.getElementById('modalBody');
  var suggestions = document.getElementById('modalSuggestions');

  // Build swipeable images (one per color variant + optional video)
  var slides = '';
  var slideCount = product.colorCodes.length;

  // If product has a video, add it as first slide
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
      '<img src="' + (product.images && product.images[s] ? product.images[s] : placeholder(product.categoryIcon, product.colorCodes[s], 600, 600)) + '" alt="' + product.colors[s] + '">' +
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
    colorList += '<div class="color-swatch">' +
      '<span class="color-dot" style="background:' + product.colorCodes[c] + '"></span>' +
      '<span class="color-name">' + product.colors[c] + '</span>' +
    '</div>';
  }

  // Size badges
  var sizeBadges = '';
  for (var z = 0; z < product.sizes.length; z++) {
    sizeBadges += '<span class="size-badge">' + product.sizes[z] + '</span>';
  }

  body.innerHTML =
    '<div class="swipe-container" id="swipeContainer">' +
      '<div class="swipe-track" id="swipeTrack">' + slides + '</div>' +
      '<div class="swipe-dots" id="swipeDots">' + dots + '</div>' +
    '</div>' +
    '<div class="detail-info">' +
      '<div class="detail-name">' + product.name + '</div>' +
      '<div class="detail-rate">\u20B9' + product.rate.toLocaleString('en-IN') + '</div>' +
      '<div class="detail-desc">' + product.description + '</div>' +
      '<div class="detail-label">Colors</div>' +
      '<div class="color-swatches">' + colorList + '</div>' +
      '<div class="detail-label">Sizes</div>' +
      '<div class="size-badges">' + sizeBadges + '</div>' +
      '<button class="whatsapp-enquiry-btn" onclick="enquireWhatsApp(\'' + product.name.replace(/'/g, "\\'") + '\', ' + product.rate + ')">' +
        '<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' +
        ' Enquire on WhatsApp' +
      '</button>' +
    '</div>';

  // Setup swipe
  initSwipe();

  // Render suggestions
  var others = [];
  for (var j = 0; j < all.length; j++) {
    if (all[j].id !== productId) others.push(all[j]);
  }
  // Shuffle
  for (var k = others.length - 1; k > 0; k--) {
    var r = Math.floor(Math.random() * (k + 1));
    var tmp = others[k]; others[k] = others[r]; others[r] = tmp;
  }
  var picks = others.slice(0, 6);

  var sugHtml = '<div class="suggestions-heading">You May Also Like</div><div class="suggestion-scroll">';
  for (var m = 0; m < picks.length; m++) {
    var sp = picks[m];
    var sDots = '';
    for (var sc = 0; sc < sp.colorCodes.length; sc++) {
      sDots += '<span class="color-dot-small" style="background:' + sp.colorCodes[sc] + '"></span>';
    }
    sugHtml += '<div class="suggestion-card" onclick="openProduct(\'' + sp.id + '\')">' +
      '<div class="suggestion-card-image" style="background:' + sp.categoryColor + '10">' +
        '<img src="' + placeholder(sp.categoryIcon, sp.categoryColor, 200, 200) + '" alt="' + sp.name + '">' +
      '</div>' +
      '<div class="suggestion-card-body">' +
        '<div class="suggestion-card-name">' + sp.name + '</div>' +
        '<div class="suggestion-card-rate">\u20B9' + sp.rate.toLocaleString('en-IN') + '</div>' +
        '<div class="product-card-colors">' + sDots + '</div>' +
      '</div>' +
    '</div>';
  }
  sugHtml += '</div>';
  suggestions.innerHTML = sugHtml;

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

  function goToSlide(index) {
    if (index < 0) index = 0;
    if (index >= slides.length) index = slides.length - 1;
    currentIndex = index;
    track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
    // Update dots
    var allDots = dotsContainer.querySelectorAll('.swipe-dot');
    for (var i = 0; i < allDots.length; i++) {
      allDots[i].classList.toggle('active', i === currentIndex);
    }
  }

  // Touch events
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

  // Dot clicks
  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('swipe-dot')) {
      goToSlide(parseInt(e.target.getAttribute('data-index')));
    }
  });
}

// ===== Close Modal =====
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

// ===== WhatsApp Enquiry =====
function enquireWhatsApp(name, rate) {
  var msg = 'Hi! I\'m interested in "' + name + '" (\u20B9' + rate.toLocaleString('en-IN') + ') from Sale91.\n' + window.location.href;
  window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', function () {
  // WhatsApp FAB
  var fab = document.getElementById('whatsappBtn');
  if (fab) {
    fab.addEventListener('click', function () {
      var msg = 'Check out Sale91 Fashion Catalog!\n' + window.location.href;
      window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
    });
  }

  // Modal close
  document.getElementById('modalOverlay').addEventListener('click', function (e) {
    if (e.target === this) closeModal();
  });
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });
});
