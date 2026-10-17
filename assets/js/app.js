// --- MUTABLE APP STATE ---
const appState = {
  ...JSON.parse(JSON.stringify(DEFAULT_CONTENT)),
  currentReasonIdx: 0,
  albumFilter: 'all',
  currentLightboxIdx: 0,
  slideshowTimer: null,
  albumPhotos: [],
  petalsActive: true,
  musicPlaying: false
};

// Load saved state safely
try {
  const saved = localStorage.getItem('love_20_10_state_v1');
  if (saved) {
    const parsed = JSON.parse(saved);
    if (parsed.recipientName) appState.recipientName = parsed.recipientName;
    if (parsed.senderName) appState.senderName = parsed.senderName;
    if (parsed.startDate) appState.startDate = parsed.startDate;
    if (parsed.currentPreset && LETTER_PRESETS[parsed.currentPreset]) {
      appState.currentPreset = parsed.currentPreset;
      appState.letterText = LETTER_PRESETS[parsed.currentPreset];
    } else {
      appState.currentPreset = 'romantic';
      appState.letterText = LETTER_PRESETS.romantic;
    }
    if (Array.isArray(parsed.vouchers) && parsed.vouchers.length === 3) {
      appState.vouchers = parsed.vouchers;
    }
    if (Array.isArray(parsed.reasons) && parsed.reasons.length > 0) {
      appState.reasons = parsed.reasons;
    }
    if (Array.isArray(parsed.albumPhotos) && parsed.albumPhotos.length > 0) {
      const customPhotos = parsed.albumPhotos.filter(p => p.id && p.id.startsWith('p_'));
      const isOutdatedDefault = parsed.albumPhotos.some(p => p.title === 'Nắng Sớm Vườn Hồng' || (p.src && p.src.endsWith('.jpg')) || !p.title.includes('Vạt Hoa Vàng'));
      if (!isOutdatedDefault && parsed.albumPhotos.length >= 5) {
        appState.albumPhotos = parsed.albumPhotos;
      } else if (customPhotos.length > 0) {
        appState.albumPhotos = [...customPhotos, ...JSON.parse(JSON.stringify(DEFAULT_ALBUM_PHOTOS))];
      }
    }
  }
} catch (e) {
  // Ignore storage access errors in sandboxed frames
}

function saveState() {
  try {
    localStorage.setItem('love_20_10_state_v1', JSON.stringify(appState));
  } catch (e) {
    // Ignore storage errors
  }
}

// --- TOAST HELPER ---
let toastTimer = null;
function showToast(message, icon = '💖') {
  const box = document.getElementById('toastBox');
  const msgEl = document.getElementById('toastMessage');
  const iconEl = document.getElementById('toastIcon');
  if (!box || !msgEl || !iconEl) return;
  msgEl.textContent = message;
  iconEl.textContent = icon;
  box.classList.remove('hidden', 'translate-y-2', 'opacity-0');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    box.classList.add('translate-y-2', 'opacity-0');
    setTimeout(() => box.classList.add('hidden'), 300);
  }, 2800);
}

// --- RENDER DYNAMIC TEXT & STATS ---
function updatePersonalizationUI() {
  document.querySelectorAll('.recipient-name-display').forEach(el => {
    el.textContent = appState.recipientName;
  });
  document.querySelectorAll('.sender-name-display').forEach(el => {
    el.textContent = appState.senderName;
  });

  // Calculate days together relative to 20/10/2026 or current date
  const start = new Date(appState.startDate);
  const now = new Date('2026-10-20T00:00:00');
  if (!isNaN(start.getTime())) {
    const diffDays = Math.max(1, Math.floor((now - start) / (1000 * 60 * 60 * 24)));
    const statDaysCount = document.getElementById('statDaysCount');
    if (statDaysCount) statDaysCount.textContent = diffDays + ' ngày';
    const daysTogetherBadge = document.getElementById('daysTogetherBadge');
    if (daysTogetherBadge) daysTogetherBadge.textContent = diffDays + ' ngày bên nhau';
  }

  const heartCountDisplay = document.getElementById('heartCountDisplay');
  if (heartCountDisplay) heartCountDisplay.textContent = appState.heartCount.toLocaleString('vi-VN');
  const statSweetness = document.getElementById('statSweetness');
  if (statSweetness) statSweetness.textContent = appState.sweetnessLevel + '%';

  const openedCount = appState.vouchers.filter(v => v.opened).length;
  const statVouchersOpened = document.getElementById('statVouchersOpened');
  if (statVouchersOpened) statVouchersOpened.textContent = openedCount + ' / 3';
}

// --- TYPEWRITER EFFECT FOR LOVE LETTER ---
let typewriterTimer = null;
function playLetterTypewriter(text) {
  const target = document.getElementById('letterBodyText');
  if (!target) return;
  if (typewriterTimer) clearInterval(typewriterTimer);
  target.textContent = '';
  let idx = 0;
  typewriterTimer = setInterval(() => {
    if (idx < text.length) {
      target.textContent += text.charAt(idx);
      idx++;
    } else {
      clearInterval(typewriterTimer);
      typewriterTimer = null;
    }
  }, 16);
}

