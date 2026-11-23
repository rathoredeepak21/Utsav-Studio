import { ParticleConfig, TextMotionPreset, TextVideoElement } from '@/types/videoEditor';

/**
 * Deterministic pseudo-random hash from index
 */
function hash(i: number, seed: number = 1): number {
  const x = Math.sin(i * 997.13 + seed * 331.79) * 10000;
  return x - Math.floor(x);
}

/**
 * 1. Golden Dust (Glittering stardust / festive gold flakes)
 */
export function renderGoldenDust(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  t: number,
  config?: ParticleConfig
) {
  const count = config?.intensity === 'subtle' ? 25 : config?.intensity === 'rich' ? 65 : 42;
  const speed = config?.speed ?? 1.0;
  const color = config?.color || '#FCD34D';

  ctx.save();
  for (let i = 0; i < count; i++) {
    const x0 = hash(i, 1) * width;
    const y0 = hash(i, 2) * height;
    const vy = (18 + hash(i, 3) * 24) * speed;
    const vx = (hash(i, 4) - 0.5) * 22 * speed;
    const wobbleA = 12 + hash(i, 5) * 18;
    const wobbleSpeed = 1.2 + hash(i, 6) * 1.8;

    const curY = (y0 + t * vy) % height;
    const curX = (x0 + t * vx + Math.sin(t * wobbleSpeed + i) * wobbleA + width) % width;

    // Twinkle alpha
    const twinkle = 0.3 + 0.7 * Math.abs(Math.sin(t * 3.5 + i * 2.1));
    const size = 1.5 + hash(i, 7) * 2.5;

    ctx.globalAlpha = Math.max(0, Math.min(1, twinkle));
    ctx.fillStyle = color;

    // Draw diamond / star shape
    ctx.beginPath();
    ctx.moveTo(curX, curY - size * 1.4);
    ctx.lineTo(curX + size, curY);
    ctx.lineTo(curX, curY + size * 1.4);
    ctx.lineTo(curX - size, curY);
    ctx.closePath();
    ctx.fill();

    // Soft glow core for larger flakes
    if (size > 2.5) {
      ctx.globalAlpha = twinkle * 0.4;
      ctx.beginPath();
      ctx.arc(curX, curY, size * 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

/**
 * 2. Falling Rose Petals (Curved organic flower petals)
 */
export function renderFallingRosePetals(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  t: number,
  config?: ParticleConfig
) {
  const count = config?.intensity === 'subtle' ? 18 : config?.intensity === 'rich' ? 40 : 28;
  const speed = config?.speed ?? 1.0;

  ctx.save();
  for (let i = 0; i < count; i++) {
    const x0 = hash(i, 11) * width;
    const y0 = hash(i, 12) * height;
    const vy = (38 + hash(i, 13) * 32) * speed;
    const swayAmp = 35 + hash(i, 14) * 30;
    const swayFreq = 1.0 + hash(i, 15) * 1.2;

    const curY = (y0 + t * vy) % height;
    const curX = (x0 + Math.sin(t * swayFreq + i * 1.3) * swayAmp + width) % width;

    const rot = t * 1.1 + i * 0.7;
    const flip = Math.cos(t * 2.2 + i * 1.5);
    const scale = 0.7 + hash(i, 16) * 0.6;
    const petalW = 18 * scale;
    const petalH = 26 * scale * Math.abs(flip);

    if (petalH < 2) continue; // edge-on

    ctx.save();
    ctx.translate(curX, curY);
    ctx.rotate(rot);

    // Color gradient based on index (deep rose to velvet crimson)
    const isDark = i % 3 === 0;
    ctx.fillStyle = isDark ? '#E11D48' : i % 2 === 0 ? '#BE123C' : '#FB7185';
    ctx.globalAlpha = 0.85;

    // Draw organic petal shape
    ctx.beginPath();
    ctx.moveTo(0, -petalH * 0.6);
    ctx.bezierCurveTo(petalW * 0.9, -petalH * 0.4, petalW * 0.8, petalH * 0.5, 0, petalH * 0.6);
    ctx.bezierCurveTo(-petalW * 0.8, petalH * 0.5, -petalW * 0.9, -petalH * 0.4, 0, -petalH * 0.6);
    ctx.closePath();
    ctx.fill();

    // Subtle petal vein highlight
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -petalH * 0.4);
    ctx.lineTo(0, petalH * 0.4);
    ctx.stroke();

    ctx.restore();
  }
  ctx.restore();
}

/**
 * 3. Falling Marigold Petals (Festive Genda Phool for Haldi & Traditional events)
 */
export function renderFallingMarigoldPetals(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  t: number,
  config?: ParticleConfig
) {
  const count = config?.intensity === 'subtle' ? 20 : config?.intensity === 'rich' ? 45 : 32;
  const speed = config?.speed ?? 1.0;

  ctx.save();
  for (let i = 0; i < count; i++) {
    const x0 = hash(i, 21) * width;
    const y0 = hash(i, 22) * height;
    const vy = (42 + hash(i, 23) * 35) * speed;
    const swayAmp = 40 + hash(i, 24) * 25;
    const swayFreq = 1.3 + hash(i, 25) * 1.1;

    const curY = (y0 + t * vy) % height;
    const curX = (x0 + Math.sin(t * swayFreq + i * 1.5) * swayAmp + width) % width;

    const rot = t * 1.4 + i * 0.9;
    const flip = Math.sin(t * 2.5 + i * 1.2);
    const scale = 0.75 + hash(i, 26) * 0.5;
    const w = 14 * scale;
    const h = 24 * scale * Math.abs(flip);

    if (h < 2) continue;

    ctx.save();
    ctx.translate(curX, curY);
    ctx.rotate(rot);

    // Warm saffron & deep marigold orange
    ctx.fillStyle = i % 2 === 0 ? '#F59E0B' : '#EA580C';
    ctx.globalAlpha = 0.9;

    ctx.beginPath();
    ctx.moveTo(0, -h / 2);
    ctx.quadraticCurveTo(w, 0, 0, h / 2);
    ctx.quadraticCurveTo(-w, 0, 0, -h / 2);
    ctx.fill();

    // Petal tip bright yellow rim
    ctx.fillStyle = '#FDE047';
    ctx.beginPath();
    ctx.arc(0, h * 0.35, w * 0.35, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
  ctx.restore();
}

/**
 * 4. Sparkles & Soft Golden Bokeh Orbs
 */
export function renderSparklesBokeh(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  t: number,
  config?: ParticleConfig
) {
  const count = config?.intensity === 'subtle' ? 20 : config?.intensity === 'rich' ? 50 : 32;
  const speed = config?.speed ?? 0.8;

  ctx.save();
  for (let i = 0; i < count; i++) {
    const x0 = hash(i, 31) * width;
    const y0 = hash(i, 32) * height;
    const vy = (10 + hash(i, 33) * 15) * speed;

    const curY = (y0 - t * vy + height * 10) % height;
    const curX = (x0 + Math.sin(t * 0.8 + i) * 20 + width) % width;

    const isStar = i % 2 === 0;
    const radius = 6 + hash(i, 34) * 18;
    const pulse = 0.35 + 0.45 * Math.sin(t * 2.0 + i * 1.7);

    if (isStar) {
      // 4-pointed twinkle star
      ctx.save();
      ctx.translate(curX, curY);
      ctx.rotate(t * 0.4 + i);
      ctx.globalAlpha = pulse;
      ctx.fillStyle = '#FCD34D';

      const arm = 8 + hash(i, 35) * 12;
      ctx.beginPath();
      ctx.moveTo(0, -arm);
      ctx.quadraticCurveTo(0, 0, arm, 0);
      ctx.quadraticCurveTo(0, 0, 0, arm);
      ctx.quadraticCurveTo(0, 0, -arm, 0);
      ctx.quadraticCurveTo(0, 0, 0, -arm);
      ctx.fill();
      ctx.restore();
    } else {
      // Soft glowing bokeh orb
      const grad = ctx.createRadialGradient(curX, curY, 0, curX, curY, radius);
      grad.addColorStop(0, 'rgba(253, 224, 71, 0.45)');
      grad.addColorStop(0.5, 'rgba(245, 158, 11, 0.2)');
      grad.addColorStop(1, 'rgba(217, 119, 6, 0)');

      ctx.globalAlpha = pulse;
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(curX, curY, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

/**
 * 5. Floating Balloons (Playful celebration balloons for Birthdays & Kids events)
 */
export function renderFloatingBalloons(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  t: number,
  config?: ParticleConfig
) {
  const count = config?.intensity === 'subtle' ? 10 : config?.intensity === 'rich' ? 24 : 16;
  const speed = config?.speed ?? 1.0;
  const colors = ['#F43F5E', '#EC4899', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#FCD34D'];

  ctx.save();
  for (let i = 0; i < count; i++) {
    const x0 = hash(i, 41) * width;
    const y0 = hash(i, 42) * height;
    const vy = (35 + hash(i, 43) * 28) * speed;
    const curY = (y0 - t * vy + height * 10) % (height + 150) - 50;
    const sway = Math.sin(t * 1.5 + i * 2) * 25;
    const curX = (x0 + sway + width) % width;

    const balloonColor = colors[i % colors.length];
    const bW = 28 + hash(i, 44) * 16;
    const bH = bW * 1.25;

    ctx.save();
    ctx.translate(curX, curY);
    ctx.rotate(Math.sin(t * 1.2 + i) * 0.12);

    // String
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, bH / 2);
    ctx.bezierCurveTo(sway * 0.3, bH / 2 + 25, -sway * 0.3, bH / 2 + 50, 0, bH / 2 + 75);
    ctx.stroke();

    // Balloon body
    ctx.fillStyle = balloonColor;
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.ellipse(0, 0, bW / 2, bH / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Knot
    ctx.beginPath();
    ctx.moveTo(-4, bH / 2);
    ctx.lineTo(4, bH / 2);
    ctx.lineTo(0, bH / 2 + 5);
    ctx.closePath();
    ctx.fill();

    // Specular highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.beginPath();
    ctx.ellipse(-bW * 0.22, -bH * 0.22, bW * 0.12, bH * 0.18, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
  ctx.restore();
}

/**
 * 6. Glowing Diyas & Warm Radiant Sacred Fire (Pooja, Griha Pravesh, Vedic Vivah)
 */
export function renderGlowingDiyas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  t: number,
  config?: ParticleConfig
) {
  ctx.save();

  // Positions of ceremonial diyas (bottom border corners & center)
  const diyas = [
    { x: width * 0.12, y: height * 0.94, size: 40 },
    { x: width * 0.28, y: height * 0.96, size: 34 },
    { x: width * 0.5, y: height * 0.95, size: 48 },
    { x: width * 0.72, y: height * 0.96, size: 34 },
    { x: width * 0.88, y: height * 0.94, size: 40 },
  ];

  diyas.forEach((diya, i) => {
    const flicker = 1 + 0.12 * Math.sin(t * 16 + i * 4) + 0.08 * Math.cos(t * 27 + i * 2);
    const cx = diya.x;
    const cy = diya.y;
    const s = diya.size;

    // Ambient warm halo
    const haloGrad = ctx.createRadialGradient(cx, cy - s * 0.3, 0, cx, cy - s * 0.3, s * 2.8 * flicker);
    haloGrad.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
    haloGrad.addColorStop(0.4, 'rgba(245, 158, 11, 0.2)');
    haloGrad.addColorStop(1, 'rgba(180, 83, 9, 0)');

    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(cx, cy - s * 0.3, s * 2.8 * flicker, 0, Math.PI * 2);
    ctx.fill();

    // Clay Diya base (terracotta)
    ctx.fillStyle = '#831843';
    ctx.beginPath();
    ctx.ellipse(cx, cy, s * 0.65, s * 0.24, 0, 0, Math.PI);
    ctx.fill();

    ctx.fillStyle = '#B45309';
    ctx.beginPath();
    ctx.ellipse(cx, cy - 2, s * 0.6, s * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Golden ghee oil pool
    ctx.fillStyle = '#FBBF24';
    ctx.beginPath();
    ctx.ellipse(cx, cy - 2, s * 0.4, s * 0.09, 0, 0, Math.PI * 2);
    ctx.fill();

    // Flickering Flame
    const flameH = s * 0.8 * flicker;
    const flameW = s * 0.32 * (0.9 + 0.2 * Math.sin(t * 22 + i));

    const flameGrad = ctx.createLinearGradient(cx, cy, cx, cy - flameH);
    flameGrad.addColorStop(0, '#EF4444');
    flameGrad.addColorStop(0.4, '#F59E0B');
    flameGrad.addColorStop(0.85, '#FEF08A');
    flameGrad.addColorStop(1, '#FFFFFF');

    ctx.fillStyle = flameGrad;
    ctx.beginPath();
    ctx.moveTo(cx - flameW, cy - 3);
    ctx.quadraticCurveTo(cx - flameW * 1.3, cy - flameH * 0.5, cx, cy - flameH);
    ctx.quadraticCurveTo(cx + flameW * 1.3, cy - flameH * 0.5, cx + flameW, cy - 3);
    ctx.closePath();
    ctx.fill();
  });

  ctx.restore();
}

/**
 * 7. Rotating Sacred Mandala (Slow ceremonial spin & golden pulse)
 */
export function renderRotatingMandala(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  t: number,
  config?: ParticleConfig
) {
  ctx.save();
  const cx = width / 2;
  const cy = height * 0.42;
  const radius = Math.min(width, height) * 0.38;
  const angle = t * 0.08; // slow regal spin
  const pulse = 0.12 + 0.05 * Math.sin(t * 1.5);

  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.globalAlpha = pulse;
  ctx.strokeStyle = '#FCD34D';
  ctx.lineWidth = 1.5;

  const petals = 16;
  for (let i = 0; i < petals; i++) {
    ctx.rotate((Math.PI * 2) / petals);

    // Inner petal
    ctx.beginPath();
    ctx.ellipse(0, radius * 0.45, radius * 0.12, radius * 0.28, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Outer ring arch
    ctx.beginPath();
    ctx.arc(0, radius * 0.8, radius * 0.15, 0, Math.PI);
    ctx.stroke();
  }

  // Concentric decorative rings
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.65, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.95, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

/**
 * 8. Party Confetti (Vibrant metallic fluttering ribbons for Sangeet & Celebrations)
 */
export function renderPartyConfetti(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  t: number,
  config?: ParticleConfig
) {
  const count = config?.intensity === 'subtle' ? 25 : config?.intensity === 'rich' ? 70 : 45;
  const speed = config?.speed ?? 1.1;
  const palette = ['#F59E0B', '#EC4899', '#8B5CF6', '#3B82F6', '#10B981', '#E11D48', '#FCD34D'];

  ctx.save();
  for (let i = 0; i < count; i++) {
    const x0 = hash(i, 51) * width;
    const y0 = hash(i, 52) * height;
    const vy = (50 + hash(i, 53) * 45) * speed;
    const vx = (hash(i, 54) - 0.5) * 40 * speed;

    const curY = (y0 + t * vy) % height;
    const curX = (x0 + t * vx + Math.sin(t * 2.0 + i) * 30 + width) % width;

    const color = palette[i % palette.length];
    const rot = t * 3.0 + i * 1.5;
    const flip = Math.cos(t * 4.0 + i);

    const cW = 10 + hash(i, 55) * 8;
    const cH = (6 + hash(i, 56) * 6) * Math.abs(flip);

    if (cH < 1) continue;

    ctx.save();
    ctx.translate(curX, curY);
    ctx.rotate(rot);
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.9;
    ctx.fillRect(-cW / 2, -cH / 2, cW, cH);
    ctx.restore();
  }
  ctx.restore();
}

/**
 * 9. Floating Glowing Hearts (Romantic Engagement & Anniversary)
 */
export function renderFloatingHearts(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  t: number,
  config?: ParticleConfig
) {
  const count = config?.intensity === 'subtle' ? 12 : config?.intensity === 'rich' ? 30 : 20;
  const speed = config?.speed ?? 0.8;

  ctx.save();
  for (let i = 0; i < count; i++) {
    const x0 = hash(i, 61) * width;
    const y0 = hash(i, 62) * height;
    const vy = (25 + hash(i, 63) * 25) * speed;

    const curY = (y0 - t * vy + height * 10) % height;
    const curX = (x0 + Math.sin(t * 1.2 + i * 1.7) * 25 + width) % width;

    const scale = 0.6 + hash(i, 64) * 0.7;
    const hSize = 22 * scale;
    const pulse = 0.4 + 0.45 * Math.sin(t * 2.2 + i);

    ctx.save();
    ctx.translate(curX, curY);
    ctx.globalAlpha = pulse;

    // Golden or Rose Heart
    ctx.fillStyle = i % 2 === 0 ? '#FB7185' : '#FCD34D';

    ctx.beginPath();
    ctx.moveTo(0, hSize * 0.35);
    ctx.bezierCurveTo(0, 0, -hSize * 0.6, -hSize * 0.2, -hSize * 0.6, hSize * 0.35);
    ctx.bezierCurveTo(-hSize * 0.6, hSize * 0.7, 0, hSize * 0.95, 0, hSize * 1.2);
    ctx.bezierCurveTo(0, hSize * 0.95, hSize * 0.6, hSize * 0.7, hSize * 0.6, hSize * 0.35);
    ctx.bezierCurveTo(hSize * 0.6, -hSize * 0.2, 0, 0, 0, hSize * 0.35);
    ctx.fill();

    ctx.restore();
  }
  ctx.restore();
}

/**
 * 10. Fireflies (Magical evening fairy lights)
 */
export function renderFireflies(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  t: number,
  config?: ParticleConfig
) {
  const count = config?.intensity === 'subtle' ? 15 : config?.intensity === 'rich' ? 38 : 24;

  ctx.save();
  for (let i = 0; i < count; i++) {
    const x0 = hash(i, 71) * width;
    const y0 = hash(i, 72) * height;

    const curX = (x0 + Math.sin(t * 0.7 + i * 1.3) * 45 + Math.cos(t * 0.3 + i) * 20 + width) % width;
    const curY = (y0 + Math.cos(t * 0.8 + i * 1.7) * 35 + Math.sin(t * 0.4 + i) * 15 + height) % height;

    const pulse = Math.pow(Math.sin(t * 2.5 + i * 2.1), 4);
    if (pulse < 0.05) continue;

    const r = 2.5 + hash(i, 73) * 2.5;

    // Glowing aura
    const glow = ctx.createRadialGradient(curX, curY, 0, curX, curY, r * 4);
    glow.addColorStop(0, 'rgba(217, 249, 157, 0.9)');
    glow.addColorStop(0.4, 'rgba(163, 230, 53, 0.4)');
    glow.addColorStop(1, 'rgba(101, 163, 13, 0)');

    ctx.globalAlpha = pulse;
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(curX, curY, r * 4, 0, Math.PI * 2);
    ctx.fill();

    // Hot center
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(curX, curY, r * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/**
 * Master dispatcher for particle effects
 */
export function renderSceneParticles(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  t: number,
  config?: ParticleConfig
) {
  if (!config || config.type === 'none') return;

  switch (config.type) {
    case 'golden_dust':
      renderGoldenDust(ctx, width, height, t, config);
      break;
    case 'falling_rose_petals':
      renderFallingRosePetals(ctx, width, height, t, config);
      break;
    case 'falling_marigold_petals':
      renderFallingMarigoldPetals(ctx, width, height, t, config);
      break;
    case 'sparkles_bokeh':
      renderSparklesBokeh(ctx, width, height, t, config);
      break;
    case 'floating_balloons':
      renderFloatingBalloons(ctx, width, height, t, config);
      break;
    case 'glowing_diyas':
      renderGlowingDiyas(ctx, width, height, t, config);
      break;
    case 'rotating_mandala':
      renderRotatingMandala(ctx, width, height, t, config);
      break;
    case 'party_confetti':
      renderPartyConfetti(ctx, width, height, t, config);
      break;
    case 'floating_hearts':
      renderFloatingHearts(ctx, width, height, t, config);
      break;
    case 'fireflies':
      renderFireflies(ctx, width, height, t, config);
      break;
  }
}

/**
 * Text FX: Golden Shimmer gradient effect
 */
export function createGoldenShimmerFill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  t: number
): CanvasGradient {
  const shimmerPos = (t * 0.75) % 1.5 - 0.25;
  const startX = x + width * (shimmerPos - 0.25);
  const endX = x + width * (shimmerPos + 0.25);

  const grad = ctx.createLinearGradient(startX, y, endX, y);
  grad.addColorStop(0, '#D4AF37');
  grad.addColorStop(0.5, '#FFF8DC');
  grad.addColorStop(1, '#D4AF37');
  return grad;
}
