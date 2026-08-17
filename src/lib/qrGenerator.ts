// Minimalist, robust pure TypeScript QR Code Matrix Generator (Byte Mode, ECC Level M/L)
// Works 100% offline with zero external dependencies.

class QRBitBuffer {
  buffer: number[] = [];
  length: number = 0;

  get(index: number): boolean {
    const bufIndex = Math.floor(index / 8);
    return ((this.buffer[bufIndex] >>> (7 - (index % 8))) & 1) === 1;
  }

  put(num: number, length: number) {
    for (let i = 0; i < length; i++) {
      this.putBit(((num >>> (length - i - 1)) & 1) === 1);
    }
  }

  putBit(bit: boolean) {
    const bufIndex = Math.floor(this.length / 8);
    if (this.buffer.length <= bufIndex) {
      this.buffer.push(0);
    }
    if (bit) {
      this.buffer[bufIndex] |= 0x80 >>> (this.length % 8);
    }
    this.length++;
  }
}

// Polynomial & Galois Field math for Reed-Solomon
const EXP_TABLE = new Array(256);
const LOG_TABLE = new Array(256);

for (let i = 0; i < 8; i++) EXP_TABLE[i] = 1 << i;
for (let i = 8; i < 256; i++) {
  EXP_TABLE[i] = EXP_TABLE[i - 4] ^ EXP_TABLE[i - 5] ^ EXP_TABLE[i - 6] ^ EXP_TABLE[i - 8];
}
for (let i = 0; i < 255; i++) LOG_TABLE[EXP_TABLE[i]] = i;

function glog(n: number) {
  if (n < 1) throw new Error("glog(" + n + ")");
  return LOG_TABLE[n];
}
function gexp(n: number) {
  while (n < 0) n += 255;
  while (n >= 256) n -= 255;
  return EXP_TABLE[n];
}

class Polynomial {
  num: number[];
  constructor(num: number[], shift: number = 0) {
    let offset = 0;
    while (offset < num.length && num[offset] === 0) offset++;
    this.num = new Array(num.length - offset + shift);
    for (let i = 0; i < num.length - offset; i++) this.num[i] = num[i + offset];
    for (let i = num.length - offset; i < this.num.length; i++) this.num[i] = 0;
  }

  get(index: number) {
    return this.num[index];
  }
  getLength() {
    return this.num.length;
  }

  multiply(e: Polynomial): Polynomial {
    const num = new Array(this.getLength() + e.getLength() - 1).fill(0);
    for (let i = 0; i < this.getLength(); i++) {
      for (let j = 0; j < e.getLength(); j++) {
        num[i + j] ^= gexp(glog(this.get(i)) + glog(e.get(j)));
      }
    }
    return new Polynomial(num);
  }

  mod(e: Polynomial): Polynomial {
    if (this.getLength() - e.getLength() < 0) return this;
    const ratio = glog(this.get(0)) - glog(e.get(0));
    const num = new Array(this.getLength());
    for (let i = 0; i < this.getLength(); i++) num[i] = this.get(i);
    for (let i = 0; i < e.getLength(); i++) {
      num[i] ^= gexp(glog(e.get(i)) + ratio);
    }
    return new Polynomial(num).mod(e);
  }
}

function getErrorCorrectPolynomial(errorCorrectLength: number): Polynomial {
  let a = new Polynomial([1], 0);
  for (let i = 0; i < errorCorrectLength; i++) {
    a = a.multiply(new Polynomial([1, gexp(i)], 0));
  }
  return a;
}

// Table for versions capacity & ECC
const RS_BLOCK_TABLE = [
  // Version 1..6 (L: error correct length, total data codewords)
  [1, 26, 19, 7],
  [1, 44, 34, 10],
  [1, 70, 55, 15],
  [1, 100, 80, 20],
  [1, 134, 108, 26],
  [2, 86, 68, 18],
];

