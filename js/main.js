/**
 * ===================================================================
 * 💖 ROMANTIC BIRTHDAY & LOVE STORY - CORE ENGINE & INTERACTIONS
 * ===================================================================
 * Handles GSAP animations, audio playback with fallback, Ken Burns reel,
 * Polaroid lightbox, live counter, typewriter, interactive envelope,
 * and birthday cake candle blow finale.
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const config = window.LOVE_CONFIG || {};

  // -----------------------------------------------------------------
  // 1. Audio Synthesizer (Chime effect on candle blow without assets)
  // -----------------------------------------------------------------
  function playMagicalChime() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        
        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + idx * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 1.2);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 1.3);
      });
    } catch (e) {
      console.log('Audio chime not supported or allowed', e);
    }
  }

  // -----------------------------------------------------------------
  // 2. Initialize Particles
  // -----------------------------------------------------------------
  const particleEngine = new RomanticParticleSystem('particles-canvas');

  // -----------------------------------------------------------------
  // 3. Centralized Audio Player with Robust Fallback & Video Soundtrack
  // -----------------------------------------------------------------
  const audioElement = document.getElementById('bg-audio');
  const videoAudioElement = document.getElementById('bg-video-audio');
  const vinylDisc = document.getElementById('vinyl-disc');
  const soundwaveBars = document.getElementById('soundwave-bars');
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  const musicToggleIcon = document.getElementById('music-toggle-icon');
  const muteToggleBtn = document.getElementById('mute-toggle-btn');
  const muteIcon = document.getElementById('mute-icon');

  let isPlaying = false;
  let activeAudio = audioElement;

  // Setup song info in pill
  if (config.music) {
    const titleEl = document.getElementById('player-song-title');
    const artistEl = document.getElementById('player-artist');
    const albumCoverEl = document.getElementById('player-album-cover');

    if (titleEl) titleEl.textContent = config.music.songTitle || 'نغمة حبنا';
    if (artistEl) artistEl.textContent = config.music.artistName || 'أجمل نغمة لعيونك ❤️';
    if (albumCoverEl && config.music.albumCover) albumCoverEl.src = config.music.albumCover;

    if (videoAudioElement && config.music.fallbackSongUrl) {
      videoAudioElement.src = config.music.fallbackSongUrl;
    }
  }

  function updateAudioUI(playing) {
    isPlaying = playing;
    if (playing) {
      vinylDisc?.classList.add('playing');
      soundwaveBars?.classList.add('playing');
      if (musicToggleIcon) {
        musicToggleIcon.classList.remove('fa-play');
        musicToggleIcon.classList.add('fa-pause');
      }
    } else {
      vinylDisc?.classList.remove('playing');
      soundwaveBars?.classList.remove('playing');
      if (musicToggleIcon) {
        musicToggleIcon.classList.remove('fa-pause');
        musicToggleIcon.classList.add('fa-play');
      }
    }
  }

  function playMusic() {
    activeAudio.play()
      .then(() => updateAudioUI(true))
      .catch(err => {
        console.log('Primary audio play attempt:', err);
        if (videoAudioElement && activeAudio !== videoAudioElement) {
          activeAudio = videoAudioElement;
          videoAudioElement.play()
            .then(() => updateAudioUI(true))
            .catch(e => {
              console.log('Video audio play attempt:', e);
              updateAudioUI(false);
            });
        } else {
          updateAudioUI(false);
        }
      });
  }

  function pauseMusic() {
    audioElement.pause();
    if (videoAudioElement) videoAudioElement.pause();
    updateAudioUI(false);
  }

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => {
      if (isPlaying) {
        pauseMusic();
      } else {
        playMusic();
      }
    });
  }

  if (muteToggleBtn) {
    muteToggleBtn.addEventListener('click', () => {
      const newMuted = !audioElement.muted;
      audioElement.muted = newMuted;
      if (videoAudioElement) videoAudioElement.muted = newMuted;
      if (newMuted) {
        muteIcon.className = 'fa-solid fa-volume-xmark text-rose-400';
      } else {
        muteIcon.className = 'fa-solid fa-volume-high text-pink-300';
      }
    });
  }

  // -----------------------------------------------------------------
  // 4. Interactive "Gift Unwrap" Splash Screen Flow
  // -----------------------------------------------------------------
  const splashScreen = document.getElementById('splash-screen');
  const giftBoxBtn = document.getElementById('gift-box-btn');
  const openGiftBtn = document.getElementById('open-gift-btn');
  const boxLid = document.getElementById('box-lid');

  function unwrapGift() {
    if (!splashScreen || splashScreen.classList.contains('opened')) return;
    splashScreen.classList.add('opened');

    // Start background music immediately
    playMusic();

    // GSAP 3D Gift Box Animation
    const tl = gsap.timeline();

    tl.to(boxLid, {
      y: -90,
      rotation: -18,
      duration: 0.65,
      ease: 'back.out(2)'
    })
    .to('.gift-bow', {
      y: -110,
      scale: 1.2,
      opacity: 0,
      duration: 0.5
    }, '-=0.5')
    .call(() => {
      // Confetti burst
      window.Celebration.giftUnwrapConfetti();
      // Start particle canvas system
      particleEngine.start();
    })
    .to(splashScreen, {
      opacity: 0,
      scale: 1.05,
      filter: 'blur(10px)',
      duration: 1.1,
      ease: 'power2.inOut',
      delay: 0.2,
      onComplete: () => {
        splashScreen.style.display = 'none';
        // Reveal hero section smoothly
        gsap.from('#hero > div', {
          opacity: 0,
          y: 40,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out'
        });
      }
    });
  }

  if (giftBoxBtn) giftBoxBtn.addEventListener('click', unwrapGift);
  if (openGiftBtn) openGiftBtn.addEventListener('click', unwrapGift);

  // -----------------------------------------------------------------
  // 5. Populate Dynamic Content from config.js
  // -----------------------------------------------------------------
  function populateDynamicConfig() {
    // Recipient & Hero
    if (config.recipient) {
      const recipientName = config.recipient.name || 'حبيبتي';
      const heroNameEl = document.getElementById('hero-recipient-name');
      const navBrandEl = document.getElementById('nav-brand-name');
      const footerNameEl = document.getElementById('footer-name');
      const heroBadgeEl = document.getElementById('hero-badge');

      const senderName = config.sender?.name || 'كريم';
      if (heroNameEl) heroNameEl.textContent = recipientName;
      if (navBrandEl) navBrandEl.textContent = config.coupleNames || `${recipientName} & ${senderName} ❤️`;
      if (footerNameEl) footerNameEl.textContent = recipientName;
      if (heroBadgeEl && config.recipient.heroBadge) heroBadgeEl.textContent = config.recipient.heroBadge;
    }

    // Direction & Language
    if (config.direction) {
      document.documentElement.setAttribute('dir', config.direction);
    }

    // Counter Titles
    if (config.counterTitle) {
      const el = document.getElementById('counter-title');
      if (el) el.innerHTML = `<i class="fa-solid fa-hourglass-half text-love-gold"></i> <span>${config.counterTitle}</span>`;
    }
    if (config.counterSubtitle) {
      const el = document.getElementById('counter-subtitle');
      if (el) el.textContent = config.counterSubtitle;
    }

    // Love Letter
    if (config.loveLetter) {
      const greetingEl = document.getElementById('letter-greeting');
      const paragraphsEl = document.getElementById('letter-paragraphs');
      const closingEl = document.getElementById('letter-closing');
      const signatureEl = document.getElementById('letter-signature');

      if (greetingEl && config.loveLetter.greeting) greetingEl.textContent = config.loveLetter.greeting;
      if (closingEl && config.loveLetter.closing) closingEl.textContent = config.loveLetter.closing;
      if (signatureEl && config.loveLetter.signature) signatureEl.textContent = config.loveLetter.signature;

      if (paragraphsEl && Array.isArray(config.loveLetter.paragraphs)) {
        paragraphsEl.innerHTML = config.loveLetter.paragraphs
          .map(p => `<p class="leading-relaxed sm:leading-loose text-pink-100/90">${p}</p>`)
          .join('');
      }
    }

    // Cake Section
    if (config.cakeSection) {
      const titleEl = document.getElementById('cake-section-title');
      const subtitleEl = document.getElementById('cake-section-subtitle');
      const btnTextEl = document.getElementById('cake-btn-text');
      const modalTitleEl = document.getElementById('wish-modal-title');
      const modalMsgEl = document.getElementById('wish-modal-message');
      const secretNoteEl = document.getElementById('wish-secret-note');

      if (titleEl && config.cakeSection.title) titleEl.textContent = config.cakeSection.title;
      if (subtitleEl && config.cakeSection.subtitle) subtitleEl.textContent = config.cakeSection.subtitle;
      if (btnTextEl && config.cakeSection.buttonText) btnTextEl.textContent = config.cakeSection.buttonText;
      if (modalTitleEl && config.cakeSection.wishGrantedTitle) modalTitleEl.textContent = config.cakeSection.wishGrantedTitle;
      if (modalMsgEl && config.cakeSection.wishGrantedMessage) modalMsgEl.textContent = config.cakeSection.wishGrantedMessage;
      if (secretNoteEl && config.cakeSection.secretLoveNote) secretNoteEl.textContent = config.cakeSection.secretLoveNote;
    }

    // Splash Screen Customization
    if (config.splash) {
      const splashTitle = document.getElementById('splash-title');
      const splashSubtitle = document.getElementById('splash-subtitle');
      const splashBtnText = document.getElementById('splash-btn-text');
      const splashSoundHint = document.getElementById('splash-sound-hint');

      if (splashTitle && config.splash.title) splashTitle.textContent = config.splash.title;
      if (splashSubtitle && config.splash.subtitle) splashSubtitle.textContent = config.splash.subtitle;
      if (splashBtnText && config.splash.tapPrompt) splashBtnText.textContent = config.splash.tapPrompt;
      if (splashSoundHint && config.splash.soundHint) {
        splashSoundHint.innerHTML = `<i class="fa-solid fa-volume-high text-love-gold"></i> <span>${config.splash.soundHint}</span>`;
      }
    }
  }

  populateDynamicConfig();

  // -----------------------------------------------------------------
  // 6. Live Birthday & Age Counter for Fatma (25/4/2004)
  // -----------------------------------------------------------------
  function startLiveCounter() {
    const birthdate = new Date(config.specialDate || "2004-04-25T00:00:00");
    const daysEl = document.getElementById('counter-days');
    const hoursEl = document.getElementById('counter-hours');
    const minutesEl = document.getElementById('counter-minutes');
    const secondsEl = document.getElementById('counter-seconds');
    const ageBadgeEl = document.getElementById('counter-age-badge');
    const unit1 = document.getElementById('label-unit-1');
    const unit2 = document.getElementById('label-unit-2');
    const unit3 = document.getElementById('label-unit-3');
    const unit4 = document.getElementById('label-unit-4');

    const tabDays = document.getElementById('counter-tab-days');
    const tabDetailed = document.getElementById('counter-tab-detailed');
    const tabNext = document.getElementById('counter-tab-next');

    let currentMode = 'days'; // 'days', 'detailed', 'next'

    function setTabStyles(activeTab) {
      [tabDays, tabDetailed, tabNext].forEach(tab => {
        if (!tab) return;
        if (tab === activeTab) {
          tab.className = 'px-3 py-1 rounded-full font-semibold transition-all bg-rose-600 text-white shadow-sm';
        } else {
          tab.className = 'px-3 py-1 rounded-full font-semibold transition-all text-pink-300 hover:text-white';
        }
      });
    }

    if (tabDays) {
      tabDays.addEventListener('click', () => {
        currentMode = 'days';
        setTabStyles(tabDays);
        updateCounter();
      });
    }
    if (tabDetailed) {
      tabDetailed.addEventListener('click', () => {
        currentMode = 'detailed';
        setTabStyles(tabDetailed);
        updateCounter();
      });
    }
    if (tabNext) {
      tabNext.addEventListener('click', () => {
        currentMode = 'next';
        setTabStyles(tabNext);
        updateCounter();
      });
    }

    function updateCounter() {
      const now = new Date();
      const birthTime = birthdate.getTime();
      let totalDiff = Math.abs(now.getTime() - birthTime);

      // Total days count
      const totalDays = Math.floor(totalDiff / (1000 * 60 * 60 * 24));
      const remHours = Math.floor((totalDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const remMinutes = Math.floor((totalDiff % (1000 * 60 * 60)) / (1000 * 60));
      const remSeconds = Math.floor((totalDiff % (1000 * 60)) / 1000);

      // Detailed Years, Months, Days breakdown
      let years = now.getFullYear() - birthdate.getFullYear();
      let birthMonth = birthdate.getMonth();
      let currentMonth = now.getMonth();
      let birthDay = birthdate.getDate();
      let currentDay = now.getDate();

      let months = currentMonth - birthMonth;
      if (currentDay < birthDay) {
        months--;
      }
      if (months < 0) {
        years--;
        months += 12;
      }
      let prevMonthDate = new Date(now.getFullYear(), now.getMonth(), 0);
      let days = currentDay >= birthDay ? (currentDay - birthDay) : (prevMonthDate.getDate() - birthDay + currentDay);

      // Next Birthday Countdown (25 April)
      let nextBirthday = new Date(now.getFullYear(), birthMonth, birthDay);
      if (now > nextBirthday) {
        nextBirthday = new Date(now.getFullYear() + 1, birthMonth, birthDay);
      }
      let nextDiff = nextBirthday - now;
      let nextDays = Math.floor(nextDiff / (1000 * 60 * 60 * 24));
      let nextHours = Math.floor((nextDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let nextMins = Math.floor((nextDiff % (1000 * 60 * 60)) / (1000 * 60));
      let nextSecs = Math.floor((nextDiff % (1000 * 60)) / 1000);

      // Update Top Badge
      if (ageBadgeEl) {
        if (currentMode === 'next') {
          ageBadgeEl.textContent = `🎉 متبقي على عيد ميلاد فاطمة القادم (25 أبريل): ${nextDays} يوماً و ${nextHours} ساعة! ✨`;
        } else {
          ageBadgeEl.textContent = `عمر فاطمة الجميل: ${years} سنة و ${months} شهور و ${days} يوماً من النور والرقة ✨`;
        }
      }

      // Render Cards based on Mode
      if (currentMode === 'days') {
        // Mode 1: Total Days (Matches user screenshot: 8241+ Days)
        if (unit1) unit1.textContent = 'يوم';
        if (unit2) unit2.textContent = 'ساعة';
        if (unit3) unit3.textContent = 'دقيقة';
        if (unit4) unit4.textContent = 'ثانية';

        if (daysEl) daysEl.textContent = String(totalDays);
        if (hoursEl) hoursEl.textContent = String(remHours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(remMinutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(remSeconds).padStart(2, '0');
      } else if (currentMode === 'detailed') {
        // Mode 2: Years, Months, Days, Seconds
        if (unit1) unit1.textContent = 'سنة';
        if (unit2) unit2.textContent = 'شهر';
        if (unit3) unit3.textContent = 'يوم';
        if (unit4) unit4.textContent = 'ثانية';

        if (daysEl) daysEl.textContent = String(years);
        if (hoursEl) hoursEl.textContent = String(months).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(days).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(remSeconds).padStart(2, '0');
      } else if (currentMode === 'next') {
        // Mode 3: Next Birthday Countdown
        if (unit1) unit1.textContent = 'يوم متبقي';
        if (unit2) unit2.textContent = 'ساعة';
        if (unit3) unit3.textContent = 'دقيقة';
        if (unit4) unit4.textContent = 'ثانية';

        if (daysEl) daysEl.textContent = String(nextDays);
        if (hoursEl) hoursEl.textContent = String(nextHours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(nextMins).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(nextSecs).padStart(2, '0');
      }
    }

    updateCounter();
    setInterval(updateCounter, 1000);
  }

  startLiveCounter();

  // -----------------------------------------------------------------
  // 7. Vanilla JS Typewriter Effect Engine
  // -----------------------------------------------------------------
  function startTypewriter() {
    const typewriterEl = document.getElementById('typewriter-text');
    if (!typewriterEl) return;

    const phrases = config.typewriterPhrases || [
      "كل عام وأنتِ الخير لكل عام.. 🌸",
      "في مثل هذا اليوم وُلدت سعادتي.. ✨",
      "أحبكِ اليوم وغداً وإلى آخر العمر.. ❤️"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 75;

    function tick() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 35;
      } else {
        typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 75;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        // Pause at full sentence
        typingSpeed = 2200;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 400;
      }

      setTimeout(tick, typingSpeed);
    }

    tick();
  }

  startTypewriter();

  // -----------------------------------------------------------------
  // 8. Cinematic Reel Player (Video-Style Ken Burns Montage)
  // -----------------------------------------------------------------
  const photos = config.photos || [];
  const reelContainer = document.getElementById('reel-slides-container');
  const slideTitleEl = document.getElementById('reel-slide-title');
  const slideCaptionEl = document.getElementById('reel-slide-caption');
  const slideDateEl = document.getElementById('reel-slide-date');
  const slideLocationEl = document.getElementById('reel-slide-location');
  const reelCounterBadge = document.getElementById('reel-counter-badge');
  const progressBar = document.getElementById('reel-progress-bar');
  const reelPlayBtn = document.getElementById('reel-play-btn');
  const reelPlayIcon = document.getElementById('reel-play-icon');
  const reelPrevBtn = document.getElementById('reel-prev-btn');
  const reelNextBtn = document.getElementById('reel-next-btn');
  const reelFullscreenBtn = document.getElementById('reel-fullscreen-btn');

  let currentReelIndex = 0;
  let reelInterval = null;
  let isReelPlaying = true;
  const slideDuration = 6000; // 6 seconds per photo

  function initCinematicReel() {
    if (!reelContainer || photos.length === 0) return;

    // Render image/video elements with Ken Burns styles
    reelContainer.innerHTML = photos.map((item, idx) => {
      const isVideo = item.src && item.src.toLowerCase().endsWith('.mp4');
      if (isVideo) {
        return `<video src="${item.src}" class="ken-burns-img ${idx === 0 ? 'active' : ''}" data-index="${idx}" playsinline muted loop autoplay></video>`;
      }
      return `<img src="${item.src}" alt="${item.title}" class="ken-burns-img ${idx === 0 ? 'active' : ''}" data-index="${idx}">`;
    }).join('');

    updateReelUI(0);
    startReelTimer();
  }

  function updateReelUI(index) {
    const images = reelContainer.querySelectorAll('.ken-burns-img');
    images.forEach((img, idx) => {
      if (idx === index) {
        img.classList.add('active');
      } else {
        img.classList.remove('active');
      }
    });

    const item = photos[index];
    if (item) {
      if (slideTitleEl) slideTitleEl.textContent = item.title;
      if (slideCaptionEl) slideCaptionEl.textContent = item.caption;
      if (slideDateEl) slideDateEl.textContent = item.date;
      if (slideLocationEl) slideLocationEl.textContent = item.location;
      if (reelCounterBadge) {
        const cur = String(index + 1).padStart(2, '0');
        const tot = String(photos.length).padStart(2, '0');
        reelCounterBadge.textContent = `${cur} / ${tot}`;
      }
    }

    // Animate progress bar
    if (progressBar) {
      progressBar.style.transition = 'none';
      progressBar.style.width = '0%';
      setTimeout(() => {
        if (isReelPlaying) {
          progressBar.style.transition = `width ${slideDuration}ms linear`;
          progressBar.style.width = '100%';
        }
      }, 50);
    }
  }

  function nextReelSlide() {
    currentReelIndex = (currentReelIndex + 1) % photos.length;
    updateReelUI(currentReelIndex);
  }

  function prevReelSlide() {
    currentReelIndex = (currentReelIndex - 1 + photos.length) % photos.length;
    updateReelUI(currentReelIndex);
  }

  function startReelTimer() {
    if (reelInterval) clearInterval(reelInterval);
    isReelPlaying = true;
    if (reelPlayIcon) reelPlayIcon.className = 'fa-solid fa-pause';
    reelInterval = setInterval(nextReelSlide, slideDuration);
    if (progressBar) {
      progressBar.style.transition = `width ${slideDuration}ms linear`;
      progressBar.style.width = '100%';
    }
  }

  function pauseReelTimer() {
    if (reelInterval) clearInterval(reelInterval);
    isReelPlaying = false;
    if (reelPlayIcon) reelPlayIcon.className = 'fa-solid fa-play';
    if (progressBar) {
      const computedWidth = window.getComputedStyle(progressBar).width;
      progressBar.style.transition = 'none';
      progressBar.style.width = computedWidth;
    }
  }

  if (reelPlayBtn) {
    reelPlayBtn.addEventListener('click', () => {
      if (isReelPlaying) {
        pauseReelTimer();
      } else {
        startReelTimer();
      }
    });
  }

  if (reelNextBtn) {
    reelNextBtn.addEventListener('click', () => {
      nextReelSlide();
      if (isReelPlaying) startReelTimer();
    });
  }

  if (reelPrevBtn) {
    reelPrevBtn.addEventListener('click', () => {
      prevReelSlide();
      if (isReelPlaying) startReelTimer();
    });
  }

  if (reelFullscreenBtn) {
    reelFullscreenBtn.addEventListener('click', () => {
      const reelFrame = document.getElementById('reel-viewport');
      if (!reelFrame) return;
      if (!document.fullscreenElement) {
        reelFrame.requestFullscreen?.().catch(e => console.log(e));
      } else {
        document.exitFullscreen?.();
      }
    });
  }

  initCinematicReel();

  // -----------------------------------------------------------------
  // 9. Polaroid Photo Gallery & Lightbox Modal
  // -----------------------------------------------------------------
  const polaroidGrid = document.getElementById('polaroid-grid');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxDate = document.getElementById('lightbox-date');
  const closeLightboxBtn = document.getElementById('close-lightbox-btn');

  function initPolaroidGrid() {
    if (!polaroidGrid || photos.length === 0) return;

    polaroidGrid.innerHTML = photos.map((item, idx) => {
      const isVideo = item.src && item.src.toLowerCase().endsWith('.mp4');
      return `
      <div class="polaroid-card group" style="transform: rotate(${item.rotation || '0deg'});" data-index="${idx}">
        <div class="polaroid-img-wrapper relative">
          ${isVideo ? `
            <video src="${item.src}" class="w-full h-full object-cover" muted loop playsinline autoplay></video>
            <div class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-[10px] text-white flex items-center gap-1 backdrop-blur-sm z-10">
              <i class="fa-solid fa-video text-rose-400"></i> فيديو
            </div>
          ` : `
            <img src="${item.src}" alt="${item.title}" loading="lazy">
          `}
        </div>
        <div class="pt-4 text-center">
          <h4 class="font-cairo font-bold text-sm text-gray-900 group-hover:text-rose-600 transition-colors">${item.title}</h4>
          <p class="font-tajawal text-xs text-gray-600 mt-1 line-clamp-2">${item.caption}</p>
          <span class="inline-block mt-3 text-[11px] font-semibold text-rose-500 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">${item.date}</span>
        </div>
      </div>
    `;}).join('');

    // Attach click to open Lightbox
    polaroidGrid.querySelectorAll('.polaroid-card').forEach(card => {
      card.addEventListener('click', () => {
        const index = parseInt(card.getAttribute('data-index'));
        openLightbox(index);
      });
    });
  }

  function openLightbox(index) {
    const item = photos[index];
    if (!item || !lightboxModal) return;

    const isVideo = item.src && item.src.toLowerCase().endsWith('.mp4');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxVideo = document.getElementById('lightbox-video');

    if (isVideo) {
      if (lightboxImg) lightboxImg.classList.add('hidden');
      if (lightboxVideo) {
        lightboxVideo.classList.remove('hidden');
        lightboxVideo.src = item.src;
        lightboxVideo.play().catch(e => console.log(e));
      }
    } else {
      if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.classList.add('hidden');
      }
      if (lightboxImg) {
        lightboxImg.classList.remove('hidden');
        lightboxImg.src = item.src;
      }
    }

    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxCaption) lightboxCaption.textContent = item.caption;
    if (lightboxDate) lightboxDate.textContent = `${item.date} • ${item.location}`;

    lightboxModal.classList.add('active');
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      const lightboxVideo = document.getElementById('lightbox-video');
      if (lightboxVideo) {
        lightboxVideo.pause();
      }
    }
  }

  if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  initPolaroidGrid();

  // -----------------------------------------------------------------
  // 10. Interactive Timeline with GSAP ScrollTrigger
  // -----------------------------------------------------------------
  const timelineContainer = document.getElementById('timeline-container');
  const milestones = config.timelineMilestones || [];

  function initTimeline() {
    if (!timelineContainer || milestones.length === 0) return;

    timelineContainer.innerHTML = milestones.map((item, idx) => {
      const isEven = idx % 2 === 0;
      return `
        <div class="timeline-item relative flex flex-col md:flex-row items-center gap-6 sm:gap-10 ${isEven ? 'md:flex-row-reverse' : ''}">
          <!-- Milestone Card -->
          <div class="w-full md:w-1/2 ${isEven ? 'md:pr-10' : 'md:pl-10'}">
            <div class="glass-card rounded-2xl p-5 sm:p-6 border border-rose-400/25 relative overflow-hidden group hover:border-rose-400/60 transition-all">
              <!-- Top Date Badge -->
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-bold text-love-gold px-3 py-1 rounded-full bg-love-gold/10 border border-love-gold/30">
                  ${item.date}
                </span>
                <span class="text-xs text-rose-300 font-semibold">${item.tag || 'ذكرى ❤️'}</span>
              </div>

              <!-- Thumbnail if present -->
              ${item.image ? `
                <div class="w-full h-44 rounded-xl overflow-hidden mb-4 bg-black/40">
                  <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                </div>
              ` : ''}

              <!-- Content -->
              <h3 class="text-lg sm:text-xl font-bold text-pink-100 font-cairo mb-2 group-hover:text-rose-300 transition-colors">
                ${item.title}
              </h3>
              <p class="text-xs sm:text-sm text-pink-200/80 font-tajawal leading-relaxed">
                ${item.description}
              </p>
            </div>
          </div>

          <!-- Central Node Dot -->
          <div class="timeline-node-dot"></div>

          <!-- Spacer for other side on desktop -->
          <div class="hidden md:block w-1/2"></div>
        </div>
      `;
    }).join('');

    // GSAP ScrollTrigger stagger animation
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      gsap.utils.toArray('.timeline-item').forEach(item => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          opacity: 0,
          y: 40,
          duration: 0.85,
          ease: 'power2.out'
        });
      });
    }
  }

  initTimeline();

  // -----------------------------------------------------------------
  // 11. Interactive Love Letter (Envelope Reveal)
  // -----------------------------------------------------------------
  const envelope = document.getElementById('envelope');
  const fullLetterCard = document.getElementById('full-letter-card');

  if (envelope) {
    envelope.addEventListener('click', () => {
      envelope.classList.toggle('open');

      if (envelope.classList.contains('open')) {
        // Confetti burst
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#ff3366', '#ffd166', '#ffffff']
          });
        }

        // Show full letter card with smooth animation
        if (fullLetterCard) {
          fullLetterCard.classList.remove('hidden');
          gsap.fromTo(fullLetterCard, 
            { opacity: 0, y: 30, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }
          );

          // Scroll letter smoothly into view
          setTimeout(() => {
            fullLetterCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 300);
        }
      }
    });
  }

  // -----------------------------------------------------------------
  // 12. Finale & "Make a Wish" Birthday Cake Candle Blow
  // -----------------------------------------------------------------
  const cakeFlame = document.getElementById('cake-flame');
  const cakeSmoke = document.getElementById('cake-smoke');
  const blowCandleBtn = document.getElementById('blow-candle-btn');
  const wishModal = document.getElementById('wish-granted-modal');
  const closeWishModalBtn = document.getElementById('close-wish-modal-btn');
  const replayFireworksBtn = document.getElementById('replay-fireworks-btn');
  const relightCandleBtn = document.getElementById('relight-candle-btn');

  let isCandleLit = true;

  function blowCandle() {
    if (!isCandleLit) return;
    isCandleLit = false;

    // Extinguish flame & trigger smoke
    if (cakeFlame) cakeFlame.classList.add('extinguished');
    if (cakeSmoke) {
      cakeSmoke.classList.remove('rise');
      // trigger reflow
      void cakeSmoke.offsetWidth;
      cakeSmoke.classList.add('rise');
    }

    // Play synthesized sound chime
    playMagicalChime();

    // Trigger grand fireworks and heart storm
    window.Celebration.grandBirthdayFireworks();

    // Pop the secret wish granted modal after a brief dramatic pause
    setTimeout(() => {
      if (wishModal) wishModal.classList.add('active');
    }, 1400);
  }

  function relightCandle() {
    isCandleLit = true;
    if (cakeFlame) cakeFlame.classList.remove('extinguished');
    if (cakeSmoke) cakeSmoke.classList.remove('rise');
    if (wishModal) wishModal.classList.remove('active');
  }

  if (cakeFlame) cakeFlame.addEventListener('click', blowCandle);
  if (blowCandleBtn) blowCandleBtn.addEventListener('click', blowCandle);
  if (closeWishModalBtn) closeWishModalBtn.addEventListener('click', () => {
    if (wishModal) wishModal.classList.remove('active');
  });
  if (replayFireworksBtn) {
    replayFireworksBtn.addEventListener('click', () => {
      window.Celebration.grandBirthdayFireworks();
    });
  }
  if (relightCandleBtn) relightCandleBtn.addEventListener('click', relightCandle);

  // Nav confetti button
  const navConfettiBtn = document.getElementById('nav-confetti-btn');
  if (navConfettiBtn) {
    navConfettiBtn.addEventListener('click', () => {
      window.Celebration.giftUnwrapConfetti();
    });
  }
});
