const fs = require('fs');
const path = require('path');

// Generate 32x32 32-bit RGBA ICO with transparent background
const width = 32;
const height = 32;
const bpp = 32;

// Matrix: 4x4 Pi monogram
const matrix = [
  [1, 1, 1, 0],
  [1, 0, 1, 0],
  [1, 1, 0, 1],
  [1, 0, 0, 1],
];

// Map 32x32 pixels to 4x4 grid (centered with 2px padding, 7px per cell)
const cellSize = 7;
const pad = 2; // 2 + 7*4 = 30 -> 1px extra on right/bottom

function isGlyph(x, y) {
  if (x < pad || x >= pad + 4 * cellSize || y < pad || y >= pad + 4 * cellSize) {
    return false;
  }
  const col = Math.floor((x - pad) / cellSize);
  const row = Math.floor((y - pad) / cellSize);
  if (row >= 0 && row < 4 && col >= 0 && col < 4) {
    return matrix[row][col] === 1;
  }
  return false;
}

const pixelData = Buffer.alloc(width * height * 4);

for (let y = 0; y < height; y++) {
  // BMP scans bottom to top
  const row = height - 1 - y;
  for (let x = 0; x < width; x++) {
    const idx = (row * width + x) * 4;

    if (isGlyph(x, y)) {
      // Solid White fill
      pixelData[idx] = 255;     // B
      pixelData[idx + 1] = 255; // G
      pixelData[idx + 2] = 255; // R
      pixelData[idx + 3] = 255; // A
    } else {
      // Check if neighboring pixel is glyph (subtle 1px dark border for light tab visibility)
      let isNeighbor = false;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx !== 0 || dy !== 0) {
            if (isGlyph(x + dx, y + dy)) {
              isNeighbor = true;
              break;
            }
          }
        }
        if (isNeighbor) break;
      }

      if (isNeighbor) {
        // Crisp dark outline (rgba: 15, 23, 42, 0.85)
        pixelData[idx] = 42;      // B
        pixelData[idx + 1] = 23;  // G
        pixelData[idx + 2] = 15;  // R
        pixelData[idx + 3] = 216; // A
      } else {
        // Completely transparent
        pixelData[idx] = 0;
        pixelData[idx + 1] = 0;
        pixelData[idx + 2] = 0;
        pixelData[idx + 3] = 0;
      }
    }
  }
}

// 1-bit AND mask (32 rows * 4 bytes per row)
const maskData = Buffer.alloc(height * 4, 0);

// BITMAPINFOHEADER (40 bytes)
const bih = Buffer.alloc(40);
bih.writeUInt32LE(40, 0);
bih.writeInt32LE(width, 4);
bih.writeInt32LE(height * 2, 8); // doubled for ICO
bih.writeUInt16LE(1, 12);
bih.writeUInt16LE(bpp, 14);
bih.writeUInt32LE(0, 16);
bih.writeUInt32LE(pixelData.length + maskData.length, 20);
bih.writeInt32LE(0, 24);
bih.writeInt32LE(0, 28);
bih.writeUInt32LE(0, 32);
bih.writeUInt32LE(0, 36);

const imageData = Buffer.concat([bih, pixelData, maskData]);

// ICONDIR (6 bytes)
const iconDir = Buffer.alloc(6);
iconDir.writeUInt16LE(0, 0);
iconDir.writeUInt16LE(1, 2);
iconDir.writeUInt16LE(1, 4);

// ICONDIRENTRY (16 bytes)
const iconEntry = Buffer.alloc(16);
iconEntry.writeUInt8(width, 0);
iconEntry.writeUInt8(height, 1);
iconEntry.writeUInt8(0, 2);
iconEntry.writeUInt8(0, 3);
iconEntry.writeUInt16LE(1, 4);
iconEntry.writeUInt16LE(bpp, 6);
iconEntry.writeUInt32LE(imageData.length, 8);
iconEntry.writeUInt32LE(6 + 16, 12);

const icoBuffer = Buffer.concat([iconDir, iconEntry, imageData]);
const appPath = path.join(__dirname, '../src/app/favicon.ico');

fs.writeFileSync(appPath, icoBuffer);
console.log('Successfully generated transparent background Pi monogram favicon.ico at src/app/favicon.ico');
