/**
 * ===================================================================
 * 💖 PARTICLES & INTERACTIVE VISUAL EFFECTS ENGINE
 * ===================================================================
 * Lightweight HTML5 Canvas system for floating hearts, bokeh sparkles,
 * and spectacular confetti/fireworks celebration bursts.
 * ===================================================================
 */

class RomanticParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.sparkles = [];
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.isRunning = false;
    this.animationFrameId = null;

    // Romantic palette
    this.colors = [
      'rgba(255, 51, 102, ',   // Neon Rose
      'rgba(255, 117, 140, ',  // Soft Pastel Pink
      'rgba(255, 182, 193, ',  // Light Pink
      'rgba(255, 209, 102, ',  // Warm Gold
      'rgba(209, 107, 255, ',  // Lavender Purple
      'rgba(255, 75, 145, '    // Deep Fuchsia
    ];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Generate initial set of particles
    const heartCount = window.innerWidth < 768 ? 22 : 45;
    const sparkleCount = window.innerWidth < 768 ? 25 : 50;

    for (let i = 0; i < heartCount; i++) {
      this.particles.push(this.createHeart(true));
    }

    for (let i = 0; i < sparkleCount; i++) {
      this.sparkles.push(this.createSparkle(true));
    }

    // Visibility change handler to save battery
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stop();
      } else {
        this.start();
      }
    });

    // Interactive screen tap: spawn micro hearts on click/touch
    window.addEventListener('pointerdown', (e) => {
      // Don't spawn if tapping on buttons or inputs
      if (e.target.closest('button, a, input, .no-sparkle')) return;
      this.spawnTapBurst(e.clientX, e.clientY, 4);
    });
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(this.dpr, this.dpr);
  }

  createHeart(initial = false) {
    const size = Math.random() * 16 + 10; // 10px to 26px
    const colorBase = this.colors[Math.floor(Math.random() * this.colors.length)];
    return {
      x: Math.random() * this.width,
      y: initial ? Math.random() * this.height : this.height + size + 20,
      size: size,
      speedY: Math.random() * 1.2 + 0.6,
      speedX: 0,
      angle: Math.random() * Math.PI * 2,
      angularSpeed: (Math.random() - 0.5) * 0.03,
      swayMagnitude: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.55 + 0.25,
      color: colorBase,
      rotation: (Math.random() - 0.5) * 0.4
    };
  }

  createSparkle(initial = false) {
    return {
      x: Math.random() * this.width,
      y: initial ? Math.random() * this.height : this.height + 10,
      radius: Math.random() * 2.5 + 0.8,
      speedY: Math.random() * 0.8 + 0.3,
      opacity: Math.random() * 0.7 + 0.2,
      pulseSpeed: Math.random() * 0.04 + 0.02,
      pulseVal: Math.random() * Math.PI,
      color: Math.random() > 0.4 ? 'rgba(255, 235, 180, ' : 'rgba(255, 200, 220, '
    };
  }

  spawnTapBurst(x, y, count = 5) {
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 14 + 10;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1.5;
      const colorBase = this.colors[Math.floor(Math.random() * this.colors.length)];

      this.particles.push({
        x: x,
        y: y,
        size: size,
        speedY: -Math.abs(Math.sin(angle) * speed) - 1,
        speedX: Math.cos(angle) * speed,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.08,
        swayMagnitude: 0.8,
        opacity: 0.9,
        color: colorBase,
        rotation: (Math.random() - 0.5) * 0.8,
        isBurst: true
      });
    }
  }

  drawHeart(x, y, size, rotation, color, opacity) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.beginPath();

    const topCurveHeight = size * 0.3;
    ctx.moveTo(0, topCurveHeight);
    
    // Top left curve
    ctx.bezierCurveTo(
      -size / 2, -size / 2,
      -size, topCurveHeight / 3,
      0, size
    );

    // Top right curve
    ctx.bezierCurveTo(
      size, topCurveHeight / 3,
      size / 2, -size / 2,
      0, topCurveHeight
    );

    ctx.closePath();
    ctx.fillStyle = `${color}${opacity})`;
    ctx.shadowColor = `${color}0.6)`;
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.restore();
  }

  drawSparkle(x, y, radius, opacity, color) {
    const ctx = this.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `${color}${opacity})`;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();
  }

  update() {
    // 1. Update & Draw Sparkles
    for (let i = 0; i < this.sparkles.length; i++) {
      const s = this.sparkles[i];
      s.y -= s.speedY;
      s.pulseVal += s.pulseSpeed;
      const currentOpacity = s.opacity * (0.6 + 0.4 * Math.sin(s.pulseVal));

      if (s.y < -10) {
        this.sparkles[i] = this.createSparkle(false);
      } else {
        this.drawSparkle(s.x, s.y, s.radius, Math.max(0, currentOpacity), s.color);
      }
    }

    // 2. Update & Draw Hearts
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      p.angle += p.angularSpeed;
      p.x += Math.sin(p.angle) * p.swayMagnitude + (p.speedX || 0);
      p.y -= p.speedY;

      if (p.isBurst) {
        p.speedX *= 0.94;
        p.opacity -= 0.015;
        if (p.opacity <= 0) {
          this.particles.splice(i, 1);
          continue;
        }
      }

      if (p.y < -p.size - 20) {
        if (p.isBurst) {
          this.particles.splice(i, 1);
        } else {
          this.particles[i] = this.createHeart(false);
        }
      } else {
        this.drawHeart(p.x, p.y, p.size, p.rotation + Math.sin(p.angle) * 0.1, p.color, Math.max(0, p.opacity));
      }
    }
  }

  animate() {
    if (!this.isRunning) return;
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.update();
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}

/**
 * Confetti & Celebration Helpers powered by canvas-confetti
 */
window.Celebration = {
  // Initial heart burst when gift is opened
  giftUnwrapConfetti() {
    if (typeof confetti !== 'function') return;

    const count = 200;
    const defaults = {
      origin: { y: 0.65 },
      zIndex: 99999
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    // Layered blast
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#ff3366', '#ff758c', '#ffd166']
    });
    fire(0.2, {
      spread: 60,
      colors: ['#ffffff', '#ff4b91', '#b388ff']
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 1.2,
      colors: ['#ff3366', '#ff0055', '#ffe66d']
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      colors: ['#ffd166', '#ffffff']
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
      colors: ['#ff758c', '#e63946']
    });

    // Heart shapes if supported
    try {
      const heartShape = confetti.shapeFromPath({
        path: 'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z'
      });
      confetti({
        shapes: [heartShape],
        scalar: 2.2,
        particleCount: 30,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ff3366', '#ff4b91', '#ff758c'],
        zIndex: 99999
      });
    } catch (e) {
      // Fallback gracefully
    }
  },

  // Grand Birthday Cake Candle Blow Fireworks & Heart Storm
  grandBirthdayFireworks() {
    if (typeof confetti !== 'function') return;

    const duration = 6 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 35, spread: 360, ticks: 70, zIndex: 99999 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 60 * (timeLeft / duration);

      // Left blast
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.35), y: Math.random() - 0.2 },
        colors: ['#ff3366', '#ffd166', '#ff758c', '#ffffff', '#b388ff']
      });

      // Right blast
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.65, 0.9), y: Math.random() - 0.2 },
        colors: ['#ff4b91', '#ffd166', '#e63946', '#ffffff', '#70d6ff']
      });

      // Center heart burst
      confetti({
        ...defaults,
        particleCount: 25,
        origin: { x: 0.5, y: 0.4 },
        colors: ['#ff3366', '#ffffff', '#ffd166']
      });
    }, 280);
  }
};
