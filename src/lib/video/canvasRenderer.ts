import { VideoProject, VideoScene, VideoElement, TextVideoElement, StickerVideoElement, ShapeVideoElement, ImageVideoElement } from '@/types/videoEditor';
import { computeElementState } from './animationMath';
import { renderSceneParticles, createGoldenShimmerFill } from './motionGraphics';

// Offscreen buffer canvases for scene transition compositing
let offscreenCanvasA: HTMLCanvasElement | null = null;
let offscreenCanvasB: HTMLCanvasElement | null = null;

function getOffscreenBuffers(width: number, height: number): [HTMLCanvasElement, HTMLCanvasElement] {
  if (typeof document === 'undefined') {
    // SSR guard
    return [null as unknown as HTMLCanvasElement, null as unknown as HTMLCanvasElement];
  }
  if (!offscreenCanvasA) {
    offscreenCanvasA = document.createElement('canvas');
  }
  if (!offscreenCanvasB) {
    offscreenCanvasB = document.createElement('canvas');
  }
  if (offscreenCanvasA.width !== width || offscreenCanvasA.height !== height) {
    offscreenCanvasA.width = width;
    offscreenCanvasA.height = height;
  }
  if (offscreenCanvasB.width !== width || offscreenCanvasB.height !== height) {
    offscreenCanvasB.width = width;
    offscreenCanvasB.height = height;
  }
  return [offscreenCanvasA, offscreenCanvasB];
}

// Global Image Cache to prevent re-instantiating SVG / data URIs each frame
const globalImageCache = new Map<string, HTMLImageElement>();

export function getCachedImage(src: string): HTMLImageElement | null {
  if (typeof window === 'undefined' || !src) return null;
  let img = globalImageCache.get(src);
  if (!img) {
    img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    globalImageCache.set(src, img);
  }
  return img.complete && img.naturalWidth > 0 ? img : null;
}

export function preloadProjectImages(project: VideoProject): Promise<void[]> {
  if (typeof window === 'undefined') return Promise.resolve([]);
  const promises: Promise<void>[] = [];

  project.scenes.forEach((scene) => {
    scene.elements.forEach((el) => {
      let src: string | undefined;
      if (el.type === 'sticker') {
        src = (el as StickerVideoElement).svgDataUri;
      } else if (el.type === 'image') {
        src = (el as ImageVideoElement).src;
      }

      if (src && !globalImageCache.has(src)) {
        const p = new Promise<void>((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = src;
          globalImageCache.set(src, img);
        });
        promises.push(p);
      }
    });
  });

  return Promise.all(promises);
}

/**
 * Draw background on a canvas context
 */
