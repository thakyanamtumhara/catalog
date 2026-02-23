// Sale91 Catalog — Minimal JS (no rendering, all content is static HTML)
// Only handles: category filtering, size chart popup, share, WhatsApp FAB

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

// ===== Size Chart Popup =====
function openSizeChart(chartKey) {
  var chart = SIZE_CHARTS[chartKey];
  if (!chart) return;
  var html = '<div class="sc-popup-header"><span class="sc-popup-title">Size Chart</span><button class="sc-popup-close" onclick="closeSizeChart()">&times;</button></div>';
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
  var popup = document.getElementById('sizeChartPopup');
  popup.innerHTML = html;
  popup.classList.add('active');
}

function closeSizeChart() {
  document.getElementById('sizeChartPopup').classList.remove('active');
}

// ===== Share Product =====
function shareProduct(name) {
  var url = window.location.href;
  var text = name + ' \u2014 sale91.com Catalog';
  if (navigator.share) {
    navigator.share({ title: text, url: url }).catch(function() {});
  } else {
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

// ===== Init =====
document.addEventListener('DOMContentLoaded', function() {
  // Category tab filtering (show/hide static cards)
  var tabs = document.getElementById('categoryTabs');
  var grid = document.getElementById('productGrid');
  if (tabs && grid) {
    tabs.addEventListener('click', function(e) {
      var tab = e.target.closest('.category-tab');
      if (!tab) return;
      var cat = tab.getAttribute('data-category');
      tabs.querySelectorAll('.category-tab').forEach(function(t) {
        t.classList.toggle('active', t === tab);
      });
      var cards = grid.querySelectorAll('.product-card');
      cards.forEach(function(card) {
        card.style.display = (cat === 'all' || card.getAttribute('data-category') === cat) ? '' : 'none';
      });
    });
  }

  // WhatsApp FAB
  var fab = document.getElementById('whatsappBtn');
  if (fab) {
    fab.addEventListener('click', function() {
      window.open('https://whatsapp.sale91.com', '_blank');
    });
  }

  // Escape key closes size chart
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeSizeChart();
  });
});
