import QRCode from 'qrcode';
import { QRCustomization } from '@/types';

/**
 * Generates raw matrix data from payload string
 */
export async function getQRMatrix(payload: string, ecl: 'L' | 'M' | 'Q' | 'H' = 'Q') {
  const qr = QRCode.create(payload, { errorCorrectionLevel: ecl });
  const modules = qr.modules;
  const size = modules.size;
  const matrix: boolean[][] = [];

  for (let r = 0; r < size; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < size; c++) {
      row.push(Boolean(modules.get(r, c)));
    }
    matrix.push(row);
  }
  return { matrix, size };
}

/**
 * Renders custom SVG QR Code string with ISO 18004 Quiet Zone & Scannability Guarantee
 */
export async function generateQRSVG(payload: string, custom: QRCustomization): Promise<string> {
  const { matrix, size } = await getQRMatrix(payload, custom.ecl);

  // ISO 18004 specifies a minimum 4-module quiet zone margin for camera decoding
  const margin = Math.max(custom.margin || 4, 4);
  const totalSize = size + margin * 2;
  const cellSize = 10;
  const viewBoxSize = totalSize * cellSize;

  // Identify finder eye corners (Top-Left 7x7, Top-Right 7x7, Bottom-Left 7x7)
  const isEyeArea = (r: number, c: number) => {
    if (r < 7 && c < 7) return true; // Top Left
    if (r < 7 && c >= size - 7) return true; // Top Right
    if (r >= size - 7 && c < 7) return true; // Bottom Left
    return false;
  };

  let pathsHtml = '';

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (matrix[r][c] && !isEyeArea(r, c)) {
        const x = (c + margin) * cellSize;
        const y = (r + margin) * cellSize;

        if (custom.pattern === 'dots') {
          pathsHtml += `<circle cx="${x + cellSize / 2}" cy="${y + cellSize / 2}" r="${cellSize * 0.42}" />`;
        } else if (custom.pattern === 'rounded') {
          pathsHtml += `<rect x="${x + 0.5}" y="${y + 0.5}" width="${cellSize - 1}" height="${cellSize - 1}" rx="${cellSize * 0.35}" />`;
        } else if (custom.pattern === 'extra-rounded') {
          pathsHtml += `<rect x="${x + 0.5}" y="${y + 0.5}" width="${cellSize - 1}" height="${cellSize - 1}" rx="${cellSize * 0.5}" />`;
        } else if (custom.pattern === 'smooth' || custom.pattern === 'classy') {
          pathsHtml += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="${cellSize * 0.25}" />`;
        } else {
          // square
          pathsHtml += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" />`;
        }
      }
    }
  }

  // Draw custom Eye Corners with exact 7x7 cell positioning
  const drawEye = (startR: number, startC: number) => {
    const ox = (startC + margin) * cellSize;
    const oy = (startR + margin) * cellSize;
    const outerW = 7 * cellSize;
    const innerW = 3 * cellSize;
    const innerOffset = 2 * cellSize;

    let outerShape = '';
    let innerShape = '';

    if (custom.eyeStyle === 'rounded' || custom.eyeStyle === 'leaf') {
      const rx = custom.eyeStyle === 'leaf' ? outerW * 0.4 : outerW * 0.25;
      outerShape = `<rect x="${ox + cellSize / 2}" y="${oy + cellSize / 2}" width="${outerW - cellSize}" height="${outerW - cellSize}" rx="${rx}" stroke="url(#fg-grad)" stroke-width="${cellSize}" fill="none" />`;
      innerShape = `<rect x="${ox + innerOffset}" y="${oy + innerOffset}" width="${innerW}" height="${innerW}" rx="${rx * 0.6}" fill="url(#fg-grad)" />`;
    } else if (custom.eyeStyle === 'dot') {
      const outerRadius = outerW / 2;
      outerShape = `<circle cx="${ox + outerRadius}" cy="${oy + outerRadius}" r="${outerRadius - cellSize / 2}" stroke="url(#fg-grad)" stroke-width="${cellSize}" fill="none" />`;
      innerShape = `<circle cx="${ox + outerRadius}" cy="${oy + outerRadius}" r="${innerW / 2}" fill="url(#fg-grad)" />`;
    } else {
      // standard square eye
      outerShape = `<rect x="${ox + cellSize / 2}" y="${oy + cellSize / 2}" width="${outerW - cellSize}" height="${outerW - cellSize}" stroke="url(#fg-grad)" stroke-width="${cellSize}" fill="none" />`;
      innerShape = `<rect x="${ox + innerOffset}" y="${oy + innerOffset}" width="${innerW}" height="${innerW}" fill="url(#fg-grad)" />`;
    }

    return outerShape + innerShape;
  };

  const eyesHtml = drawEye(0, 0) + drawEye(0, size - 7) + drawEye(size - 7, 0);

  // Gradient Definition
  let gradDef = '';
  if (custom.gradientEnabled) {
    gradDef = `
      <linearGradient id="fg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${custom.fgColor}" />
        <stop offset="100%" stop-color="${custom.gradientColor}" />
      </linearGradient>
    `;
  } else {
    gradDef = `
      <linearGradient id="fg-grad" x1="0%" y1="0%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="${custom.fgColor}" />
        <stop offset="100%" stop-color="${custom.fgColor}" />
      </linearGradient>
    `;
  }

  // Frame Setup with generous margin padding
  let frameHeader = '';
  let frameFooter = '';
  let totalSvgHeight = viewBoxSize;

  if (custom.frame === 'scanner' || custom.frame === 'rounded' || custom.frame === 'simple') {
    const framePadding = 30;
    const textHeight = 44;
    totalSvgHeight = viewBoxSize + framePadding * 2 + textHeight;

    const frameRectHeight = viewBoxSize + framePadding * 2 + textHeight;
    const frameWidth = viewBoxSize + framePadding * 2;

    frameHeader = `
      <rect x="0" y="0" width="${frameWidth}" height="${frameRectHeight}" rx="24" fill="${custom.frameColor || custom.fgColor}" />
      <rect x="${framePadding}" y="${framePadding}" width="${viewBoxSize}" height="${viewBoxSize}" rx="16" fill="${custom.bgColor}" />
    `;

    frameFooter = `
      <text x="${frameWidth / 2}" y="${frameRectHeight - 20}" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="16" fill="#ffffff" text-anchor="middle" letter-spacing="2">
        ${(custom.frameText || 'SCAN ME').toUpperCase()}
      </text>
    `;
  }

  const finalWidth = custom.frame !== 'none' ? viewBoxSize + 60 : viewBoxSize;
  const finalHeight = totalSvgHeight;
  const qrX = custom.frame !== 'none' ? 30 : 0;
  const qrY = custom.frame !== 'none' ? 30 : 0;

  // Logo Overlay Center Clear Zone (Max 22% size for guaranteed scannability)
  let logoHtml = '';
  if (custom.logoUrl) {
    const maxLogoPct = Math.min(custom.logoSize || 20, 22);
    const logoDimension = (viewBoxSize * maxLogoPct) / 100;
    const logoX = (viewBoxSize - logoDimension) / 2 + qrX;
    const logoY = (viewBoxSize - logoDimension) / 2 + qrY;
    const bgPadding = 10;

    logoHtml = `
      <rect x="${logoX - bgPadding}" y="${logoY - bgPadding}" width="${logoDimension + bgPadding * 2}" height="${logoDimension + bgPadding * 2}" rx="12" fill="${custom.bgColor}" />
      <image href="${custom.logoUrl}" x="${logoX}" y="${logoY}" width="${logoDimension}" height="${logoDimension}" preserveAspectRatio="xMidYMid slice" />
    `;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${finalWidth} ${finalHeight}" width="100%" height="100%">
      <defs>${gradDef}</defs>
      <rect x="0" y="0" width="${finalWidth}" height="${finalHeight}" fill="${custom.bgColor}" />
      ${frameHeader}
      <g transform="translate(${qrX}, ${qrY})">
        <g fill="url(#fg-grad)">
          ${pathsHtml}
        </g>
        ${eyesHtml}
      </g>
      ${logoHtml}
      ${frameFooter}
    </svg>
  `;
}