function drawSceneBackground(
  ctx: CanvasRenderingContext2D,
  bg: VideoScene['background'],
  width: number,
  height: number
) {
  ctx.save();

  if (bg.type === 'gradient' && bg.gradient) {
    let grad: CanvasGradient;
    if (bg.gradient.type === 'radial') {
      const cx = width / 2;
      const cy = height / 2;
      grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, Math.max(width, height) * 0.75);
    } else {
      const angle = (bg.gradient.angle || 180) * (Math.PI / 180);
      const x1 = width / 2 - (Math.sin(angle) * width) / 2;
      const y1 = height / 2 - (Math.cos(angle) * height) / 2;
      const x2 = width / 2 + (Math.sin(angle) * width) / 2;
      const y2 = height / 2 + (Math.cos(angle) * height) / 2;
      grad = ctx.createLinearGradient(x1, y1, x2, y2);
    }

    grad.addColorStop(0, bg.gradient.from);
    if (bg.gradient.via) grad.addColorStop(0.5, bg.gradient.via);
    grad.addColorStop(1, bg.gradient.to);
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = bg.color || '#240322';
  }

  ctx.fillRect(0, 0, width, height);

  // Subtle celebratory pattern
  if (bg.pattern === 'mandala' || bg.pattern === 'dots') {
    ctx.save();
    ctx.globalAlpha = bg.patternOpacity ?? 0.08;
    ctx.strokeStyle = '#D4AF37';
    ctx.fillStyle = '#D4AF37';
    ctx.lineWidth = 1;

    // Draw ornate pattern dots & circles
    const step = 80;
    for (let x = 40; x < width; x += step) {
      for (let y = 40; y < height; y += step) {
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();

        if ((x + y) % (step * 2) === 0) {
          ctx.beginPath();
          ctx.arc(x, y, 16, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }
    ctx.restore();
  }

  ctx.restore();
}

/**
 * Draw Text element with wrapping and typewriter slicing
 */
function drawTextElement(
  ctx: CanvasRenderingContext2D,
  el: TextVideoElement,
  visibleChars?: number,
  sceneElapsed?: number
) {
  let displayString = el.text;
  if (visibleChars !== undefined && visibleChars < el.text.length) {
    displayString = el.text.slice(0, visibleChars);
  }
  if (!displayString) return;

  ctx.font = `${el.fontStyle || 'normal'} ${el.fontSize}px "${el.fontFamily || 'Noto Sans Devanagari'}", sans-serif`;

  if (el.motionPreset === 'golden_shimmer' && sceneElapsed !== undefined) {
    ctx.fillStyle = createGoldenShimmerFill(ctx, 0, 0, el.width, sceneElapsed);
  } else {
    ctx.fillStyle = el.fill || '#FFFFFF';
  }

  if (el.motionPreset === 'royal_glow') {
    ctx.shadowColor = '#FBBF24';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  } else if (el.textShadow) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 3;
  }

  ctx.textAlign = el.align || 'center';
  ctx.textBaseline = 'top';

  // Word wrap within element.width
  const words = displayString.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > el.width && i > 0) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);

  const lineHeight = (el.fontSize || 32) * (el.lineHeight || 1.3);
  let textX = 0;
  if (el.align === 'center') textX = el.width / 2;
  else if (el.align === 'right') textX = el.width;

  lines.forEach((line, idx) => {
    ctx.fillText(line, textX, idx * lineHeight);
  });
}

/**
 * Draw Shape element
 */
function drawShapeElement(ctx: CanvasRenderingContext2D, el: ShapeVideoElement) {
  ctx.fillStyle = el.fill || '#D4AF37';
  if (el.stroke) {
    ctx.strokeStyle = el.stroke;
    ctx.lineWidth = el.strokeWidth || 2;
  }

  ctx.beginPath();
  switch (el.shapeType) {
    case 'rect': {
      const r = el.cornerRadius || 0;
      if (r > 0) {
        ctx.roundRect(0, 0, el.width, el.height, r);
      } else {
        ctx.rect(0, 0, el.width, el.height);
      }
      break;
    }
    case 'circle': {
      const rx = el.width / 2;
      const ry = el.height / 2;
      ctx.ellipse(rx, ry, rx, ry, 0, 0, Math.PI * 2);
      break;
    }
    case 'line': {
      ctx.moveTo(0, el.height / 2);
      ctx.lineTo(el.width, el.height / 2);
      ctx.stroke();
      return;
    }
    case 'star': {
      const cx = el.width / 2;
      const cy = el.height / 2;
      const spikes = 5;
      const outerR = Math.min(cx, cy);
      const innerR = outerR * 0.45;
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.moveTo(cx, cy - outerR);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerR;
        y = cy + Math.sin(rot) * outerR;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerR;
        y = cy + Math.sin(rot) * innerR;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerR);
      ctx.closePath();
      break;
    }
    case 'heart': {
      const w = el.width;
      const h = el.height;
      ctx.moveTo(w / 2, h * 0.8);
      ctx.bezierCurveTo(w / 2, h * 0.7, 0, h * 0.45, 0, h * 0.25);
      ctx.bezierCurveTo(0, 0, w * 0.45, 0, w / 2, h * 0.25);
      ctx.bezierCurveTo(w * 0.55, 0, w, 0, w, h * 0.25);
      ctx.bezierCurveTo(w, h * 0.45, w / 2, h * 0.7, w / 2, h * 0.8);
      ctx.closePath();
      break;
    }
  }

  ctx.fill();
  if (el.stroke) ctx.stroke();
}

