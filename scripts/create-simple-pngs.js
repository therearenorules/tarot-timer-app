const fs = require('fs');
const path = require('path');

// Create simple placeholder PNG files
const createPlaceholderPNG = (width, height) => {
  // Create a simple PNG header and data for a solid color image
  const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // IHDR chunk
  const ihdr = Buffer.alloc(25);
  ihdr.writeUInt32BE(13, 0); // Length
  ihdr.write('IHDR', 4);
  ihdr.writeUInt32BE(width, 8);
  ihdr.writeUInt32BE(height, 12);
  ihdr.writeUInt8(8, 16); // Bit depth
  ihdr.writeUInt8(6, 17); // Color type (RGBA)
  ihdr.writeUInt8(0, 18); // Compression
  ihdr.writeUInt8(0, 19); // Filter
  ihdr.writeUInt8(0, 20); // Interlace
  
  // Simple CRC for IHDR (placeholder value)
  ihdr.writeUInt32BE(0, 21);
  
  // IDAT chunk with minimal data
  const idat = Buffer.from([
    0, 0, 0, 12, // Length
    73, 68, 65, 84, // 'IDAT'
    120, 156, 1, 0, 0, 255, 255, 0, 0, 0, 1, 0, 1, // Compressed data
    0, 0, 0, 0 // CRC
  ]);
  
  // IEND chunk
  const iend = Buffer.from([
    0, 0, 0, 0, // Length
    73, 69, 78, 68, // 'IEND'
    174, 66, 96, 130 // CRC
  ]);
  
  return Buffer.concat([PNG_SIGNATURE, ihdr, idat, iend]);
};

// Create assets directory if it doesn't exist
const assetsDir = path.join(__dirname, '..', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Create icon.png (1024x1024)
const iconPNG = createPlaceholderPNG(1024, 1024);
fs.writeFileSync(path.join(assetsDir, 'icon.png'), iconPNG);
console.log('✅ Created assets/icon.png');

// Create splash.png (1284x2778)
const splashPNG = createPlaceholderPNG(1284, 2778);
fs.writeFileSync(path.join(assetsDir, 'splash.png'), splashPNG);
console.log('✅ Created assets/splash.png');

// Create adaptive-icon.png (1024x1024)
const adaptivePNG = createPlaceholderPNG(1024, 1024);
fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.png'), adaptivePNG);
console.log('✅ Created assets/adaptive-icon.png');

console.log('✅ All placeholder assets created successfully!');