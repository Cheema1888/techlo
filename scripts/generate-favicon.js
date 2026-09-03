const fs = require('fs');
const path = require('path');

// Create a 32x32 32-bit RGBA BMP/ICO
const width = 32;
const height = 32;
const bpp = 32;

// Colors in BGRA format
const COLOR_TRANSPARENT = [0, 0, 0, 0];
const COLOR_BG = [17, 17, 17, 255];          // #111111 dark
const COLOR_CYAN = [254, 242, 0, 255];        // #00F2FE cyan (BGRA: B=254, G=242, R=0)
const COLOR_BLUE = [254, 172, 79, 255];       // #4FACFE blue (BGRA: B=254, G=172, R=79)
const COLOR_WHITE = [255, 255, 255, 255];

const pixelData = Buffer.alloc(width * height * 4);

for (let y = 0; y < height; y++) {
  // BMP scans bottom to top
  const row = height - 1 - y;
  for (let x = 0; x < width; x++) {
    const idx = (row * width + x) * 4;
    const dx = x - 15.5;
    const dy = y - 15.5;
    const dist = Math.sqrt(dx * dx + dy * dy);

    let color = COLOR_TRANSPARENT;

    if (dist <= 15) {
      // Rounded circle base
      if (dist >= 13 && dist <= 15) {
        color = COLOR_CYAN; // Outer ring glow
      } else {
        color = COLOR_BG; // Dark background
      }

      // Robot Head outline (10 <= x <= 21, 10 <= y <= 21)
      if (x >= 8 && x <= 23 && y >= 9 && y <= 23) {
        // Antenna
        if (x >= 15 && x <= 16 && y >= 5 && y <= 8) {
          color = COLOR_CYAN;
        }

        // Eyes (pixel dots at (11,14), (12,14), (19,14), (20,14))
        if ((x >= 11 && x <= 13 && y >= 13 && y <= 15) || 
            (x >= 18 && x <= 20 && y >= 13 && y <= 15)) {
          color = COLOR_CYAN;
        }

        // Smile at y=19 (x from 13 to 18)
        if (y === 19 && x >= 13 && x <= 18) {
          color = COLOR_CYAN;
        }
      }
    }

    pixelData[idx] = color[0];     // B
    pixelData[idx + 1] = color[1]; // G
    pixelData[idx + 2] = color[2]; // R
    pixelData[idx + 3] = color[3]; // A
  }
}

// 1-bit AND mask (32 rows * 4 bytes per row)
const maskData = Buffer.alloc(height * 4, 0);

// BITMAPINFOHEADER (40 bytes)
const bih = Buffer.alloc(40);
bih.writeUInt32LE(40, 0);         // biSize
bih.writeInt32LE(width, 4);       // biWidth
bih.writeInt32LE(height * 2, 8);   // biHeight (doubled for ICO mask)
bih.writeUInt16LE(1, 12);         // biPlanes
bih.writeUInt16LE(bpp, 14);       // biBitCount
bih.writeUInt32LE(0, 16);         // biCompression (BI_RGB)
bih.writeUInt32LE(pixelData.length + maskData.length, 20); // biSizeImage
bih.writeInt32LE(0, 24);          // biXPelsPerMeter
bih.writeInt32LE(0, 28);          // biYPelsPerMeter
bih.writeUInt32LE(0, 32);         // biClrUsed
bih.writeUInt32LE(0, 36);         // biClrImportant

const imageData = Buffer.concat([bih, pixelData, maskData]);

// ICONDIR (6 bytes)
const iconDir = Buffer.alloc(6);
iconDir.writeUInt16LE(0, 0); // Reserved
iconDir.writeUInt16LE(1, 2); // Type 1 = ICO
iconDir.writeUInt16LE(1, 4); // Count 1

// ICONDIRENTRY (16 bytes)
const iconEntry = Buffer.alloc(16);
iconEntry.writeUInt8(width, 0);       // Width
iconEntry.writeUInt8(height, 1);      // Height
iconEntry.writeUInt8(0, 2);           // Color count
iconEntry.writeUInt8(0, 3);           // Reserved
iconEntry.writeUInt16LE(1, 4);        // Color planes
iconEntry.writeUInt16LE(bpp, 6);      // Bits per pixel
iconEntry.writeUInt32LE(imageData.length, 8); // Size of image data
iconEntry.writeUInt32LE(6 + 16, 12);  // Offset of image data

const icoBuffer = Buffer.concat([iconDir, iconEntry, imageData]);

const pubPath = path.join(__dirname, '../public/favicon.ico');
const appPath = path.join(__dirname, '../src/app/favicon.ico');

fs.writeFileSync(pubPath, icoBuffer);
fs.writeFileSync(appPath, icoBuffer);

console.log('Successfully generated favicon.ico for public/ and src/app/');
