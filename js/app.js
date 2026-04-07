// ===== Mobile Navigation =====
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navActions = document.querySelector('.nav-actions');

  if (toggle) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navActions.classList.toggle('open');
    });
  }

  // ===== Color Selection =====
  document.querySelectorAll('.color-option').forEach(opt => {
    opt.addEventListener('click', () => {
      opt.closest('.color-options').querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      updatePrice();
    });
  });

  // ===== Size Selection =====
  document.querySelectorAll('.size-option').forEach(opt => {
    opt.addEventListener('click', () => {
      opt.closest('.size-options').querySelectorAll('.size-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      updatePrice();
    });
  });

  // ===== Material Selection =====
  document.querySelectorAll('.material-option').forEach(opt => {
    opt.addEventListener('click', () => {
      opt.closest('.material-options').querySelectorAll('.material-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      updatePrice();
    });
  });

  // ===== Quantity Control =====
  document.querySelectorAll('.quantity-control').forEach(ctrl => {
    const input = ctrl.querySelector('input');
    ctrl.querySelector('.qty-minus')?.addEventListener('click', () => {
      const val = parseInt(input.value) || 1;
      if (val > 1) input.value = val - 1;
      updatePrice();
    });
    ctrl.querySelector('.qty-plus')?.addEventListener('click', () => {
      const val = parseInt(input.value) || 1;
      if (val < 99) input.value = val + 1;
      updatePrice();
    });
  });

  // ===== Wishlist Toggle =====
  document.querySelectorAll('.product-wishlist').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      btn.classList.toggle('active');
      btn.textContent = btn.classList.contains('active') ? '♥' : '♡';
    });
  });

  // ===== Filter Tags =====
  document.querySelectorAll('.filter-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      tag.classList.toggle('active');
    });
  });

  // ===== Payment Method Selection =====
  document.querySelectorAll('.payment-method').forEach(method => {
    method.addEventListener('click', () => {
      document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
      method.classList.add('selected');
    });
  });

  // ===== Cart Item Remove =====
  document.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.cart-item');
      item.style.opacity = '0';
      item.style.transform = 'translateX(-20px)';
      setTimeout(() => item.remove(), 300);
    });
  });

  // ===== Gallery Thumbnails =====
  document.querySelectorAll('.product-gallery-thumbs .thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      document.querySelectorAll('.product-gallery-thumbs .thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });
});

// ===== Price Calculation =====
function updatePrice() {
  const basePrice = parseFloat(document.getElementById('basePrice')?.dataset.price || 0);
  const materialEl = document.querySelector('.material-option.selected');
  const materialExtra = parseFloat(materialEl?.dataset.extra || 0);
  const sizeEl = document.querySelector('.size-option.selected');
  const sizeMultiplier = parseFloat(sizeEl?.dataset.multiplier || 1);
  const qty = parseInt(document.querySelector('.quantity-control input')?.value || 1);

  const unitPrice = (basePrice + materialExtra) * sizeMultiplier;
  const total = unitPrice * qty;

  const basePriceEl = document.getElementById('displayBasePrice');
  const materialPriceEl = document.getElementById('displayMaterialPrice');
  const sizePriceEl = document.getElementById('displaySizePrice');
  const totalPriceEl = document.getElementById('displayTotal');

  if (basePriceEl) basePriceEl.textContent = `$${basePrice.toFixed(2)}`;
  if (materialPriceEl) materialPriceEl.textContent = `+$${materialExtra.toFixed(2)}`;
  if (sizePriceEl) sizePriceEl.textContent = `x${sizeMultiplier}`;
  if (totalPriceEl) totalPriceEl.textContent = `$${total.toFixed(2)}`;
}

// ===== Smooth Page Transitions =====
document.querySelectorAll('a[href]').forEach(link => {
  if (link.hostname === window.location.hostname || !link.hostname) {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.startsWith('#')) return;
      e.preventDefault();
      document.body.style.opacity = '0.7';
      setTimeout(() => { window.location.href = href; }, 150);
    });
  }
});