export function generateQRCodeMatrix(text: string): boolean[][] {
  // UTF-8 encode
  const utf8Bytes: number[] = [];
  for (let i = 0; i < text.length; i++) {
    let code = text.charCodeAt(i);
    if (code < 0x80) {
      utf8Bytes.push(code);
    } else if (code < 0x800) {
      utf8Bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
    } else if (code < 0xd800 || code >= 0xe000) {
      utf8Bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
    } else {
      i++;
      code = 0x10000 + (((code & 0x3ff) << 10) | (text.charCodeAt(i) & 0x3ff));
      utf8Bytes.push(
        0xf0 | (code >> 18),
        0x80 | ((code >> 12) & 0x3f),
        0x80 | ((code >> 6) & 0x3f),
        0x80 | (code & 0x3f)
      );
    }
  }

  // Find suitable QR version (1 to 6)
  let typeNumber = 1;
  while (typeNumber <= 6) {
    const table = RS_BLOCK_TABLE[typeNumber - 1];
    const totalData = table[0] * table[2];
    if (utf8Bytes.length + 3 <= totalData) break;
    typeNumber++;
  }
  if (typeNumber > 6) typeNumber = 6;

  const table = RS_BLOCK_TABLE[typeNumber - 1];
  const count = table[0];
  const totalCount = table[1];
  const dataCount = table[2];
  const ecCount = table[3];

  const buffer = new QRBitBuffer();
  // Mode: 8-bit byte (0100)
  buffer.put(4, 4);
  buffer.put(utf8Bytes.length, typeNumber < 10 ? 8 : 16);
  for (let i = 0; i < utf8Bytes.length; i++) {
    buffer.put(utf8Bytes[i], 8);
  }

  // Terminator
  const totalBits = dataCount * count * 8;
  if (buffer.length + 4 <= totalBits) buffer.put(0, 4);
  while (buffer.length % 8 !== 0) buffer.putBit(false);
  while (buffer.length < totalBits) {
    buffer.put(0xec, 8);
    if (buffer.length < totalBits) buffer.put(0x11, 8);
  }

  // Create data codewords
  const dcData: number[][] = [];
  let byteIndex = 0;
  for (let r = 0; r < count; r++) {
    const dc: number[] = [];
    for (let i = 0; i < dataCount; i++) {
      let b = 0;
      for (let bit = 0; bit < 8; bit++) {
        if (buffer.get(byteIndex * 8 + bit)) b |= 1 << (7 - bit);
      }
      byteIndex++;
      dc.push(b);
    }
    dcData.push(dc);
  }

  // Create EC codewords
  const ecData: number[][] = [];
  const rsPoly = getErrorCorrectPolynomial(ecCount);
  for (let r = 0; r < count; r++) {
    const rawPoly = new Polynomial(dcData[r], rsPoly.getLength() - 1);
    const modPoly = rawPoly.mod(rsPoly);
    const ec: number[] = new Array(rsPoly.getLength() - 1).fill(0);
    for (let i = 0; i < ec.length; i++) {
      const modIndex = i + modPoly.getLength() - ec.length;
      ec[i] = modIndex >= 0 ? modPoly.get(modIndex) : 0;
    }
    ecData.push(ec);
  }

  // Interleave
  const finalCodewords: number[] = [];
  for (let i = 0; i < dataCount; i++) {
    for (let r = 0; r < count; r++) {
      finalCodewords.push(dcData[r][i]);
    }
  }
  for (let i = 0; i < ecCount; i++) {
    for (let r = 0; r < count; r++) {
      finalCodewords.push(ecData[r][i]);
    }
  }

  // Matrix size
  const moduleCount = typeNumber * 4 + 17;
  const modules: (boolean | null)[][] = Array.from({ length: moduleCount }, () =>
    new Array(moduleCount).fill(null)
  );

  // Position detection patterns
  const setupPositionProbe = (row: number, col: number) => {
    for (let r = -1; r <= 7; r++) {
      if (row + r <= -1 || moduleCount <= row + r) continue;
      for (let c = -1; c <= 7; c++) {
        if (col + c <= -1 || moduleCount <= col + c) continue;
        if (
          (0 <= r && r <= 6 && (c === 0 || c === 6)) ||
          (0 <= c && c <= 6 && (r === 0 || r === 6)) ||
          (2 <= r && r <= 4 && 2 <= c && c <= 4)
        ) {
          modules[row + r][col + c] = true;
        } else {
          modules[row + r][col + c] = false;
        }
      }
    }
  };

  setupPositionProbe(0, 0);
  setupPositionProbe(moduleCount - 7, 0);
  setupPositionProbe(0, moduleCount - 7);

  // Timing patterns
  for (let r = 8; r < moduleCount - 8; r++) {
    if (modules[r][6] === null) modules[r][6] = r % 2 === 0;
  }
  for (let c = 8; c < moduleCount - 8; c++) {
    if (modules[6][c] === null) modules[6][c] = c % 2 === 0;
  }

  // Dark module
  modules[4 * typeNumber + 9][8] = true;

  // Format info mask placeholder
  for (let i = 0; i < 8; i++) {
    if (modules[8][i] === null) modules[8][i] = false;
    if (modules[8][moduleCount - i - 1] === null) modules[8][moduleCount - i - 1] = false;
    if (modules[i][8] === null) modules[i][8] = false;
    if (modules[moduleCount - i - 1][8] === null) modules[moduleCount - i - 1][8] = false;
  }
  if (modules[8][8] === null) modules[8][8] = false;

  // Put data
  let bitIndex = 0;
  const totalFinalBits = finalCodewords.length * 8;
  let inc = -1;
  let row = moduleCount - 1;
  let col = moduleCount - 1;

  while (col > 0) {
    if (col === 6) col--;
    while (true) {
      for (let c = 0; c < 2; c++) {
        if (modules[row][col - c] === null) {
          let dark = false;
          if (bitIndex < totalFinalBits) {
            const bytePos = Math.floor(bitIndex / 8);
            const bitPos = 7 - (bitIndex % 8);
            dark = ((finalCodewords[bytePos] >>> bitPos) & 1) === 1;
          }
          // Mask pattern 0: (row + col) % 2 == 0
          const mask = (row + (col - c)) % 2 === 0;
          modules[row][col - c] = dark !== mask;
          bitIndex++;
        }
      }
      row += inc;
      if (row < 0 || moduleCount <= row) {
        row -= inc;
        inc = -inc;
        break;
      }
    }
    col -= 2;
  }

  // Format info pattern (Mask 0, Error Level L: 01 000 -> with BCH: 111011111000100)
  const formatBits = [true, true, true, false, true, true, true, true, true, false, false, false, true, false, false];
  for (let i = 0; i < 15; i++) {
    const bit = formatBits[i];
    if (i < 6) modules[i][8] = bit;
    else if (i < 8) modules[i + 1][8] = bit;
    else modules[moduleCount - 15 + i][8] = bit;

    if (i < 8) modules[8][moduleCount - i - 1] = bit;
    else if (i < 9) modules[8][15 - i - 1 + 1] = bit;
    else modules[8][15 - i - 1] = bit;
  }

  return modules.map(r => r.map(c => !!c));
}