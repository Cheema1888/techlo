const fs = require('fs');
const path = require('path');

// Create a 32x32 32-bit RGBA BMP/ICO matching user's exact uploaded image
const width = 32;
const height = 32;
const bpp = 32;

// Colors in BGRA format
const COLOR_TRANSPARENT = [0, 0, 0, 0];
const COLOR_WHITE = [255, 255, 255, 255];
const COLOR_BG = [10, 10, 10, 255];       // #0A0A0A
const COLOR_SCREEN = [24, 24, 24, 255];   // #181818

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

    if (dist <= 15.5) {
      // Outer White Ring
      if (dist >= 11.5 && dist <= 15.5) {
        color = COLOR_WHITE;
      } else {
        // Inner Black Bezel
        color = COLOR_BG;

        // Robot Face Screen Box (rounded rect inside)
        if (x >= 7 && x <= 24 && y >= 8 && y <= 23) {
          // Check corner rounding
          const cornerDistances = [
            Math.hypot(x - 10, y - 11), // top-left
            Math.hypot(x - 21, y - 11), // top-right
            Math.hypot(x - 10, y - 20), // bottom-left
            Math.hypot(x - 21, y - 20), // bottom-right
          ];
          const isCorner = 
            (x < 10 && y < 11 && cornerDistances[0] > 3) ||
            (x > 21 && y < 11 && cornerDistances[1] > 3) ||
            (x < 10 && y > 20 && cornerDistances[2] > 3) ||
            (x > 21 && y > 20 && cornerDistances[3] > 3);

          if (!isCorner) {
            color = COLOR_SCREEN;
          }
        }

        // Two White Square Eyes
        const isLeftEye = (x >= 10 && x <= 13) && (y >= 12 && y <= 15);
        const isRightEye = (x >= 18 && x <= 21) && (y >= 12 && y <= 15);
        if (isLeftEye || isRightEye) {
          color = COLOR_WHITE;
        }

        // Smile
        const isSmile = (y === 19 && (x >= 13 && x <= 18)) || 
                        (y === 18 && (x === 12 || x === 19));
        if (isSmile) {
          color = COLOR_WHITE;
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
const appPath = path.join(__dirname, '../src/app/favicon.ico');

fs.writeFileSync(appPath, icoBuffer);
console.log('Successfully generated updated black & white favicon.ico at src/app/favicon.ico');
