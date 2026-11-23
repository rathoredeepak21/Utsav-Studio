import {
  AnimationEasing,
  AnimationType,
  ElementAnimationConfig,
  VideoElement,
} from '@/types/videoEditor';

/**
 * Deterministic easing calculations
 */
export function applyEasing(t: number, easing: AnimationEasing): number {
  const clamped = Math.max(0, Math.min(1, t));

  switch (easing) {
    case 'linear':
      return clamped;
    case 'ease-in':
      return clamped * clamped;
    case 'ease-out':
      return clamped * (2 - clamped);
    case 'ease-in-out':
      return clamped < 0.5
        ? 2 * clamped * clamped
        : -1 + (4 - 2 * clamped) * clamped;
    case 'bounce': {
      let n = clamped;
      if (n < 1 / 2.75) {
        return 7.5625 * n * n;
      } else if (n < 2 / 2.75) {
        n -= 1.5 / 2.75;
        return 7.5625 * n * n + 0.75;
      } else if (n < 2.5 / 2.75) {
        n -= 2.25 / 2.75;
        return 7.5625 * n * n + 0.9375;
      } else {
        n -= 2.625 / 2.75;
        return 7.5625 * n * n + 0.984375;
      }
    }
    default:
      return clamped;
  }
}

export interface ComputedElementState {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  visibleTextLength?: number;
  isVisible: boolean;
}

/**
 * Computes deterministic animated state of an element at a given scene elapsed time.
 */
export function computeElementState(
  element: VideoElement,
  sceneTime: number
): ComputedElementState {
  const anim = element.animation || {
    type: 'none',
    startTime: 0,
    duration: 0.8,
    easing: 'ease-out',
  };

  const baseOpacity = element.opacity ?? 1;
  const baseRotation = element.rotation || 0;
  const baseX = element.x;
  const baseY = element.y;

  if (element.isVisible === false) {
    return {
      x: baseX,
      y: baseY,
      scale: 1,
      rotation: baseRotation,
      opacity: 0,
      isVisible: false,
    };
  }

  if (anim.type === 'none') {
    return {
      x: baseX,
      y: baseY,
      scale: 1,
      rotation: baseRotation,
      opacity: baseOpacity,
      isVisible: true,
    };
  }

  const startTime = anim.startTime ?? 0;
  const duration = Math.max(0.1, anim.duration || 0.8);
  const elapsed = sceneTime - startTime;

  // Before animation starts
  if (elapsed <= 0) {
    if (anim.type === 'fade-out') {
      return {
        x: baseX,
        y: baseY,
        scale: 1,
        rotation: baseRotation,
        opacity: baseOpacity,
        isVisible: true,
      };
    }
    return {
      x: baseX,
      y: baseY,
      scale: 1,
      rotation: baseRotation,
      opacity: 0,
      visibleTextLength: 0,
      isVisible: false,
    };
  }

  // Animation in progress
  const rawProgress = Math.min(1, elapsed / duration);
  const progress = applyEasing(rawProgress, anim.easing);

  switch (anim.type) {
    case 'fade-in':
      return {
        x: baseX,
        y: baseY,
        scale: 1,
        rotation: baseRotation,
        opacity: baseOpacity * progress,
        isVisible: true,
      };

    case 'fade-out':
      return {
        x: baseX,
        y: baseY,
        scale: 1,
        rotation: baseRotation,
        opacity: baseOpacity * (1 - progress),
        isVisible: progress < 1,
      };

    case 'slide-left': {
      // Slides in from the right (+250px) to natural baseX
      const offset = (1 - progress) * 250;
      return {
        x: baseX + offset,
        y: baseY,
        scale: 1,
        rotation: baseRotation,
        opacity: baseOpacity * progress,
        isVisible: true,
      };
    }

    case 'slide-right': {
      // Slides in from the left (-250px) to natural baseX
      const offset = (1 - progress) * -250;
      return {
        x: baseX + offset,
        y: baseY,
        scale: 1,
        rotation: baseRotation,
        opacity: baseOpacity * progress,
        isVisible: true,
      };
    }

    case 'slide-up': {
      // Slides up from below (+180px) to natural baseY
      const offset = (1 - progress) * 180;
      return {
        x: baseX,
        y: baseY + offset,
        scale: 1,
        rotation: baseRotation,
        opacity: baseOpacity * progress,
        isVisible: true,
      };
    }

    case 'zoom-in': {
      // Scales from 0.3 to 1.0
      const scale = 0.3 + 0.7 * progress;
      return {
        x: baseX,
        y: baseY,
        scale,
        rotation: baseRotation,
        opacity: baseOpacity * Math.min(1, progress * 1.5),
        isVisible: true,
      };
    }

    case 'zoom-out': {
      // Scales from 1.6 to 1.0
      const scale = 1.6 - 0.6 * progress;
      return {
        x: baseX,
        y: baseY,
        scale,
        rotation: baseRotation,
        opacity: baseOpacity * progress,
        isVisible: true,
      };
    }

    case 'rotate': {
      // Rotates 180 degrees into base rotation
      const rot = baseRotation + (1 - progress) * -180;
      return {
        x: baseX,
        y: baseY,
        scale: 0.5 + 0.5 * progress,
        rotation: rot,
        opacity: baseOpacity * progress,
        isVisible: true,
      };
    }

    case 'typewriter': {
      if (element.type === 'text') {
        const fullLen = element.text.length;
        const visibleChars = Math.floor(progress * fullLen);
        return {
          x: baseX,
          y: baseY,
          scale: 1,
          rotation: baseRotation,
          opacity: baseOpacity,
          visibleTextLength: visibleChars,
          isVisible: true,
        };
      }
      return {
        x: baseX,
        y: baseY,
        scale: 1,
        rotation: baseRotation,
        opacity: baseOpacity * progress,
        isVisible: true,
      };
    }

    default:
      return {
        x: baseX,
        y: baseY,
        scale: 1,
        rotation: baseRotation,
        opacity: baseOpacity,
        isVisible: true,
      };
  }
}