/**
 * Draw an entire scene onto a target 2D context
 */
function renderSingleScene(
  ctx: CanvasRenderingContext2D,
  scene: VideoScene,
  sceneElapsed: number,
  width: number,
  height: number
) {
  // 1. Draw Background
  drawSceneBackground(ctx, scene.background, width, height);

  // 1.5. Render Background Continuous Particles
  if (scene.particles && scene.particles.type !== 'none') {
    renderSceneParticles(ctx, width, height, sceneElapsed, scene.particles);
  }

  // 2. Sort and draw elements
  const sorted = [...scene.elements].sort((a, b) => a.zIndex - b.zIndex);

  sorted.forEach((el) => {
    const computed = computeElementState(el, sceneElapsed);
    if (!computed.isVisible || computed.opacity <= 0.001) return;

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, computed.opacity));

    // Transform anchor around element center
    const cx = computed.x + el.width / 2;
    const cy = computed.y + el.height / 2;
    ctx.translate(cx, cy);

    if (computed.rotation) {
      ctx.rotate((computed.rotation * Math.PI) / 180);
    }
    if (computed.scale !== 1) {
      ctx.scale(computed.scale, computed.scale);
    }

    // Offset back to top-left of element
    ctx.translate(-el.width / 2, -el.height / 2);

    if (el.type === 'text') {
      drawTextElement(ctx, el as TextVideoElement, computed.visibleTextLength, sceneElapsed);
    } else if (el.type === 'sticker') {
      const sticker = el as StickerVideoElement;
      const img = getCachedImage(sticker.svgDataUri);
      if (img) {
        ctx.drawImage(img, 0, 0, el.width, el.height);
      }
    } else if (el.type === 'image') {
      const imgEl = el as ImageVideoElement;
      const img = getCachedImage(imgEl.src);
      if (img) {
        if (imgEl.borderRadius && imgEl.borderRadius > 0) {
          ctx.beginPath();
          ctx.roundRect(0, 0, el.width, el.height, imgEl.borderRadius);
          ctx.clip();
        }
        ctx.drawImage(img, 0, 0, el.width, el.height);

        if (imgEl.borderWidth && imgEl.borderColor) {
          ctx.strokeStyle = imgEl.borderColor;
          ctx.lineWidth = imgEl.borderWidth;
          ctx.stroke();
        }
      }
    } else if (el.type === 'shape') {
      drawShapeElement(ctx, el as ShapeVideoElement);
    }

    ctx.restore();
  });

  // 3. Foreground floating particles for depth (petals, confetti, sparkles)
  if (
    scene.particles &&
    (scene.particles.type === 'falling_rose_petals' ||
      scene.particles.type === 'falling_marigold_petals' ||
      scene.particles.type === 'party_confetti' ||
      scene.particles.type === 'floating_balloons')
  ) {
    ctx.save();
    // Render lighter foreground overlay pass with slight speed offset
    renderSceneParticles(ctx, width, height, sceneElapsed + 1.5, {
      ...scene.particles,
      intensity: 'subtle',
    });
    ctx.restore();
  }
}

/**
 * Deterministic frame renderer for the entire Video Project.
 * Handles timeline calculation, scene sequencing, and transitions.
 */