// --- RENDER GIFT VOUCHERS ---
function renderGiftBoxes() {
  const container = document.getElementById('giftBoxesContainer');
  if (!container) return;
  container.innerHTML = '';
  appState.vouchers.forEach((v, idx) => {
    const card = document.createElement('div');
    if (!v.opened) {
      card.setAttribute('role', 'button');
      card.tabIndex = 0;
      card.setAttribute('aria-label', `Mở hộp quà bí mật ${idx + 1}`);
      card.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); card.click(); }
      });
      card.className = 'gift-bounce cursor-pointer rounded-2xl p-5 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md flex flex-col items-center justify-center text-center min-h-[175px] transition-all border border-green-300';
      card.innerHTML = `
        <span class="text-4xl mb-2 animate-float">🎁</span>
        <p class="text-sm font-bold">Hộp Quà Bí Mật #${idx + 1}</p>
        <p class="text-xs text-green-100 mt-1">Chạm để mở quà ngay</p>
      `;
      card.addEventListener('click', () => {
        appState.vouchers[idx].opened = true;
        saveState();
        renderGiftBoxes();
        updatePersonalizationUI();
        spawnFloatingHearts(6);
        playChimeNote(659.25);
        showToast(`Đã mở khóa: ${v.title}!`, v.icon);
      });
    } else {
      card.className = 'rounded-2xl p-4 bg-white border-2 border-green-300 shadow-sm flex flex-col justify-between min-h-[175px] relative overflow-hidden';
      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between">
            <span class="text-2xl">${v.icon}</span>
            <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-100 text-green-700">Đã Nhận</span>
          </div>
          <h4 class="text-sm font-bold text-green-950 mt-2">${v.title}</h4>
          <p class="text-xs text-green-700 mt-1 leading-relaxed">${v.desc}</p>
        </div>
        <button type="button" class="use-voucher-btn mt-3 w-full py-1.5 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 text-xs font-semibold transition">
          💌 Dùng Voucher Này
        </button>
      `;
      card.querySelector('.use-voucher-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        showToast(`Đã gửi yêu cầu "${v.title}" tới ${appState.senderName}!`, '🥳');
        spawnFloatingHearts(8);
      });
    }
    container.appendChild(card);
  });
}

// --- RENDER LOVE REASONS JAR ---
function renderCurrentReason() {
  const total = appState.reasons.length;
  if (!total) return;
  const idx = ((appState.currentReasonIdx % total) + total) % total;
  const item = appState.reasons[idx];
  const idxBadge = document.getElementById('reasonIndexBadge');
  if (idxBadge) idxBadge.textContent = `Ngôi sao #${idx + 1} / ${total}`;
  const catEl = document.getElementById('loveReasonCategory');
  if (catEl) catEl.textContent = item.category;
  const textEl = document.getElementById('loveReasonText');
  if (textEl) textEl.textContent = item.text;
}

// --- INITIALIZE & RENDER PHOTO ALBUM ---
function initDefaultAlbumPhotos() {
  if (appState.albumPhotos && appState.albumPhotos.length > 0) return;
  if (typeof DEFAULT_ALBUM_PHOTOS !== 'undefined' && Array.isArray(DEFAULT_ALBUM_PHOTOS)) {
    appState.albumPhotos = JSON.parse(JSON.stringify(DEFAULT_ALBUM_PHOTOS));
  }
}

function getFilteredAlbumPhotos() {
  if (appState.albumFilter === 'fav') {
    return appState.albumPhotos.filter(p => p.favorite);
  }
  return appState.albumPhotos;
}

