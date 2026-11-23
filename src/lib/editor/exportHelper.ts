import Konva from 'konva';
import { jsPDF } from 'jspdf';

export interface ExportOptions {
  filename?: string;
  format: 'png' | 'jpg' | 'pdf';
  quality?: number; // 0.1 to 1.0 (for jpg)
}

/**
 * Downloads a data URL as a file in the browser
 */
function downloadFile(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Ensures all custom web fonts (including Devanagari Unicode fonts) are fully loaded
 * before triggering the canvas export to prevent font fallback rendering glitches.
 */
export async function ensureFontsLoaded(): Promise<void> {
  if (typeof document !== 'undefined' && 'fonts' in document) {
    try {
      await document.fonts.ready;
    } catch {
      // Ignore font loading errors and continue
    }
  }
}

/**
 * Exports a Konva Stage to PNG, JPG, or PDF.
 */
export async function exportCanvas(
  stage: Konva.Stage,
  options: ExportOptions
): Promise<void> {
  const { format, quality = 0.95, filename = 'utsav-invitation' } = options;

  await ensureFontsLoaded();

  const width = stage.width();
  const height = stage.height();

  if (format === 'png') {
    const dataUrl = stage.toDataURL({
      pixelRatio: 1,
      mimeType: 'image/png',
    });
    downloadFile(dataUrl, `${filename}.png`);
    return;
  }

  if (format === 'jpg') {
    const dataUrl = stage.toDataURL({
      pixelRatio: 1,
      mimeType: 'image/jpeg',
      quality,
    });
    downloadFile(dataUrl, `${filename}.jpg`);
    return;
  }

  if (format === 'pdf') {
    const dataUrl = stage.toDataURL({
      pixelRatio: 1,
      mimeType: 'image/png',
    });

    const isLandscape = width > height;
    const pdf = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'px',
      format: [width, height],
      hotfixes: ['px_scaling'],
    });

    pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);
    pdf.save(`${filename}.pdf`);
    return;
  }
}
