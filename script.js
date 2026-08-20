/* ============================================================
   SRI RANGA TRAVELS — Main Script
   ============================================================ */

'use strict';

/* ─── DOM Ready ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initFleetTabs();
  initCarModal();

  // Page-specific inits
  if (document.querySelector('.hero-slider')) initHeroSlider();
});

/* ─── 1. Sticky Header ──────────────────────────────────── */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  // On pages with a hero slider, start transparent
  const hasHero = document.querySelector('.hero-slider');
  if (hasHero) header.classList.add('hero-top');

  const onScroll = () => {
    const scrolled = window.scrollY > 60;
    header.classList.toggle('scrolled', scrolled);
    if (hasHero) header.classList.toggle('hero-top', !scrolled);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active nav link based on current page
  const links = header.querySelectorAll('.nav-link, .mobile-nav-link');
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ─── 2. Mobile Menu ─────────────────────────────────────── */
function initMobileMenu() {
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const overlay     = document.getElementById('menuOverlay');
  const closeBtn    = document.getElementById('menuClose');
  if (!hamburger || !mobileMenu) return;

  const open = () => {
    hamburger.classList.add('active');
    mobileMenu.classList.add('open');
    overlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? close() : open();
  });
  closeBtn?.addEventListener('click', close);
  overlay?.addEventListener('click', close);

  // Close on nav link click
  mobileMenu.querySelectorAll('.mobile-nav-link').forEach(l => {
    l.addEventListener('click', close);
  });

  // Close on Escape
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

/* ─── 3. Hero Slider ─────────────────────────────────────── */
function initHeroSlider() {
  const slides  = document.querySelectorAll('.hero-slide');
  const dots    = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  if (!slides.length) return;

  let current = 0;
  let timer;

  const goTo = (idx) => {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  };

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  const startAuto = () => { timer = setInterval(next, 5500); };
  const resetAuto = () => { clearInterval(timer); startAuto(); };

  prevBtn?.addEventListener('click', () => { prev(); resetAuto(); });
  nextBtn?.addEventListener('click', () => { next(); resetAuto(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); resetAuto(); }));

  // Touch / swipe
  let touchStartX = 0;
  const slider = document.querySelector('.hero-slider');
  slider?.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  slider?.addEventListener('touchend',   e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); resetAuto(); }
  });

  startAuto();
}

/* ─── 4. Fleet Tabs ──────────────────────────────────────── */
function initFleetTabs() {
  const tabs  = document.querySelectorAll('.fleet-tab');
  const cards = document.querySelectorAll('.vehicle-card');
  if (!tabs.length) return;

  const filter = (cat) => {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.category === cat));
    cards.forEach(c => {
      const show = cat === 'all' || c.dataset.category === cat;
      if (show) {
        c.style.display = 'block';
        // Animate in
        requestAnimationFrame(() => {
          c.style.opacity = '0';
          c.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            c.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            c.style.opacity = '1';
            c.style.transform = 'translateY(0)';
          });
        });
      } else {
        c.style.display = 'none';
      }
    });
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => filter(tab.dataset.category));
  });

  // Init with 'all'
  filter('all');
}

/* ─── 5. Scroll Reveal ───────────────────────────────────── */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ─── 6. Number Counters ─────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const end   = parseFloat(el.dataset.count);
      const dec   = el.dataset.count.includes('.') ? 1 : 0;
      const dur   = 2000;
      const step  = 30;
      const steps = dur / step;
      let cur     = 0;

      const interval = setInterval(() => {
        cur += end / steps;
        if (cur >= end) {
          cur = end;
          clearInterval(interval);
        }
        el.textContent = dec ? cur.toFixed(dec) : Math.floor(cur).toLocaleString('en-IN');
      }, step);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ─── 7. Smooth scroll for anchor links ─────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ─── 8. Contact Form Submission ─────────────────────────── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '✅ Request Sent! We\'ll call you shortly.';
    btn.disabled = true;
    btn.style.background = 'linear-gradient(135deg,#2ecc71,#27ae60)';
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      btn.style.background = '';
      contactForm.reset();
    }, 4000);
  });
}