function renderAlbumGrid() {
  const grid = document.getElementById('albumGridContainer');
  const badge = document.getElementById('albumCountBadge');
  if (!grid) return;

  if (badge) badge.textContent = `${appState.albumPhotos.length} bức ảnh kỷ niệm`;
  const list = getFilteredAlbumPhotos();
  grid.innerHTML = '';

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-10 text-center text-green-700 bg-green-50/60 rounded-2xl border border-green-200">
        <p class="text-base font-semibold">Chưa có bức ảnh nào trong mục Yêu thích ❤️</p>
        <p class="text-xs text-green-600 mt-1">Hãy thả tim cho những bức hình của nàng hoặc chuyển sang xem "Tất cả" nhé!</p>
      </div>
    `;
    return;
  }

  list.forEach((photo, idx) => {
    const tiltClass = idx % 2 === 0 ? 'polaroid-tilt-left' : 'polaroid-tilt-right';
    const card = document.createElement('div');
    card.className = `polaroid-frame ${tiltClass} rounded-2xl flex flex-col justify-between cursor-pointer group`;
    card.innerHTML = `
      <div>
        <div class="relative rounded-xl overflow-hidden bg-green-100 aspect-[3/4]">
          <img src="${photo.src}" alt="${photo.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
          <div class="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-sm text-white text-[11px] font-medium">
            ${photo.dateTag}
          </div>
          <button type="button" class="album-fav-btn absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-green-600 shadow-md flex items-center justify-center text-sm transition" title="Yêu thích">
            ${photo.favorite ? '❤️' : '🤍'}
          </button>
        </div>
        <div class="pt-3 px-1">
          <h4 class="font-handwriting text-2xl font-bold text-green-900 leading-snug">${photo.title}</h4>
          <p class="text-xs text-green-700/90 mt-1 line-clamp-3 leading-relaxed">${photo.caption}</p>
        </div>
      </div>
      <div class="pt-3 mt-2 px-1 border-t border-green-100 flex items-center justify-between text-[11px] text-green-500 font-medium">
        <span>💖 ${photo.likes} tim</span>
        <span class="text-green-600 group-hover:underline">🔍 Phóng to</span>
      </div>
    `;

    // Toggle favorite button
    const favBtn = card.querySelector('.album-fav-btn');
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      photo.favorite = !photo.favorite;
      photo.likes += photo.favorite ? 1 : -1;
      saveState();
      renderAlbumGrid();
      spawnFloatingHearts(4);
      playChimeNote(880, 0.5);
    });

    // Click card to open Lightbox
    card.addEventListener('click', () => {
      const realIdx = appState.albumPhotos.findIndex(item => item.id === photo.id);
      openLightboxAt(realIdx >= 0 ? realIdx : 0);
    });

    grid.appendChild(card);
  });
}

let slideshowActive = false;
let slideVersion = 0;
let captionFrame = null;
let slideAnimations = [];
const albumReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function cancelSlideEffects() {
  slideVersion++;
  cancelAnimationFrame(captionFrame);
  slideAnimations.forEach(animation => animation.cancel());
  slideAnimations = [];
  clearTimeout(appState.slideshowTimer);
  appState.slideshowTimer = null;
  const caption = document.getElementById('lightboxCaption');
  if (caption) caption.classList.remove('is-typing');
  const img = document.getElementById('lightboxImg');
  if (img) img.classList.remove('is-presenting');
}

function scheduleNextSlide() {
  if (!slideshowActive) return;
  appState.slideshowTimer = setTimeout(() => {
    const modal = document.getElementById('lightboxModal');
    if (!modal || modal.classList.contains('hidden')) {
      stopAlbumSlideshow();
      return;
    }
    openLightboxAt(appState.currentLightboxIdx + 1);
  }, 2800);
}

async function openLightboxAt(index) {
  const total = appState.albumPhotos.length;
  if (!total) return;
  const modal = document.getElementById('lightboxModal');
  const image = document.getElementById('lightboxImg');
  const caption = document.getElementById('lightboxCaption');
  if (!modal || !image || !caption) return;
  const wasOpen = !modal.classList.contains('hidden');
  const previous = appState.currentLightboxIdx;
  cancelSlideEffects();
  const version = slideVersion;
  const direction = index < previous ? -1 : 1;
  appState.currentLightboxIdx = ((index % total) + total) % total;
  const photo = appState.albumPhotos[appState.currentLightboxIdx];
  if (!photo) return;
  const animated = !albumReducedMotion.matches && typeof image.animate === 'function';
  modal.classList.remove('hidden');
  // Decode the incoming photograph before turning the page.
  const preload = new Image();
  preload.src = photo.src;
  if (preload.decode) { try { await preload.decode(); } catch {} }
  if (version !== slideVersion) return;
  if (wasOpen && animated) {
    const turn = image.animate([
      { transform: 'rotateY(0deg) scale(1)', opacity: 1 },
      { transform: `rotateY(${-direction * 85}deg) scale(.94)`, opacity: .12 }
    ], { duration: 340, easing: 'cubic-bezier(.55,0,.85,.45)', fill: 'forwards' });
    slideAnimations.push(turn);
    try { await turn.finished; } catch { return; }
    if (version !== slideVersion) return;
  }
  image.src = photo.src;
  image.alt = photo.title;
  const tagEl = document.getElementById('lightboxTag');
  if (tagEl) tagEl.textContent = photo.dateTag;
  const titleEl = document.getElementById('lightboxTitle');
  if (titleEl) titleEl.textContent = photo.title;
  const text = `"${photo.caption}"`;
  caption.textContent = slideshowActive && animated ? '' : text;
  const counterEl = document.getElementById('lightboxCounter');
  if (counterEl) counterEl.textContent = `Ảnh ${appState.currentLightboxIdx + 1} / ${total}`;
  const favIconEl = document.getElementById('lightboxFavIcon');
  if (favIconEl) favIconEl.textContent = photo.favorite ? '❤️' : '🤍';
  const favTextEl = document.getElementById('lightboxFavText');
  if (favTextEl) favTextEl.textContent = photo.favorite ? `Đã yêu thích (${photo.likes} tim)` : `Thả tim ảnh này (${photo.likes})`;
  slideAnimations.forEach(animation => animation.cancel());
  slideAnimations = [];
  if (animated) {
    const reveal = image.animate([
      { transform: `rotateY(${direction * 85}deg) scale(.94)`, opacity: .12 },
      { transform: 'rotateY(0deg) scale(1)', opacity: 1 }
    ], { duration: 620, easing: 'cubic-bezier(.16,1,.3,1)' });
    slideAnimations.push(reveal);
    if (titleEl) {
      const titleAnim = titleEl.animate([
        { opacity: 0, transform: 'translateY(12px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 650, easing: 'ease-out' });
      slideAnimations.push(titleAnim);
    }
    try { await reveal.finished; } catch { return; }
    if (version !== slideVersion) return;
  }
  if (slideshowActive && animated) {
    image.classList.add('is-presenting');
    caption.classList.add('is-typing');
    const characters = Array.from(text);
    const duration = Math.min(5000, Math.max(1200, characters.length * 26));
    let started;
    function typeCaption(now) {
      if (version !== slideVersion) return;
      started ??= now;
      const progress = Math.min(1, (now - started) / duration);
      caption.textContent = characters.slice(0, Math.floor(progress * characters.length)).join('');
      if (progress < 1) captionFrame = requestAnimationFrame(typeCaption);
      else { caption.classList.remove('is-typing'); scheduleNextSlide(); }
    }
    captionFrame = requestAnimationFrame(typeCaption);
  } else scheduleNextSlide();
}

function syncSlideshowControls() {
  const icon = document.getElementById('slideshowIcon');
  if (icon) icon.textContent = slideshowActive ? '⏸️' : '▶️';
  const text = document.getElementById('slideshowText');
  if (text) text.textContent = slideshowActive ? 'Đang chiếu' : 'Trình chiếu';
  const control = document.getElementById('btnLightboxSlideshow');
  if (control) {
    control.textContent = slideshowActive ? '⏸ Tạm dừng trình chiếu' : '▶ Bắt đầu trình chiếu';
    control.setAttribute('aria-pressed', String(slideshowActive));
  }
}

function stopAlbumSlideshow() {
  slideshowActive = false;
  cancelSlideEffects();
  const photo = appState.albumPhotos[appState.currentLightboxIdx];
  const cap = document.getElementById('lightboxCaption');
  if (photo && cap) cap.textContent = `"${photo.caption}"`;
  syncSlideshowControls();
}

function toggleAlbumSlideshow() {
  if (slideshowActive) { stopAlbumSlideshow(); return; }
  if (!appState.albumPhotos.length) return;
  slideshowActive = true;
  syncSlideshowControls();
  const modal = document.getElementById('lightboxModal');
  const open = modal && !modal.classList.contains('hidden');
  openLightboxAt(open ? appState.currentLightboxIdx : 0);
}

// --- FLOATING HEARTS BURST ---
function spawnFloatingHearts(count = 8) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'flying-heart text-2xl';
    el.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
    el.style.left = (20 + Math.random() * 60) + 'vw';
    el.style.bottom = (10 + Math.random() * 20) + 'vh';
    el.style.animationDuration = (1.8 + Math.random() * 1.2) + 's';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }
}

// --- FALLING PETALS CANVAS ANIMATION ---
const canvas = document.getElementById('petalsCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let petals = [];

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createPetals(count = 28) {
  if (!canvas) return;
  petals = [];
  for (let i = 0; i < count; i++) {
    petals.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 5 + Math.random() * 7,
      vy: 0.6 + Math.random() * 1.1,
      vx: -0.4 + Math.random() * 0.8,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.025,
      opacity: 0.35 + Math.random() * 0.45
    });
  }
}

function drawPetalsLoop() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (appState.petalsActive) {
    petals.forEach(p => {
      p.y += p.vy;
      p.x += p.vx + Math.sin(p.angle) * 0.35;
      p.angle += p.spin;
      if (p.y > canvas.height + 20) {
        p.y = -15;
        p.x = Math.random() * canvas.width;
      }
      if (p.x > canvas.width + 20) p.x = -15;
      if (p.x < -20) p.x = canvas.width + 15;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r, p.r * 0.6, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(115, 156, 135, ${p.opacity})`;
      ctx.fill();
      ctx.restore();
    });
  }
  requestAnimationFrame(drawPetalsLoop);
}

