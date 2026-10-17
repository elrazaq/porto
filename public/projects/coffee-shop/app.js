/**
 * SAMAN SPECIALTY COFFEE ROASTERS
 * Vanilla JavaScript (ES6+) - Zero External Dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Product Data Catalog (Authentic from Samanko)
  const PRODUCTS = [
    {
      id: 'aceh-gayo',
      name: 'Aceh Gayo',
      category: 'arabica',
      region: 'Takengon, Aceh Tengah',
      altitude: '1,400 - 1,700 mdpl',
      process: 'Semi-Washed & Natural',
      roast: 'Medium Roast',
      price: 35000,
      priceLabel: 'IDR 35.000',
      image: '/samanko/8ebe27_6434ca629f6d4cd7bc5eef4f9a212bfc.jpg',
      notes: ['Dark Chocolate', 'Earthy Spices', 'Herbal', 'Full Body'],
      description: 'Kopi Arabika legendaris dataran tinggi Gayo. Karakter rasa earthy rempah Nusantara dengan aftertaste dark chocolate yang lembut dan body tebal seimbang.'
    },
    {
      id: 'papua-wamena',
      name: 'Papua Wamena',
      category: 'arabica',
      region: 'Lembah Baliem, Papua',
      altitude: '1,600 - 2,000 mdpl',
      process: 'Full Washed',
      roast: 'Light to Medium',
      price: 38000,
      priceLabel: 'IDR 38.000',
      image: '/samanko/8ebe27_707e01412afe405aa093cf11c6d22fee.jpg',
      notes: ['Floral Jasmine', 'Sweet Citrus', 'Nutty', 'Clean Finish'],
      description: 'Ditanam secara organik di lembah sakral Baliem Papua tanpa pupuk kimia. Menghadirkan aroma floral harum semerbak dengan sentuhan citrus manis yang jernih.'
    },
    {
      id: 'padang-solok',
      name: 'Padang Solok Radjo',
      category: 'arabica',
      region: 'Lembah Gumanti, Sumatera Barat',
      altitude: '1,450 - 1,600 mdpl',
      process: 'Honey Process',
      roast: 'Medium Roast',
      price: 35000,
      priceLabel: 'IDR 35.000',
      image: '/samanko/8ebe27_ef737a6d1ec54a8e93034481657f772c.jpg',
      notes: ['Brown Sugar', 'Ripe Plum', 'Tangerine', 'Syrupy'],
      description: 'Kopi kebanggaan Ranah Minang yang diproses honey menghasilkan kemanisan madu alami yang melekat dengan acidity segar jeruk keprok.'
    },
    {
      id: 'mandheling',
      name: 'Sumatera Mandheling',
      category: 'arabica',
      region: 'Mandailing Natal, Sumut',
      altitude: '1,200 - 1,500 mdpl',
      process: 'Giling Basah (Wet-Hulled)',
      roast: 'Medium-Dark',
      price: 36000,
      priceLabel: 'IDR 36.000',
      image: '/samanko/8ebe27_edac93ed87ad405c875121ac1e319fea.jpg',
      notes: ['Cedar Wood', 'Tobacco', 'Sweet Molasses', 'Heavy Body'],
      description: 'Karakteristik bold khas kopi klasik Indonesia yang tersohor di kancah dunia. Body tebal memikat dengan hint aroma cedar dan molasses manis.'
    },
    {
      id: 'flores-bajawa',
      name: 'Flores Bajawa',
      category: 'arabica',
      region: 'Ngada, NTT',
      altitude: '1,300 - 1,550 mdpl',
      process: 'Fully Washed',
      roast: 'Medium Roast',
      price: 37000,
      priceLabel: 'IDR 37.000',
      image: '/samanko/8ebe27_11f1bcddba3c462a91afe3b6f61fb436.jpg',
      notes: ['Caramel Butter', 'Hazelnut', 'Sweet Apple', 'Smooth Body'],
      description: 'Ditanam di lereng vulkanik Gunung Inerie Flores. Karakter rasa kacang hazelnut gurih berpadu dengan karamel hangat dan aftertaste lembut.'
    },
    {
      id: 'toraja-sapan',
      name: 'Toraja Sapan',
      category: 'arabica',
      region: 'Toraja Utara, Sulawesi Selatan',
      altitude: '1,700 - 2,100 mdpl',
      process: 'Washed / Semi-Washed',
      roast: 'Medium Roast',
      price: 38000,
      priceLabel: 'IDR 38.000',
      image: '/samanko/8ebe27_3404c4070f6d440fa38714d4d3c427d7.jpg',
      notes: ['Dark Berry', 'Cinnamon', 'Black Tea', 'Complex'],
      description: 'Micro-lot unggulan dari puncak tertinggi Toraja. Citarasa sangat kompleks dengan lapisan rempah manis kayu manis, black tea, dan sentuhan buah berry matang.'
    },
    {
      id: 'bali-kintamani',
      name: 'Bali Kintamani',
      category: 'arabica',
      region: 'Kintamani, Bangli, Bali',
      altitude: '1,350 - 1,550 mdpl',
      process: 'Natural Anaerobic',
      roast: 'Light-Medium',
      price: 36000,
      priceLabel: 'IDR 36.000',
      image: '/samanko/8ebe27_04857fe04ca24aa69a7be7cd9f016735.jpg',
      notes: ['Orange Peel', 'Dark Grape', 'Vanilla Pod', 'Crisp'],
      description: 'Ditanam berdampingan dengan kebun jeruk Kintamani dengan sistem subak tradisional. Menghasilkan acidity jeruk yang cerah ceria dan rasa manis kismis.'
    },
    {
      id: 'jambi-kerinci',
      name: 'Jambi Kerinci (Featured V60)',
      category: 'specialty',
      region: 'Kayu Aro, Jambi',
      altitude: '1,500 - 1,700 mdpl',
      process: 'Natural Sun-Dried',
      roast: 'Medium Profile',
      price: 35000,
      priceLabel: 'IDR 35.000',
      image: '/samanko/8ebe27_b57788bd0c75460baa9a3cd34ad284f1.jpg',
      notes: ['Tropical Fruity', 'Honey', 'Brown Sugar', 'Red Apple', 'Light Body'],
      description: 'Menu andalan Pour Over V60 Saman Roasters diseduh dengan filter Cafec Abaca. Cupping notes eksotis buah tropis, apel merah segar, dan madu hutan.'
    },
    {
      id: 'vietnam-roast',
      name: 'Vietnam Roast Robusta',
      category: 'vietnam',
      region: 'Nusantara Heritage Blend',
      altitude: '700 - 900 mdpl',
      process: 'Traditional Butter Roasted',
      roast: 'Dark Roast',
      price: 25000,
      priceLabel: 'IDR 25.000',
      image: '/samanko/8ebe27_f613843837cf4875940bbda70891336d.jpg',
      notes: ['Rich Butter', 'Toasted Cocoa', 'Caramelized Sugar', 'Bold Kick'],
      description: 'Disangrai dengan resep tradisional mentega khas Vietnam sejak 1857. Disajikan sempurna dengan metode Vietnam Drip dan kental manis gurih.'
    }
  ];

  // 2. Render Products
  const productsContainer = document.getElementById('productsContainer');
  const filterBtns = document.querySelectorAll('.filter-btn');

  function renderProducts(filter = 'all') {
    if (!productsContainer) return;
    productsContainer.innerHTML = '';

    const filtered = filter === 'all' 
      ? PRODUCTS 
      : PRODUCTS.filter(p => p.category === filter);

    filtered.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="product-thumb-wrap">
          <img src="${p.image}" alt="${p.name}" class="product-thumb" loading="lazy" />
          <span class="product-roast-badge">${p.roast}</span>
        </div>
        <div class="product-body">
          <div>
            <div class="product-origin">${p.region} &bull; ${p.altitude}</div>
            <h3 class="product-title font-serif">${p.name}</h3>
            <div class="product-notes">
              ${p.notes.map(n => `<span class="note-chip">${n}</span>`).join('')}
            </div>
          </div>
          <div class="product-footer">
            <div class="product-price">
              <span>Mulai Dari</span>
              ${p.priceLabel}
            </div>
            <button type="button" class="btn btn-outline btn-sm btn-order-modal" data-id="${p.id}">
              Detail &amp; Pesan
            </button>
          </div>
        </div>
      `;
      productsContainer.appendChild(card);
    });

    // Reattach modal triggers
    document.querySelectorAll('.btn-order-modal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openProductModal(id);
      });
    });
  }

  // Filter click handler
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      renderProducts(filter);
    });
  });

  // Initial render
  renderProducts('all');

  // 3. Product Modal Logic
  const modalOverlay = document.getElementById('productModal');
  const modalBody = document.getElementById('modalProductDetails');
  const modalCloseBtn = document.getElementById('closeModalBtn');

  function openProductModal(id) {
    const p = PRODUCTS.find(item => item.id === id);
    if (!p || !modalBody || !modalOverlay) return;

    modalBody.innerHTML = `
      <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
        <img src="${p.image}" alt="${p.name}" style="width: 140px; height: 140px; object-fit: cover; border-radius: 6px; border: 1px solid var(--accent-gold);" />
        <div style="flex: 1; min-width: 220px;">
          <span class="tag-badge" style="margin-bottom: 0.4rem;">${p.process}</span>
          <h2 style="font-size: 1.5rem; margin-bottom: 0.3rem;" class="font-serif">${p.name}</h2>
          <p style="font-size: 0.78rem; font-family: var(--font-mono); color: var(--accent-amber);">${p.region}</p>
          <p style="font-size: 1.25rem; font-weight: 700; color: var(--accent-amber); font-family: var(--font-mono); margin-top: 0.6rem;">${p.priceLabel} <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 400;">/ 200g</span></p>
        </div>
      </div>

      <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin: 1.2rem 0;">
        ${p.description}
      </p>

      <div class="cupping-specs" style="margin-bottom: 1.2rem;">
        <div><strong>Cupping Notes:</strong> ${p.notes.join(', ')}</div>
        <div><strong>Altitude:</strong> ${p.altitude}</div>
        <div><strong>Roasting Profile:</strong> ${p.roast}</div>
      </div>

      <div class="form-group">
        <label>Pilih Gilingan (Grind Size):</label>
        <div class="custom-select-wrapper" id="modalGrindWrapper">
          <input type="hidden" id="selectGrind" value="Biji Utuh (Whole Beans)" />
          <div class="custom-select-trigger" id="modalGrindTrigger">
            <div class="custom-select-value">
              <span id="modalGrindDisplay">Biji Utuh (Whole Beans) - Paling Segar</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="custom-select-icon"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div class="custom-select-dropdown" id="modalGrindDropdown">
            <div class="custom-select-option selected" data-value="Biji Utuh (Whole Beans)">
              <strong>Biji Utuh (Whole Beans)</strong>
              <span class="custom-select-option-sub">Paling Segar &bull; Untuk digiling sendiri di rumah</span>
            </div>
            <div class="custom-select-option" data-value="Giling Kasar (Pour Over V60 / French Press)">
              <strong>Giling Kasar (Coarse Grind)</strong>
              <span class="custom-select-option-sub">Pour Over V60, Kalita Wave, French Press</span>
            </div>
            <div class="custom-select-option" data-value="Giling Medium (Vietnam Drip / Aeropress)">
              <strong>Giling Medium (Medium Grind)</strong>
              <span class="custom-select-option-sub">Vietnam Drip Tradisional, Aeropress, Moka Pot</span>
            </div>
            <div class="custom-select-option" data-value="Giling Halus (Espresso Mesin / Tubruk)">
              <strong>Giling Halus (Fine Grind)</strong>
              <span class="custom-select-option-sub">Mesin Espresso Komersial / Kopi Tubruk Nusantara</span>
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>Jumlah Pack (200g):</label>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <button type="button" id="btnMinusPack" class="btn btn-outline btn-sm" style="padding: 0.4rem 0.8rem;">-</button>
          <span id="packQty" style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 700; color: var(--accent-amber);">1</span>
          <button type="button" id="btnPlusPack" class="btn btn-outline btn-sm" style="padding: 0.4rem 0.8rem;">+</button>
          <span id="totalCalc" style="margin-left: auto; font-family: var(--font-mono); font-weight: 700; color: var(--accent-espresso); font-size: 1rem;">Total: ${p.priceLabel}</span>
        </div>
      </div>

      <div style="margin-top: 1.5rem; display: flex; gap: 0.75rem;">
        <button type="button" id="btnOrderWa" class="btn btn-primary" style="flex: 1;">
          Pesan via WhatsApp Resmi (+62 811-7752-933)
        </button>
      </div>
    `;

    // Initialize custom select in modal
    const modalGrindWrapper = document.getElementById('modalGrindWrapper');
    const modalGrindTrigger = document.getElementById('modalGrindTrigger');
    const modalGrindDisplay = document.getElementById('modalGrindDisplay');
    const selectGrindInput = document.getElementById('selectGrind');
    const modalGrindOptions = modalGrindWrapper.querySelectorAll('.custom-select-option');

    modalGrindTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      modalGrindWrapper.classList.toggle('open');
    });

    modalGrindOptions.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        modalGrindOptions.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        const val = opt.getAttribute('data-value');
        selectGrindInput.value = val;
        modalGrindDisplay.textContent = val;
        modalGrindWrapper.classList.remove('open');
      });
    });

    document.addEventListener('click', () => {
      if (modalGrindWrapper) modalGrindWrapper.classList.remove('open');
    });

    // Quantity calculations
    let qty = 1;
    const packQtyEl = document.getElementById('packQty');
    const totalCalcEl = document.getElementById('totalCalc');

    document.getElementById('btnMinusPack').addEventListener('click', () => {
      if (qty > 1) {
        qty--;
        updateTotal();
      }
    });

    document.getElementById('btnPlusPack').addEventListener('click', () => {
      qty++;
      updateTotal();
    });

    function updateTotal() {
      packQtyEl.textContent = qty;
      const total = qty * p.price;
      totalCalcEl.textContent = `Total: IDR ${total.toLocaleString('id-ID')}`;
    }

    document.getElementById('btnOrderWa').addEventListener('click', () => {
      const grind = selectGrindInput.value;
      const total = qty * p.price;
      const text = `Halo Saman Specialty Roasters, saya ingin memesan:\n\nProduk: ${p.name} (200g)\nJumlah: ${qty} pack\nGilingan: ${grind}\nTotal: IDR ${total.toLocaleString('id-ID')}\n\nMohon info ketersediaan stok & ongkir ke alamat saya. Terima kasih!`;
      const url = `https://wa.me/628117752933?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    });

    modalOverlay.classList.add('active');
  }

  if (modalCloseBtn && modalOverlay) {
    modalCloseBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }

  // =========================================================================
  // 4. BESPOKE CUSTOM SELECT (RSVP Guests)
  // =========================================================================
  const rsvpGuestsWrapper = document.getElementById('rsvpGuestsWrapper');
  const rsvpGuestsTrigger = document.getElementById('rsvpGuestsTrigger');
  const rsvpGuestsDisplay = document.getElementById('rsvpGuestsDisplay');
  const rsvpGuestsVal = document.getElementById('rsvpGuestsVal');
  const rsvpGuestsOptions = document.querySelectorAll('#rsvpGuestsDropdown .custom-select-option');

  if (rsvpGuestsTrigger && rsvpGuestsWrapper) {
    rsvpGuestsTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      rsvpGuestsWrapper.classList.toggle('open');
      if (rsvpDatePickerWrapper) rsvpDatePickerWrapper.classList.remove('open');
    });

    rsvpGuestsOptions.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        rsvpGuestsOptions.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        const val = opt.getAttribute('data-value');
        rsvpGuestsVal.value = val;
        rsvpGuestsDisplay.textContent = val;
        rsvpGuestsWrapper.classList.remove('open');
      });
    });
  }

  // =========================================================================
  // 5. BESPOKE CUSTOM DATE & TIME PICKER (Calendar UI)
  // =========================================================================
  const rsvpDatePickerWrapper = document.getElementById('rsvpDatePickerWrapper');
  const rsvpDateTrigger = document.getElementById('rsvpDateTrigger');
  const rsvpDateDisplay = document.getElementById('rsvpDateDisplay');
  const rsvpDateVal = document.getElementById('rsvpDateVal');
  const calMonthYear = document.getElementById('calMonthYear');
  const calDaysGrid = document.getElementById('calDaysGrid');
  const calPrevMonth = document.getElementById('calPrevMonth');
  const calNextMonth = document.getElementById('calNextMonth');
  const timeSlotPills = document.querySelectorAll('.time-slot-pill');

  let currentDate = new Date();
  let selectedYear = currentDate.getFullYear();
  let selectedMonth = currentDate.getMonth(); // 0-11
  let selectedDay = currentDate.getDate();
  let selectedTime = "15:00";

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  function updateDateDisplay() {
    const d = new Date(selectedYear, selectedMonth, selectedDay);
    const dayName = dayNames[d.getDay()];
    const monthName = monthNames[selectedMonth];
    const formatted = `${dayName}, ${selectedDay} ${monthName} ${selectedYear} &bull; ${selectedTime} WIB`;
    const rawVal = `${selectedDay} ${monthName} ${selectedYear} jam ${selectedTime} WIB`;

    rsvpDateVal.value = rawVal;
    if (rsvpDateDisplay) {
      rsvpDateDisplay.innerHTML = `
        <svg class="custom-datepicker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <span style="font-weight: 600; color: var(--accent-espresso);">${formatted}</span>
      `;
    }
  }

  function renderCalendar() {
    if (!calMonthYear || !calDaysGrid) return;

    calMonthYear.textContent = `${monthNames[selectedMonth]} ${selectedYear}`;
    calDaysGrid.innerHTML = '';

    const firstDayIndex = new Date(selectedYear, selectedMonth, 1).getDay(); // 0 is Sun
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const today = new Date();

    // Previous month filler days
    for (let i = 0; i < firstDayIndex; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'calendar-day-cell disabled';
      calDaysGrid.appendChild(emptyCell);
    }

    // Days in current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayCell = document.createElement('div');
      dayCell.className = 'calendar-day-cell';
      dayCell.textContent = day;

      const isToday = today.getFullYear() === selectedYear &&
                      today.getMonth() === selectedMonth &&
                      today.getDate() === day;
      if (isToday) dayCell.classList.add('today');

      const isSelected = selectedDay === day;
      if (isSelected) dayCell.classList.add('selected');

      dayCell.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedDay = day;
        updateDateDisplay();
        renderCalendar();
      });

      calDaysGrid.appendChild(dayCell);
    }
  }

  if (calPrevMonth) {
    calPrevMonth.addEventListener('click', (e) => {
      e.stopPropagation();
      selectedMonth--;
      if (selectedMonth < 0) {
        selectedMonth = 11;
        selectedYear--;
      }
      renderCalendar();
    });
  }

  if (calNextMonth) {
    calNextMonth.addEventListener('click', (e) => {
      e.stopPropagation();
      selectedMonth++;
      if (selectedMonth > 11) {
        selectedMonth = 0;
        selectedYear++;
      }
      renderCalendar();
    });
  }

  // Time slot pills
  timeSlotPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      timeSlotPills.forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      selectedTime = pill.getAttribute('data-time') || "15:00";
      updateDateDisplay();
    });
  });

  if (rsvpDateTrigger && rsvpDatePickerWrapper) {
    rsvpDateTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      rsvpDatePickerWrapper.classList.toggle('open');
      if (rsvpGuestsWrapper) rsvpGuestsWrapper.classList.remove('open');
    });
  }

  // Global click outside to close dropdowns
  document.addEventListener('click', () => {
    if (rsvpDatePickerWrapper) rsvpDatePickerWrapper.classList.remove('open');
    if (rsvpGuestsWrapper) rsvpGuestsWrapper.classList.remove('open');
  });

  // Initial Calendar setup
  renderCalendar();
  updateDateDisplay();

  // 6. RSVP Table Form Submit
  const rsvpForm = document.getElementById('rsvpForm');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('rsvpName').value;
      const phone = document.getElementById('rsvpPhone').value;
      const date = rsvpDateVal.value;
      const guests = rsvpGuestsVal.value;
      const notes = document.getElementById('rsvpNotes').value;

      const waText = `Halo Saman Roasters Tanjung Pinang, saya ingin reservasi meja / RSVP:\n\nNama: ${name}\nKontak: ${phone}\nWaktu Kunjungan: ${date}\nJumlah Tamu: ${guests}\nCatatan Khusus: ${notes || '-'}\n\nMohon konfirmasi meja. Terima kasih!`;
      const waUrl = `https://wa.me/628117752933?text=${encodeURIComponent(waText)}`;
      window.open(waUrl, '_blank');
    });
  }

  // 5. Fullscreen Toggle API
  const fullscreenBtn = document.getElementById('toggleFullscreenBtn');
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen();
        }
        fullscreenBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>
          Exit Fullscreen
        `;
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
        fullscreenBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
          View Fullscreen
        `;
      }
    });

    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        fullscreenBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
          View Fullscreen
        `;
      }
    });
  }

  // 6. Smooth Active Link ScrollSpy
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-menu a[href*='${sectionId}']`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  });

  // 7. Mobile Menu Drawer Toggle
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileDrawer.classList.toggle('open');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!mobileDrawer.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileDrawer.classList.remove('open');
      }
    });
  }
});