/* ─── 10. Car Details Modal & Interactive KM Calculator ─── */
function initCarModal() {
  const cards = document.querySelectorAll('.vehicle-card');
  if (!cards.length) return;

  // 1. Create Modal DOM if not present
  let modalOverlay = document.getElementById('carDetailsModalOverlay');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'carDetailsModalOverlay';
    modalOverlay.className = 'car-modal-overlay';
    modalOverlay.innerHTML = `
      <div class="car-modal" role="dialog" aria-modal="true">
        <div class="car-modal-header">
          <div class="car-modal-title-group">
            <h3 class="car-modal-title" id="modalCarName">Vehicle Name</h3>
            <span class="car-modal-cat-badge" id="modalCarCat">Category</span>
          </div>
          <button class="car-modal-close" id="modalCloseBtn" aria-label="Close modal">✕</button>
        </div>
        <div class="car-modal-body">
          <!-- Car Image -->
          <div class="car-modal-img-wrap">
            <img id="modalCarImg" src="" alt="Vehicle Photo" />
          </div>

          <!-- Cleanliness & Maintenance Information -->
          <div class="car-cleanliness-box">
            <div class="car-cleanliness-title">✨ Cleanliness & Maintenance Guarantee</div>
            <div class="car-cleanliness-grid">
              <div class="car-clean-item">
                <span>🧼</span>
                <div><strong>100% Deep Cleaned:</strong> Sanitised & vacuumed before every trip with fresh interior fragrance.</div>
              </div>
              <div class="car-clean-item">
                <span>🛠️</span>
                <div><strong>5,000 KM Serviced:</strong> Full mechanical safety check, smooth brakes, and high-quality tyres.</div>
              </div>
              <div class="car-clean-item">
                <span>❄️</span>
                <div><strong>Chilled & Pure AC:</strong> Disinfected AC filters for crisp, odourless, climate-controlled comfort.</div>
              </div>
              <div class="car-clean-item">
                <span>👨‍✈️</span>
                <div><strong>Verified Chauffeur:</strong> Courteous, non-smoking, punctual, and highly experienced drivers.</div>
              </div>
            </div>
          </div>

          <!-- Interactive Price / KM Calculator (Pull Bar) -->
          <div class="car-calc-box">
            <div class="car-calc-header">
              <div class="car-calc-title">🎚️ Trip Price Calculator</div>
              <div class="car-calc-rate-badge" id="modalCarRate">₹14 / KM</div>
            </div>

            <div class="km-slider-wrap">
              <div class="km-slider-labels">
                <span>50 KM</span>
                <span>Pull slider to calculate distance</span>
                <span>1,500 KM</span>
              </div>
              <input type="range" class="km-slider" id="modalKmSlider" min="50" max="1500" step="10" value="150" />
            </div>

            <div class="km-calc-display">
              <div class="km-val-box">
                <div class="km-val-label">Trip Distance</div>
                <div class="km-val-num" id="modalKmVal">150 KM</div>
              </div>
              <div class="km-total-box">
                <div class="km-total-label">Estimated Price</div>
                <div class="km-total-num" id="modalTotalVal">₹2,100</div>
              </div>
            </div>

            <div class="price-negotiable-note">
              <span>⚡ Note:</span> Price is negotiable for long-distance and multi-day bookings.
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="car-modal-actions">
            <a href="#" class="modal-wa-btn" id="modalWaBtn" target="_blank" rel="noopener">
              💬 Book on WhatsApp with this Quote
            </a>
            <a href="contact.html" class="modal-book-btn" id="modalFormBtn">
              📋 Book Online
            </a>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modalOverlay);
  }

  const modalCarName  = document.getElementById('modalCarName');
  const modalCarCat   = document.getElementById('modalCarCat');
  const modalCarImg   = document.getElementById('modalCarImg');
  const modalCarRate  = document.getElementById('modalCarRate');
  const modalKmSlider = document.getElementById('modalKmSlider');
  const modalKmVal    = document.getElementById('modalKmVal');
  const modalTotalVal = document.getElementById('modalTotalVal');
  const modalWaBtn    = document.getElementById('modalWaBtn');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  let currentRate = 14;
  let currentCarName = 'Vehicle';

  function updateCalculation() {
    const km = parseInt(modalKmSlider.value, 10) || 150;
    const total = km * currentRate;
    modalKmVal.textContent = `${km.toLocaleString('en-IN')} KM`;
    modalTotalVal.textContent = `₹${total.toLocaleString('en-IN')}`;

    // WhatsApp Dynamic Link with Quote & KM
    const msg = `Hi Sri Ranga Travels, I am interested in booking *${currentCarName}* for approximately *${km} KM* (Estimated Price: *₹${total.toLocaleString('en-IN')}* at ₹${currentRate}/km). Please confirm vehicle availability and best discounted quote.`;
    modalWaBtn.href = `https://wa.me/919187982599?text=${encodeURIComponent(msg)}`;
  }

  function openModal(card) {
    const nameEl = card.querySelector('.vehicle-name');
    const catEl  = card.querySelector('.vehicle-category');
    const imgEl  = card.querySelector('.vehicle-img-wrap img');
    const priceEl = card.querySelector('.vehicle-price-amount');

    currentCarName = nameEl ? nameEl.textContent.trim() : 'Vehicle';
    const category = catEl ? catEl.textContent.trim() : 'Premium Vehicle';
    const imgSrc = imgEl ? imgEl.src : '';
    
    // Parse rate per km
    let rate = 14;
    if (priceEl) {
      const match = priceEl.textContent.match(/₹\s*(\d+)/);
      if (match) rate = parseInt(match[1], 10);
    }
    currentRate = rate;

    modalCarName.textContent = currentCarName;
    modalCarCat.textContent = category;
    modalCarImg.src = imgSrc;
    modalCarImg.alt = currentCarName;
    modalCarRate.textContent = `₹${currentRate} / KM`;

    // Reset slider to 150 km on open
    modalKmSlider.value = 150;
    updateCalculation();

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Bind slider
  modalKmSlider.addEventListener('input', updateCalculation);

  // Close handlers
  modalCloseBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Attach click to all vehicle cards
  cards.forEach(card => {
    // Make entire card open modal
    card.addEventListener('click', (e) => {
      // Prevent double triggers
      e.preventDefault();
      openModal(card);
    });

    // Also style the "Book Now" inside card
    const btn = card.querySelector('.btn');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openModal(card);
      });
    }
  });
}
