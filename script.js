/**
 * ROMANTIC FLIPBOOK & BUCIN WEB - INTERACTION SCRIPT
 * Features:
 * - 3D Realistic Book Flipping physics & state machine
 * - Real-time Synchronized Karaoke Lyrics (Westlife - I Lay My Love On You)
 * - Synthesized Audio Effects via Web Audio API (Paper turn, Chimes)
 * - Canvas Floating Sakura/Rose Petals & Golden Bokeh
 * - Magic Sparkle Cursor Trail
 * - Interactive widgets (Gemoy Meter, Anti-Ngambek Kit, Love Quiz, Secret Letter)
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. STATE & DOM REFERENCES
  // =========================================================================
  const state = {
    currentSheet: 0,
    totalSheets: 7, // Sheets 0 to 6
    isPlaying: false,
    soundFxEnabled: true,
    particlesEnabled: true,
    isMobile: window.innerWidth <= 768
  };

  const DOM = {
    // Audio & Music Player
    bgMusic: document.getElementById('bgMusic'),
    musicWidget: document.getElementById('musicWidget'),
    vinylRecord: document.getElementById('vinylRecord'),
    playPauseBtn: document.getElementById('playPauseBtn'),
    playIcon: document.getElementById('playIcon'),
    pauseIcon: document.getElementById('pauseIcon'),
    currentTimeDisplay: document.getElementById('currentTimeDisplay'),
    totalTimeDisplay: document.getElementById('totalTimeDisplay'),
    progressBarContainer: document.getElementById('progressBarContainer'),
    progressBarFill: document.getElementById('progressBarFill'),
    jumpChorusBtn: document.getElementById('jumpChorusBtn'),
    soundFxBtn: document.getElementById('soundFxBtn'),
    soundFxIcon: document.getElementById('soundFxIcon'),

    // Intro Screen & Envelope
    introScreen: document.getElementById('introScreen'),
    envelopeWrapper: document.getElementById('envelopeWrapper'),
    envelope: document.getElementById('envelope'),
    openBookBtn: document.getElementById('openBookBtn'),

    // Flipbook
    book: document.getElementById('book'),
    sheets: Array.from(document.querySelectorAll('.sheet')),
    prevPageBtn: document.getElementById('prevPageBtn'),
    nextPageBtn: document.getElementById('nextPageBtn'),
    pageCurrentLabel: document.getElementById('pageCurrentLabel'),
    pageDotsWrap: document.getElementById('pageDotsWrap'),
    replayBookBtn: document.getElementById('replayBookBtn'),

    // Canvas
    ambientCanvas: document.getElementById('ambientCanvas'),
    sparkleCanvas: document.getElementById('sparkleCanvas'),

    // Lyrics & Drawers
    lyricsScrollBox: document.getElementById('lyricsScrollBox'),
    lyricLines: Array.from(document.querySelectorAll('.lyric-line')),
    lyricsDrawer: document.getElementById('lyricsDrawer'),
    drawerLyricsList: document.getElementById('drawerLyricsList'),
    toggleLyricsDrawerBtn: document.getElementById('toggleLyricsDrawerBtn'),
    closeLyricsDrawerBtn: document.getElementById('closeLyricsDrawerBtn'),

    // Modals
    photoModal: document.getElementById('photoModal'),
    modalImg: document.getElementById('modalImg'),
    modalCaption: document.getElementById('modalCaption'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    secretMessageModal: document.getElementById('secretMessageModal'),
    secretModalBtn: document.getElementById('secretModalBtn'),
    closeSecretModalBtn: document.getElementById('closeSecretModalBtn'),

    // Interactive Page Elements
    sendHugBtn: document.getElementById('sendHugBtn'),
    secretNoteBox1: document.getElementById('secretNoteBox1'),
    boostGemoyBtn: document.getElementById('boostGemoyBtn'),
    gemoyScore: document.getElementById('gemoyScore'),
    gemoyMeterFill: document.getElementById('gemoyMeterFill'),
    kitBtns: Array.from(document.querySelectorAll('.kit-btn')),
    kitGiftAlert: document.getElementById('kitGiftAlert'),
    quizBtn1: document.getElementById('quizBtn1'),
    quizBtn2: document.getElementById('quizBtn2'),
    quizAnswer: document.getElementById('quizAnswer'),
    climaxHeartBtn: document.getElementById('climaxHeartBtn'),
    heartBurstBtn: document.getElementById('heartBurstBtn'),
    toggleSparklesBtn: document.getElementById('toggleSparklesBtn')
  };

  state.sheets = DOM.sheets;

  // Full Lyrics Dataset for Drawer
  const fullLyricsData = [
    { start: 14, end: 21, text: "Just a smile and the rain is gone, can hardly believe it (yeah)" },
    { start: 21, end: 28, text: "There's an angel standing next to me, reaching for my hand" },
    { start: 28, end: 34, text: "A girl with a garden in her eyes, on my mind all the time" },
    { start: 34, end: 38, text: "I was lost in a lonely place" },
    { start: 38, end: 41, text: "Could hardly believe it, yeah" },
    { start: 41, end: 45, text: "Holding on to yesterday" },
    { start: 45, end: 49, text: "Far, far too long" },
    { start: 49, end: 53, text: "Now I believe it's morning sun, I can't believe it's true" },
    { start: 53, end: 57, text: "I lay my love on you" },
    { start: 57, end: 60, text: "It's all I wanna do" },
    { start: 60, end: 66, text: "Every time I breathe I feel brand new" },
    { start: 66, end: 69, text: "You opened up my heart" },
    { start: 69, end: 75, text: "Show me all your love and walk right through" },
    { start: 75, end: 82, text: "As I lay my love on you" }
  ];

  // =========================================================================
  // 2. SYNTHESIZED WEB AUDIO EFFECTS (Paper rustle, heart bell)
  // =========================================================================
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Realistic Paper Page Turn Sound
  function playPageTurnSound() {
    if (!state.soundFxEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      
      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.14);
      filter.Q.value = 3.0;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 0.15);
    } catch (e) {
      console.warn('WebAudio notice:', e);
    }
  }

  // Sweet chime / sparkle sound
  function playChimeSound(freq = 880) {
    if (!state.soundFxEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {}
  }

  // =========================================================================
  // 3. FLIPBOOK 3D LOGIC & NAVIGATION
  // =========================================================================
  function initBook() {
    updateSheetZIndices();
    buildPageDots();
    updateNavigationUI();
  }

  function updateSheetZIndices() {
    const total = state.totalSheets;
    DOM.sheets.forEach((sheet, index) => {
      if (index < state.currentSheet) {
        // Already flipped (left side of book)
        sheet.classList.add('flipped');
        sheet.style.zIndex = index + 1;
      } else {
        // Not flipped (right side of book)
        sheet.classList.remove('flipped');
        sheet.style.zIndex = total - index;
      }
    });

    // Update Book state translation (centering effect)
    DOM.book.classList.remove('state-closed-front', 'state-open', 'state-closed-back');
    if (state.currentSheet === 0) {
      DOM.book.classList.add('state-closed-front');
    } else if (state.currentSheet >= state.totalSheets) {
      DOM.book.classList.add('state-closed-back');
    } else {
      DOM.book.classList.add('state-open');
    }
  }

  function flipNext() {
    if (state.currentSheet < state.totalSheets) {
      playPageTurnSound();
      state.currentSheet++;
      updateSheetZIndices();
      updateNavigationUI();
    }
  }

  function flipPrev() {
    if (state.currentSheet > 0) {
      playPageTurnSound();
      state.currentSheet--;
      updateSheetZIndices();
      updateNavigationUI();
    }
  }

  function jumpToSheet(index) {
    if (index >= 0 && index <= state.totalSheets && index !== state.currentSheet) {
      playPageTurnSound();
      state.currentSheet = index;
      updateSheetZIndices();
      updateNavigationUI();
    }
  }

  function buildPageDots() {
    DOM.pageDotsWrap.innerHTML = '';
    for (let i = 0; i <= state.totalSheets; i++) {
      const dot = document.createElement('div');
      dot.className = `page-dot ${i === state.currentSheet ? 'active' : ''}`;
      dot.title = i === 0 ? 'Sampul Depan' : i === state.totalSheets ? 'Sampul Belakang' : `Bagian ${i}`;
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        jumpToSheet(i);
      });
      DOM.pageDotsWrap.appendChild(dot);
    }
  }

  function updateNavigationUI() {
    DOM.prevPageBtn.disabled = state.currentSheet === 0;
    DOM.nextPageBtn.disabled = state.currentSheet === state.totalSheets;

    // Page current label
    if (state.currentSheet === 0) {
      DOM.pageCurrentLabel.textContent = 'Halaman Sampul Depan';
    } else if (state.currentSheet === state.totalSheets) {
      DOM.pageCurrentLabel.textContent = 'Halaman Sampul Belakang';
    } else {
      const leftPageNum = (state.currentSheet - 1) * 2 + 1;
      const rightPageNum = leftPageNum + 1;
      DOM.pageCurrentLabel.textContent = `Halaman ${leftPageNum} & ${rightPageNum} dari 12`;
    }

    // Update dots
    const dots = DOM.pageDotsWrap.querySelectorAll('.page-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === state.currentSheet);
    });
  }

  // Bind Sheet Clicks
  DOM.sheets.forEach((sheet, idx) => {
    sheet.addEventListener('click', (e) => {
      // Don't flip if user clicked interactive buttons/widgets inside the page
      if (e.target.closest('button') || e.target.closest('.secret-note-box') || e.target.closest('.lyric-line') || e.target.closest('.polaroid-card')) {
        return;
      }
      
      if (idx < state.currentSheet) {
        // Sheet on left was clicked -> flip back
        flipPrev();
      } else {
        // Sheet on right was clicked -> flip forward
        flipNext();
      }
    });
  });

  DOM.prevPageBtn.addEventListener('click', flipPrev);
  DOM.nextPageBtn.addEventListener('click', flipNext);
  if (DOM.replayBookBtn) {
    DOM.replayBookBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      jumpToSheet(1); // Kembali ke halaman awal buku (Hal 1 & 2)
    });
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      flipNext();
    } else if (e.key === 'ArrowLeft') {
      flipPrev();
    }
  });

  // Touch Swipe for Mobile
  let touchStartX = 0;
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (e.changedTouches.length === 1) {
      const diffX = e.changedTouches[0].clientX - touchStartX;
      const diffY = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) {
          flipNext(); // Swiped left -> next
        } else {
          flipPrev(); // Swiped right -> prev
        }
      }
    }
  }, { passive: true });

  // =========================================================================
  // 4. MUSIC & SYNCHRONIZED KARAOKE LYRICS
  // =========================================================================
  function toggleMusic() {
    getAudioContext();
    if (state.isPlaying) {
      DOM.bgMusic.pause();
    } else {
      DOM.bgMusic.play().catch(e => console.log('Autoplay deferred:', e));
    }
  }

  DOM.bgMusic.addEventListener('play', () => {
    state.isPlaying = true;
    DOM.playIcon.style.display = 'none';
    DOM.pauseIcon.style.display = 'block';
    DOM.vinylRecord.classList.add('spinning');
  });

  DOM.bgMusic.addEventListener('pause', () => {
    state.isPlaying = false;
    DOM.playIcon.style.display = 'block';
    DOM.pauseIcon.style.display = 'none';
    DOM.vinylRecord.classList.remove('spinning');
  });

  DOM.playPauseBtn.addEventListener('click', toggleMusic);

  // Jump to Chorus (Westlife requested lyrics)
  DOM.jumpChorusBtn.addEventListener('click', () => {
    getAudioContext();
    DOM.bgMusic.currentTime = 53; // Chorus start time
    if (!state.isPlaying) DOM.bgMusic.play();
    jumpToSheet(5); // Jump to lyrics page (Sheet 5)
    createHeartConfettiBurst(window.innerWidth / 2, window.innerHeight / 2, 25);
  });

  // Time formatting
  function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  DOM.bgMusic.addEventListener('loadedmetadata', () => {
    DOM.totalTimeDisplay.textContent = formatTime(DOM.bgMusic.duration);
  });

  // Progress Bar updates & Lyrics sync
  DOM.bgMusic.addEventListener('timeupdate', () => {
    const cur = DOM.bgMusic.currentTime;
    const dur = DOM.bgMusic.duration || 198;
    
    DOM.currentTimeDisplay.textContent = formatTime(cur);
    const pct = (cur / dur) * 100;
    DOM.progressBarFill.style.width = `${pct}%`;

    // Sync Page Lyrics
    DOM.lyricLines.forEach(line => {
      const start = parseFloat(line.getAttribute('data-start'));
      const end = parseFloat(line.getAttribute('data-end'));
      if (cur >= start && cur < end) {
        if (!line.classList.contains('active')) {
          line.classList.add('active');
          line.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } else {
        line.classList.remove('active');
      }
    });

    // Sync Drawer Lyrics
    const drawerItems = DOM.drawerLyricsList.querySelectorAll('.drawer-lyric-item');
    drawerItems.forEach(item => {
      const start = parseFloat(item.getAttribute('data-start'));
      const end = parseFloat(item.getAttribute('data-end'));
      if (cur >= start && cur < end) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  });

  // Click on Scrubber Bar to seek
  DOM.progressBarContainer.addEventListener('click', (e) => {
    const rect = DOM.progressBarContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const fraction = clickX / rect.width;
    const dur = DOM.bgMusic.duration || 198;
    DOM.bgMusic.currentTime = fraction * dur;
  });

  // Click on Lyric line to seek directly
  DOM.lyricLines.forEach(line => {
    line.addEventListener('click', (e) => {
      e.stopPropagation();
      const start = parseFloat(line.getAttribute('data-start'));
      getAudioContext();
      DOM.bgMusic.currentTime = start;
      if (!state.isPlaying) DOM.bgMusic.play();
      createHeartConfettiBurst(e.clientX, e.clientY, 10);
    });
  });

  // Sound FX toggle
  DOM.soundFxBtn.addEventListener('click', () => {
    state.soundFxEnabled = !state.soundFxEnabled;
    DOM.soundFxIcon.textContent = state.soundFxEnabled ? '🔊' : '🔇';
    DOM.soundFxBtn.title = state.soundFxEnabled ? 'Efek Suara Aktif' : 'Efek Suara Dibisukan';
  });

  // =========================================================================
  // 5. INTRO SCREEN & ENVELOPE OPENING ANIMATION
  // =========================================================================
  function openEnvelopeAndStart() {
    getAudioContext();
    playChimeSound(660);
    DOM.envelope.classList.add('open');

    // Create opening sparkle explosion
    const rect = DOM.envelopeWrapper.getBoundingClientRect();
    createHeartConfettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 35);

    setTimeout(() => {
      DOM.introScreen.classList.add('hide');
      // Auto-start music
      DOM.bgMusic.play().catch(e => console.log('Audio autoplay:', e));
      // Flip open cover to page 1 smoothly
      setTimeout(() => {
        flipNext();
      }, 700);
    }, 900);
  }

  DOM.envelopeWrapper.addEventListener('click', openEnvelopeAndStart);
  DOM.openBookBtn.addEventListener('click', openEnvelopeAndStart);

  // =========================================================================
  // 6. POPUP MODALS & LYRICS DRAWER
  // =========================================================================
  // Polaroid Photos Click to Zoom
  const polaroids = document.querySelectorAll('.polaroid-card');
  polaroids.forEach(card => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      const img = card.querySelector('.polaroid-img');
      const caption = card.querySelector('.handwritten-script');
      if (img) {
        DOM.modalImg.src = img.src;
        DOM.modalCaption.textContent = caption ? caption.textContent : 'My Favorite Girl ✨';
        DOM.photoModal.classList.add('open');
        playChimeSound(900);
      }
    });
  });

  DOM.closeModalBtn.addEventListener('click', () => DOM.photoModal.classList.remove('open'));
  DOM.photoModal.addEventListener('click', (e) => {
    if (e.target === DOM.photoModal) DOM.photoModal.classList.remove('open');
  });

  // Secret Message Modal
  function openSecretMessage() {
    DOM.secretMessageModal.classList.add('open');
    playChimeSound(1040);
    createHeartConfettiBurst(window.innerWidth / 2, window.innerHeight / 2, 25);
  }

  // Event Delegation for failsafe button handling
  document.addEventListener('click', (e) => {
    const replayBtn = e.target.closest('#replayBookBtn');
    if (replayBtn) {
      e.stopPropagation();
      e.preventDefault();
      jumpToSheet(1); // Kembali ke halaman awal buku
      return;
    }

    const secretBtn = e.target.closest('#secretModalBtn, #page12SecretBtn, #navSecretMsgBtn');
    if (secretBtn) {
      e.stopPropagation();
      e.preventDefault();
      openSecretMessage();
      return;
    }
  });

  DOM.closeSecretModalBtn.addEventListener('click', () => DOM.secretMessageModal.classList.remove('open'));
  DOM.secretMessageModal.addEventListener('click', (e) => {
    if (e.target === DOM.secretMessageModal) DOM.secretMessageModal.classList.remove('open');
  });

  // Lyrics Drawer Setup
  function buildLyricsDrawer() {
    DOM.drawerLyricsList.innerHTML = '';
    fullLyricsData.forEach(item => {
      const el = document.createElement('div');
      el.className = 'drawer-lyric-item';
      el.setAttribute('data-start', item.start);
      el.setAttribute('data-end', item.end);
      el.textContent = item.text;
      el.addEventListener('click', () => {
        getAudioContext();
        DOM.bgMusic.currentTime = item.start;
        if (!state.isPlaying) DOM.bgMusic.play();
      });
      DOM.drawerLyricsList.appendChild(el);
    });
  }
  buildLyricsDrawer();

  DOM.toggleLyricsDrawerBtn.addEventListener('click', () => {
    DOM.lyricsDrawer.classList.toggle('open');
  });
  DOM.closeLyricsDrawerBtn.addEventListener('click', () => {
    DOM.lyricsDrawer.classList.remove('open');
  });

  // =========================================================================
  // 7. INTERACTIVE IN-PAGE WIDGETS
  // =========================================================================
  // Peluk Hangat Button
  DOM.sendHugBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playChimeSound(784);
    createHeartConfettiBurst(e.clientX, e.clientY, 30);
    DOM.sendHugBtn.innerHTML = '<span>🤗 Pelukan hangat terkirim! ❤️</span>';
    setTimeout(() => {
      DOM.sendHugBtn.innerHTML = '<span>kirim Peluk Hangat</span>';
    }, 2500);
  });

  // Secret Note Box Flip
  DOM.secretNoteBox1.addEventListener('click', (e) => {
    e.stopPropagation();
    DOM.secretNoteBox1.classList.toggle('revealed');
    playChimeSound(880);
    createHeartConfettiBurst(e.clientX, e.clientY, 15);
  });

  // Gemoy Meter Booster
  let currentGemoy = 1000;
  DOM.boostGemoyBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentGemoy += 500;
    DOM.gemoyScore.textContent = `${currentGemoy}% (Unlimited) 💖`;
    DOM.gemoyMeterFill.style.width = '100%';
    playChimeSound(1000 + Math.random() * 300);
    createHeartConfettiBurst(e.clientX, e.clientY, 20);
  });

  // Anti-Ngambek Kit
  const giftResponses = {
    icecream: '🍦 Es krim rasa kesukaanmu meluncur! Senyum lagi ya manis~',
    chocolate: '🍫 Cokelat manis buat orang termanis! Gak boleh cemberut lagi ya~',
    cuddle: '🫂 Pelukan paling hangat dan erat siap menyelimutimu!'
  };
  DOM.kitBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const gift = btn.getAttribute('data-gift');
      if (DOM.kitGiftAlert) {
        DOM.kitGiftAlert.textContent = giftResponses[gift] || 'Hadiah spesial terkirim!';
      }
      playChimeSound(850);
      createHeartConfettiBurst(e.clientX, e.clientY, 15);
    });
  });

  // Sweet Love Quiz
  function handleQuizClick(e, text) {
    e.stopPropagation();
    DOM.quizAnswer.textContent = `Tepat sekali! Jawabannya ${text} selalu jadi orang paling cantik di seluruh alam semesta! 🏆💖`;
    playChimeSound(980);
    createHeartConfettiBurst(e.clientX, e.clientY, 25);
  }
  DOM.quizBtn1.addEventListener('click', (e) => handleQuizClick(e, 'Firaa'));
  DOM.quizBtn2.addEventListener('click', (e) => handleQuizClick(e, 'kamuu'));

  // Climax Heart Burst
  DOM.climaxHeartBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playChimeSound(1174);
    createGrandLoveFirework();
  });

  DOM.heartBurstBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playChimeSound(1046);
    createGrandLoveFirework();
  });

  function createGrandLoveFirework() {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    createHeartConfettiBurst(cx, cy, 60);
    setTimeout(() => createHeartConfettiBurst(cx - 180, cy - 80, 40), 200);
    setTimeout(() => createHeartConfettiBurst(cx + 180, cy - 80, 40), 400);
  }

  // =========================================================================
  // 8. FLOATING HEARTS & CONFETTI BURST
  // =========================================================================
  const heartIcons = ['💖', '💕', '💗', '💓', '❤️', '🌸', '✨', '🌹'];
  function createHeartConfettiBurst(x, y, count = 20) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'floating-heart-burst';
      el.textContent = heartIcons[Math.floor(Math.random() * heartIcons.length)];
      
      const angle = Math.random() * Math.PI * 2;
      const distance = 80 + Math.random() * 220;
      const destX = Math.cos(angle) * distance;
      const destY = Math.sin(angle) * distance - (40 + Math.random() * 80); // Upward bias
      const rot = (Math.random() - 0.5) * 360;

      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.fontSize = `${1.2 + Math.random() * 1.4}rem`;
      el.style.setProperty('--dest-x', `${destX}px`);
      el.style.setProperty('--dest-y', `${destY}px`);
      el.style.setProperty('--dest-rot', `${rot}deg`);

      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1800);
    }
  }

  // =========================================================================
  // 9. AMBIENT PETALS & GOLDEN BOKEH CANVAS ANIMATION
  // =========================================================================
  const canvas = DOM.ambientCanvas;
  const ctx = canvas.getContext('2d');
  let animationFrameId = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const petals = [];
  const petalCount = 35;
  for (let i = 0; i < petalCount; i++) {
    petals.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: 6 + Math.random() * 8,
      speedY: 0.8 + Math.random() * 1.5,
      speedX: (Math.random() - 0.5) * 1.2,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.03,
      alpha: 0.4 + Math.random() * 0.4,
      color: Math.random() > 0.4 ? 'rgba(244, 166, 185,' : 'rgba(212, 175, 55,'
    });
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.fillStyle = `${p.color}${p.alpha})`;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.radius, p.radius * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function animatePetals() {
    if (!state.particlesEnabled) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      animationFrameId = requestAnimationFrame(animatePetals);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => {
      p.y += p.speedY;
      p.x += Math.sin(p.angle) * 0.8 + p.speedX;
      p.angle += p.spin;

      if (p.y > canvas.height + 20) {
        p.y = -20;
        p.x = Math.random() * canvas.width;
      }
      if (p.x > canvas.width + 20) p.x = -20;
      if (p.x < -20) p.x = canvas.width + 20;

      drawPetal(p);
    });

    animationFrameId = requestAnimationFrame(animatePetals);
  }
  animatePetals();

  DOM.toggleSparklesBtn.addEventListener('click', () => {
    state.particlesEnabled = !state.particlesEnabled;
    DOM.toggleSparklesBtn.style.opacity = state.particlesEnabled ? '1' : '0.5';
  });

  // =========================================================================
  // 10. SPARKLE CURSOR TRAIL CANVAS
  // =========================================================================
  const spCanvas = DOM.sparkleCanvas;
  const spCtx = spCanvas.getContext('2d');
  function resizeSparkleCanvas() {
    spCanvas.width = window.innerWidth;
    spCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeSparkleCanvas);
  resizeSparkleCanvas();

  const cursorSparkles = [];
  function addSparkle(x, y) {
    if (cursorSparkles.length < 45) {
      cursorSparkles.push({
        x: x,
        y: y,
        size: 3 + Math.random() * 4,
        alpha: 1,
        speedX: (Math.random() - 0.5) * 1.5,
        speedY: (Math.random() - 0.5) * 1.5 - 0.5,
        color: Math.random() > 0.5 ? '#ffd700' : '#ff85a1'
      });
    }
  }

  window.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.4) addSparkle(e.clientX, e.clientY);
  });
  window.addEventListener('touchmove', (e) => {
    if (e.touches[0] && Math.random() > 0.4) {
      addSparkle(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  function animateSparkleTrail() {
    spCtx.clearRect(0, 0, spCanvas.width, spCanvas.height);
    for (let i = cursorSparkles.length - 1; i >= 0; i--) {
      const sp = cursorSparkles[i];
      sp.x += sp.speedX;
      sp.y += sp.speedY;
      sp.alpha -= 0.035;
      sp.size = Math.max(0, sp.size - 0.08);

      if (sp.alpha <= 0) {
        cursorSparkles.splice(i, 1);
        continue;
      }

      spCtx.save();
      spCtx.globalAlpha = sp.alpha;
      spCtx.fillStyle = sp.color;
      spCtx.shadowColor = sp.color;
      spCtx.shadowBlur = 6;
      spCtx.beginPath();
      spCtx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
      spCtx.fill();
      spCtx.restore();
    }
    requestAnimationFrame(animateSparkleTrail);
  }
  animateSparkleTrail();

  // Initialize the book layout
  initBook();
});
