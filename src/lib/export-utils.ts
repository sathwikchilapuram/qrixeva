import { jsPDF } from 'jspdf';
import { generateQRSVG } from './qr-generator';
import { QRCustomization } from '@/types';

/**
 * Downloads SVG file directly
 */
export function downloadSVG(svgString: string, filename: string = 'qrixeva-code.svg') {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Converts SVG to PNG or JPG data URL / Blob and triggers download
 */
export async function downloadRasterImage(
  svgString: string,
  format: 'png' | 'jpg' = 'png',
  filename: string = 'qrixeva-code.png',
  width: number = 1000
): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const aspect = img.height / img.width;
      canvas.width = width;
      canvas.height = width * aspect;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject('Canvas context not available');
        return;
      }

      if (format === 'jpg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);

      const mime = format === 'jpg' ? 'image/jpeg' : 'image/png';
      const dataUrl = canvas.toDataURL(mime, 0.95);

      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      resolve();
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };

    img.src = url;
  });
}

/**
 * Generates high-res printable PDF with QR code and brand header
 */
export async function downloadQRPDF(
  svgString: string,
  title: string = 'Qrixeva Digital QR Pass',
  filename: string = 'qrixeva-code.pdf'
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Header branding
  doc.setFillColor(9, 9, 11);
  doc.rect(0, 0, 210, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('Qrixeva', 20, 22);

  doc.setFontSize(10);
  doc.setTextColor(161, 161, 170);
  doc.text('Create. Customize. Connect.', 20, 30);

  // Document Title
  doc.setTextColor(24, 24, 27);
  doc.setFontSize(18);
  doc.text(title, 20, 60);

  // Convert SVG to PNG for PDF insertion
  const img = new Image();
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  await new Promise((resolve) => {
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = (800 * img.height) / img.width;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }
      const dataUrl = canvas.toDataURL('image/png');
      doc.addImage(dataUrl, 'PNG', 45, 75, 120, (120 * img.height) / img.width);
      URL.revokeObjectURL(url);
      resolve(true);
    };
    img.src = url;
  });

  // Instructions Box
  doc.setFillColor(244, 244, 245);
  doc.roundedRect(20, 220, 170, 45, 4, 4, 'F');

  doc.setFontSize(12);
  doc.setTextColor(9, 9, 11);
  doc.text('How to use this QR Code:', 28, 232);

  doc.setFontSize(10);
  doc.setTextColor(82, 82, 91);
  doc.text('1. Open your camera app on iOS or Android.', 28, 242);
  doc.text('2. Point the camera steadily at the QR code above.', 28, 250);
  doc.text('3. Tap the notification banner to access the dynamic content instantly.', 28, 258);

  doc.save(filename);
}

/**
 * Copies QR Image to system Clipboard
 */
export async function copyQRImageToClipboard(svgString: string): Promise<boolean> {
  try {
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    return new Promise((resolve) => {
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width || 600;
        canvas.height = img.height || 600;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
        }
        URL.revokeObjectURL(url);

        canvas.toBlob(async (blob) => {
          if (blob && navigator.clipboard && navigator.clipboard.write) {
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
            resolve(true);
          } else {
            resolve(false);
          }
        }, 'image/png');
      };
      img.src = url;
    });
  } catch (e) {
    console.error('Clipboard copy error', e);
    return false;
  }
}