export function renderVideoFrame(
  targetCtx: CanvasRenderingContext2D,
  project: VideoProject,
  currentTime: number,
  options: { width: number; height: number }
) {
  const { width, height } = options;
  const scenes = project.scenes;
  if (!scenes || scenes.length === 0) {
    targetCtx.fillStyle = '#100110';
    targetCtx.fillRect(0, 0, width, height);
    return;
  }

  // Calculate timeline offsets
  const startTimes: number[] = [];
  let accumTime = 0;
  for (let i = 0; i < scenes.length; i++) {
    startTimes.push(accumTime);
    accumTime += scenes[i].duration;
  }
  const totalDuration = accumTime;

  // Clamp current time
  const t = Math.max(0, Math.min(totalDuration, currentTime));

  // Determine current active scene
  let sceneIdx = 0;
  for (let i = 0; i < scenes.length; i++) {
    const sStart = startTimes[i];
    const sEnd = sStart + scenes[i].duration;
    if (t >= sStart && (t < sEnd || i === scenes.length - 1)) {
      sceneIdx = i;
      break;
    }
  }

  const currentScene = scenes[sceneIdx];
  const sceneElapsed = t - startTimes[sceneIdx];
  const transConfig = currentScene.transition || { type: 'crossfade', duration: 0.6 };
  const transDuration = Math.max(0.2, transConfig.duration || 0.6);

  // Check if we are inside a transition from sceneIdx - 1
  const isInTransition = sceneIdx > 0 && sceneElapsed < transDuration && transConfig.type !== 'none';

  if (!isInTransition) {
    // Render current scene directly
    targetCtx.clearRect(0, 0, width, height);
    renderSingleScene(targetCtx, currentScene, sceneElapsed, width, height);
    return;
  }

  // Render transition between prevScene and currentScene using offscreen buffers
  const prevScene = scenes[sceneIdx - 1];
  const prevSceneFinalElapsed = prevScene.duration;
  const progress = Math.max(0, Math.min(1, sceneElapsed / transDuration));

  const [bufA, bufB] = getOffscreenBuffers(width, height);
  const ctxA = bufA.getContext('2d');
  const ctxB = bufB.getContext('2d');

  if (!ctxA || !ctxB) {
    renderSingleScene(targetCtx, currentScene, sceneElapsed, width, height);
    return;
  }

  ctxA.clearRect(0, 0, width, height);
  renderSingleScene(ctxA, prevScene, prevSceneFinalElapsed, width, height);

  ctxB.clearRect(0, 0, width, height);
  renderSingleScene(ctxB, currentScene, sceneElapsed, width, height);

  targetCtx.clearRect(0, 0, width, height);

  switch (transConfig.type) {
    case 'crossfade': {
      targetCtx.save();
      targetCtx.globalAlpha = 1 - progress;
      targetCtx.drawImage(bufA, 0, 0);
      targetCtx.globalAlpha = progress;
      targetCtx.drawImage(bufB, 0, 0);
      targetCtx.restore();
      break;
    }

    case 'fade-to-black': {
      targetCtx.save();
      targetCtx.fillStyle = '#000000';
      targetCtx.fillRect(0, 0, width, height);

      if (progress < 0.5) {
        targetCtx.globalAlpha = 1 - progress * 2;
        targetCtx.drawImage(bufA, 0, 0);
      } else {
        targetCtx.globalAlpha = (progress - 0.5) * 2;
        targetCtx.drawImage(bufB, 0, 0);
      }
      targetCtx.restore();
      break;
    }

    case 'slide-left': {
      targetCtx.save();
      targetCtx.drawImage(bufA, -progress * width, 0);
      targetCtx.drawImage(bufB, (1 - progress) * width, 0);
      targetCtx.restore();
      break;
    }

    case 'slide-right': {
      targetCtx.save();
      targetCtx.drawImage(bufA, progress * width, 0);
      targetCtx.drawImage(bufB, -(1 - progress) * width, 0);
      targetCtx.restore();
      break;
    }

    case 'zoom-in': {
      targetCtx.save();
      targetCtx.globalAlpha = 1 - progress;
      targetCtx.drawImage(bufA, 0, 0);

      targetCtx.globalAlpha = progress;
      const zoomScale = 1.25 - 0.25 * progress;
      const cx = width / 2;
      const cy = height / 2;
      targetCtx.translate(cx, cy);
      targetCtx.scale(zoomScale, zoomScale);
      targetCtx.translate(-cx, -cy);
      targetCtx.drawImage(bufB, 0, 0);
      targetCtx.restore();
      break;
    }

    default: {
      targetCtx.drawImage(bufB, 0, 0);
      break;
    }
  }
}