// --- INITIALIZE & BIND EVENTS ---
window.addEventListener('DOMContentLoaded', () => {
  resizeCanvas();
  createPetals(28);
  drawPetalsLoop();
  window.addEventListener('resize', resizeCanvas);

  initDefaultAlbumPhotos();
  updatePersonalizationUI();
  renderGiftBoxes();
  renderAlbumGrid();
  renderCurrentReason();

  // Track the visible section so the bottom navigation also follows manual scrolling.
  const sectionButtons = [...document.querySelectorAll('.nav-scroll-btn')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function setActiveSection(id) {
    sectionButtons.forEach(button => {
      if (button.dataset.section === id) button.setAttribute('aria-current', 'location');
      else button.removeAttribute('aria-current');
    });
  }
  setActiveSection('sec-letter');
  sectionButtons.forEach(button => {
    button.addEventListener('click', () => {
      const section = document.getElementById(button.dataset.section);
      if (section) {
        setActiveSection(section.id);
        section.scrollIntoView({ behavior: reduceMotion.matches ? 'instant' : 'smooth', block: 'start' });
      }
    });
  });
  let navigationFrame = false;
  function updateSectionNavigation() {
    if (navigationFrame) return;
    navigationFrame = true;
    requestAnimationFrame(() => {
      let active = 'sec-letter';
      sectionButtons.forEach(button => {
        const section = document.getElementById(button.dataset.section);
        if (section && section.getBoundingClientRect().top <= window.innerHeight * .4) active = section.id;
      });
      setActiveSection(active);
      navigationFrame = false;
    });
  }
  window.addEventListener('scroll', updateSectionNavigation, { passive: true });
  window.addEventListener('resize', updateSectionNavigation);
  updateSectionNavigation();

  // Jump to Letter button
  const btnJumpToLetter = document.getElementById('btnJumpToLetter');
  if (btnJumpToLetter) {
    btnJumpToLetter.addEventListener('click', () => {
      const letterSec = document.getElementById('sec-letter');
      if (letterSec) letterSec.scrollIntoView({ behavior: 'smooth', block: 'center' });
      openEnvelopeAction();
    });
  }

  // Send Heart Burst button
  const btnSendHeartBurst = document.getElementById('btnSendHeartBurst');
  if (btnSendHeartBurst) {
    btnSendHeartBurst.addEventListener('click', () => {
      appState.heartCount += 10;
      appState.sweetnessLevel += 10;
      updatePersonalizationUI();
      spawnFloatingHearts(10);
      playChimeNote(880, 0.6);
      showToast(`Gửi ngàn trái tim tới ${appState.recipientName}! 💖`, '💘');
    });
  }

  // Open / Close Envelope
  function openEnvelopeAction() {
    const closed = document.getElementById('envelopeClosedView');
    const opened = document.getElementById('envelopeOpenedView');
    if (closed) closed.classList.add('hidden');
    if (opened) opened.classList.remove('hidden');
    playLetterTypewriter(appState.letterText);
    spawnFloatingHearts(8);
    playChimeNote(783.99, 0.9);
  }

  const btnOpenEnvelope = document.getElementById('btnOpenEnvelope');
  if (btnOpenEnvelope) btnOpenEnvelope.addEventListener('click', openEnvelopeAction);

  const btnCloseEnvelope = document.getElementById('btnCloseEnvelope');
  if (btnCloseEnvelope) {
    btnCloseEnvelope.addEventListener('click', () => {
      const opened = document.getElementById('envelopeOpenedView');
      const closed = document.getElementById('envelopeClosedView');
      if (opened) opened.classList.add('hidden');
      if (closed) closed.classList.remove('hidden');
    });
  }

  const btnReplayTypewriter = document.getElementById('btnReplayTypewriter');
  if (btnReplayTypewriter) {
    btnReplayTypewriter.addEventListener('click', () => {
      playLetterTypewriter(appState.letterText);
    });
  }

  // Copy Letter to Clipboard
  const btnCopyLetter = document.getElementById('btnCopyLetter');
  if (btnCopyLetter) {
    btnCopyLetter.addEventListener('click', () => {
      const fullText = `Gửi em yêu, cô công chúa nhỏ đáng yêu và là cả thế giới dịu dàng của anh 💗\n\n${appState.letterText}\n\nAnh iu của em 💌`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullText).then(() => {
          showToast('Đã sao chép toàn bộ bức thư tình!', '📋');
        }).catch(() => fallbackCopy(fullText));
      } else {
        fallbackCopy(fullText);
      }
    });
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast('Đã sao chép bức thư vào bộ nhớ tạm!', '📋');
    } catch (e) {
      showToast('Đã sẵn sàng để sao chép!', '✨');
    }
    ta.remove();
  }

  // Preset Letter Selector
  document.querySelectorAll('.preset-letter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-preset');
      if (LETTER_PRESETS[key]) {
        appState.currentPreset = key;
        appState.letterText = LETTER_PRESETS[key];
        saveState();
        document.querySelectorAll('.preset-letter-btn').forEach(b => {
          b.className = 'preset-letter-btn px-3 py-1.5 rounded-full text-xs font-semibold bg-green-50 text-green-800 hover:bg-green-100 border border-green-200 transition';
        });
        btn.className = 'preset-letter-btn px-3 py-1.5 rounded-full text-xs font-semibold bg-green-600 text-white shadow-sm transition';
        openEnvelopeAction();
      }
    });
  });

  // Flower Bouquet Picker
  document.querySelectorAll('.flower-pick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-flower'), 10);
      const flower = FLOWER_MEANINGS[idx];
      if (!flower) return;
      document.querySelectorAll('.flower-pick-btn').forEach(b => {
        b.className = 'flower-pick-btn p-3 rounded-2xl bg-white/90 text-green-900 border border-green-200 hover:bg-green-50 flex flex-col items-center gap-1 transition transform hover:scale-105';
      });
      btn.className = 'flower-pick-btn p-3 rounded-2xl bg-green-600 text-white shadow-md flex flex-col items-center gap-1 transition transform hover:scale-105';
      const emojiEl = document.getElementById('flowerDetailEmoji');
      if (emojiEl) emojiEl.textContent = flower.emoji;
      const nameEl = document.getElementById('flowerDetailName');
      if (nameEl) nameEl.textContent = flower.name;
      const tagEl = document.getElementById('flowerDetailTag');
      if (tagEl) tagEl.textContent = flower.tag;
      const msgEl = document.getElementById('flowerDetailMessage');
      if (msgEl) msgEl.textContent = flower.message;
      playChimeNote(587.33 + idx * 80, 0.7);
      spawnFloatingHearts(4);
    });
  });

  // Reset Gifts
  const btnResetGifts = document.getElementById('btnResetGifts');
  if (btnResetGifts) {
    btnResetGifts.addEventListener('click', () => {
      appState.vouchers.forEach(v => { v.opened = false; });
      saveState();
      renderGiftBoxes();
      updatePersonalizationUI();
      showToast('Đã gói lại 3 hộp quà bí mật!', '🎁');
    });
  }

  // Love Reasons Jar Controls
  const btnNextReason = document.getElementById('btnNextReason');
  if (btnNextReason) {
    btnNextReason.addEventListener('click', () => {
      if (!appState.reasons.length) return;
      appState.currentReasonIdx = (appState.currentReasonIdx + 1) % appState.reasons.length;
      renderCurrentReason();
      playChimeNote(987.77, 0.65);
      spawnFloatingHearts(3);
    });
  }

  const btnRandomReason = document.getElementById('btnRandomReason');
  if (btnRandomReason) {
    btnRandomReason.addEventListener('click', () => {
      if (!appState.reasons.length) return;
      appState.currentReasonIdx = Math.floor(Math.random() * appState.reasons.length);
      renderCurrentReason();
      playChimeNote(1046.5, 0.65);
    });
  }

  const btnAddReason = document.getElementById('btnAddReason');
  if (btnAddReason) {
    btnAddReason.addEventListener('click', () => {
      const input = document.getElementById('inputNewReason');
      if (!input) return;
      const val = input.value.trim();
      if (!val) {
        showToast('Hãy nhập một điều đáng yêu trước nhé!', '✍️');
        return;
      }
      appState.reasons.push({
        category: `Ngôi sao mới từ ${appState.senderName}`,
        text: `"${val}"`
      });
      appState.currentReasonIdx = appState.reasons.length - 1;
      input.value = '';
      saveState();
      renderCurrentReason();
      spawnFloatingHearts(6);
      showToast('Đã thả thêm một ngôi sao yêu thương vào lọ!', '🌟');
    });
  }

  // Music & Petals Toggles
  const btnToggleMusic = document.getElementById('btnToggleMusic');
  if (btnToggleMusic) btnToggleMusic.addEventListener('click', toggleMusicBox);

  function togglePetalsAction() {
    appState.petalsActive = !appState.petalsActive;
    const label = document.getElementById('petalsStateLabel');
    if (label) label.textContent = appState.petalsActive ? 'Bật' : 'Tắt';
    const mobLabel = document.getElementById('mobilePetalsLabel');
    if (mobLabel) mobLabel.textContent = appState.petalsActive ? 'Đang bật' : 'Đã tắt';
    const mobBtn = document.getElementById('btnMobilePetals');
    if (mobBtn) mobBtn.setAttribute('aria-pressed', String(appState.petalsActive));
  }

  const btnTogglePetals = document.getElementById('btnTogglePetals');
  if (btnTogglePetals) {
    btnTogglePetals.addEventListener('click', togglePetalsAction);
  }

  const btnMobilePetals = document.getElementById('btnMobilePetals');
  if (btnMobilePetals) {
    btnMobilePetals.addEventListener('click', togglePetalsAction);
  }

  // Album Filter Buttons
  document.querySelectorAll('.album-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      appState.albumFilter = btn.getAttribute('data-album-filter');
      document.querySelectorAll('.album-filter-btn').forEach(b => {
        b.className = 'album-filter-btn px-3 py-1 rounded-full text-xs font-semibold text-green-800 hover:bg-green-100 transition';
      });
      btn.className = 'album-filter-btn px-3 py-1 rounded-full text-xs font-semibold bg-green-600 text-white shadow-sm transition';
      renderAlbumGrid();
    });
  });

  // Lightbox Controls
  function closeLightboxModal() {
    stopAlbumSlideshow();
    const modal = document.getElementById('lightboxModal');
    if (modal) modal.classList.add('hidden');
  }

  const btnCloseLightbox = document.getElementById('btnCloseLightbox');
  if (btnCloseLightbox) {
    btnCloseLightbox.addEventListener('click', closeLightboxModal);
  }

  const btnMobileCloseLightbox = document.getElementById('btnMobileCloseLightbox');
  if (btnMobileCloseLightbox) {
    btnMobileCloseLightbox.addEventListener('click', closeLightboxModal);
  }

  const lightboxModal = document.getElementById('lightboxModal');
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightboxModal();
      }
    });
  }

  const btnLightboxPrev = document.getElementById('btnLightboxPrev');
  if (btnLightboxPrev) {
    btnLightboxPrev.addEventListener('click', () => {
      openLightboxAt(appState.currentLightboxIdx - 1);
    });
  }

  const btnLightboxNext = document.getElementById('btnLightboxNext');
  if (btnLightboxNext) {
    btnLightboxNext.addEventListener('click', () => {
      openLightboxAt(appState.currentLightboxIdx + 1);
    });
  }

  const btnLightboxFav = document.getElementById('btnLightboxFav');
  if (btnLightboxFav) {
    btnLightboxFav.addEventListener('click', () => {
      const photo = appState.albumPhotos[appState.currentLightboxIdx];
      if (!photo) return;
      photo.favorite = true;
      photo.likes += 1;
      saveState();
      const favIcon = document.getElementById('lightboxFavIcon');
      if (favIcon) favIcon.textContent = '❤️';
      const favText = document.getElementById('lightboxFavText');
      if (favText) favText.textContent = `Đã yêu thích (${photo.likes} tim)`;
      renderAlbumGrid();
      spawnFloatingHearts(6);
      playChimeNote(987.77, 0.6);
    });
  }

  // Slideshow controls remain accessible while the viewer is open.
  const btnStartSlideshow = document.getElementById('btnStartSlideshow');
  if (btnStartSlideshow) btnStartSlideshow.addEventListener('click', toggleAlbumSlideshow);

  const btnLightboxSlideshow = document.getElementById('btnLightboxSlideshow');
  if (btnLightboxSlideshow) btnLightboxSlideshow.addEventListener('click', toggleAlbumSlideshow);

  document.addEventListener('keydown', event => {
    const modal = document.getElementById('lightboxModal');
    if (!modal || modal.classList.contains('hidden')) return;
    if (event.key === 'Escape') {
      const closeBtn = document.getElementById('btnCloseLightbox');
      if (closeBtn) closeBtn.click();
    }
    if (event.key === 'ArrowRight') openLightboxAt(appState.currentLightboxIdx + 1);
    if (event.key === 'ArrowLeft') openLightboxAt(appState.currentLightboxIdx - 1);
  });

  // Add Photo Modal Controls
  let pendingUploadedDataUrl = '';
  const addPhotoModal = document.getElementById('addPhotoModal');
  const fileInput = document.getElementById('inputPhotoFile');
  const previewWrap = document.getElementById('photoUploadPreviewWrap');
  const previewImg = document.getElementById('photoUploadPreviewImg');

  function closeAddPhotoModal() {
    if (addPhotoModal) addPhotoModal.classList.add('hidden');
  }

  const btnOpenAddPhoto = document.getElementById('btnOpenAddPhoto');
  if (btnOpenAddPhoto) {
    btnOpenAddPhoto.addEventListener('click', () => {
      pendingUploadedDataUrl = '';
      if (fileInput) fileInput.value = '';
      if (previewWrap) previewWrap.classList.add('hidden');
      const titleInput = document.getElementById('inputPhotoTitle');
      if (titleInput) titleInput.value = '';
      const dateInput = document.getElementById('inputPhotoDate');
      if (dateInput) dateInput.value = 'Kỷ niệm 20/10';
      const noteInput = document.getElementById('inputPhotoNote');
      if (noteInput) noteInput.value = '';
      if (addPhotoModal) addPhotoModal.classList.remove('hidden');
    });
  }

  const btnCloseAddPhoto = document.getElementById('btnCloseAddPhoto');
  if (btnCloseAddPhoto) btnCloseAddPhoto.addEventListener('click', closeAddPhotoModal);

  const btnCancelAddPhoto = document.getElementById('btnCancelAddPhoto');
  if (btnCancelAddPhoto) btnCancelAddPhoto.addEventListener('click', closeAddPhotoModal);

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        pendingUploadedDataUrl = ev.target.result;
        if (previewImg) previewImg.src = pendingUploadedDataUrl;
        if (previewWrap) previewWrap.classList.remove('hidden');
      };
      reader.readAsDataURL(file);
    });
  }

  const btnConfirmAddPhoto = document.getElementById('btnConfirmAddPhoto');
  if (btnConfirmAddPhoto) {
    btnConfirmAddPhoto.addEventListener('click', () => {
      const titleInput = document.getElementById('inputPhotoTitle');
      const dateInput = document.getElementById('inputPhotoDate');
      const noteInput = document.getElementById('inputPhotoNote');
      const titleVal = (titleInput && titleInput.value.trim()) || `Nụ Cười Của ${appState.recipientName}`;
      const dateVal = (dateInput && dateInput.value.trim()) || 'Kỷ niệm 20/10';
      const noteVal = (noteInput && noteInput.value.trim()) || 'Mỗi khoảnh khắc bên em đều là điều tuyệt vời nhất đối với anh.';
      const fallbackSrc = (typeof DEFAULT_ALBUM_PHOTOS !== 'undefined' && DEFAULT_ALBUM_PHOTOS[0] && DEFAULT_ALBUM_PHOTOS[0].src) || 'assets/images/album-01.JPG';
      const finalSrc = pendingUploadedDataUrl || fallbackSrc;

      if (!pendingUploadedDataUrl) {
        showToast('Hãy chọn một bức ảnh từ máy của bạn hoặc dùng ảnh kỷ niệm mặc định nhé!', '📷');
      }

      const newPhoto = {
        id: 'p_' + Date.now(),
        src: finalSrc,
        title: titleVal,
        dateTag: dateVal,
        caption: noteVal,
        favorite: true,
        likes: 100
      };
      appState.albumPhotos.unshift(newPhoto);
      appState.albumFilter = 'all';
      saveState();
      renderAlbumGrid();
      closeAddPhotoModal();
      spawnFloatingHearts(8);
      playChimeNote(880, 0.7);
      showToast(`Đã thêm ảnh "${titleVal}" vào Album của ${appState.recipientName}!`, '📸');
    });
  }

  // Customize Modal Controls
  const modal = document.getElementById('customizeModal');
  function openCustomizeModal() {
    if (!modal) return;
    const recInput = document.getElementById('inputRecipientName');
    if (recInput) recInput.value = appState.recipientName;
    const sndInput = document.getElementById('inputSenderName');
    if (sndInput) sndInput.value = appState.senderName;
    const dateInput = document.getElementById('inputStartDate');
    if (dateInput) dateInput.value = appState.startDate;
    const letterInput = document.getElementById('inputCustomLetter');
    if (letterInput) letterInput.value = appState.letterText;
    if (Array.isArray(appState.vouchers)) {
      const v1 = document.getElementById('inputVoucher1');
      if (v1 && appState.vouchers[0]) v1.value = appState.vouchers[0].title;
      const v2 = document.getElementById('inputVoucher2');
      if (v2 && appState.vouchers[1]) v2.value = appState.vouchers[1].title;
      const v3 = document.getElementById('inputVoucher3');
      if (v3 && appState.vouchers[2]) v3.value = appState.vouchers[2].title;
    }
    modal.classList.remove('hidden');
  }

  function closeCustomizeModal() {
    if (modal) modal.classList.add('hidden');
  }

  const btnOpenCustomize = document.getElementById('btnOpenCustomize');
  if (btnOpenCustomize) btnOpenCustomize.addEventListener('click', openCustomizeModal);

  const btnCloseCustomize = document.getElementById('btnCloseCustomize');
  if (btnCloseCustomize) btnCloseCustomize.addEventListener('click', closeCustomizeModal);

  const btnCancelCustomize = document.getElementById('btnCancelCustomize');
  if (btnCancelCustomize) btnCancelCustomize.addEventListener('click', closeCustomizeModal);

  const btnSaveCustomize = document.getElementById('btnSaveCustomize');
  if (btnSaveCustomize) {
    btnSaveCustomize.addEventListener('click', () => {
      const rec = document.getElementById('inputRecipientName')?.value.trim();
      const snd = document.getElementById('inputSenderName')?.value.trim();
      const dt = document.getElementById('inputStartDate')?.value;
      const ltr = document.getElementById('inputCustomLetter')?.value.trim();
      const v1 = document.getElementById('inputVoucher1')?.value.trim();
      const v2 = document.getElementById('inputVoucher2')?.value.trim();
      const v3 = document.getElementById('inputVoucher3')?.value.trim();

      if (rec) appState.recipientName = rec;
      if (snd) appState.senderName = snd;
      if (dt) appState.startDate = dt;
      if (ltr) appState.letterText = ltr;
      if (v1 && appState.vouchers[0]) appState.vouchers[0].title = v1;
      if (v2 && appState.vouchers[1]) appState.vouchers[1].title = v2;
      if (v3 && appState.vouchers[2]) appState.vouchers[2].title = v3;

      saveState();
      updatePersonalizationUI();
      renderGiftBoxes();
      const envOpened = document.getElementById('envelopeOpenedView');
      if (envOpened && !envOpened.classList.contains('hidden')) {
        playLetterTypewriter(appState.letterText);
      }
      closeCustomizeModal();
      spawnFloatingHearts(8);
      showToast(`Đã cập nhật trang web dành riêng cho ${appState.recipientName}!`, '💝');
    });
  }
});
