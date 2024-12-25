import require from '@quentinadam/require';
import assert from '@quentinadam/assert';

function convert({ input, inputBase, outputBase, convertRemainingBits }: {
  input: Iterable<number>;
  inputBase: number;
  outputBase: number;
  convertRemainingBits: boolean;
}) {
  const output = new Array<number>();
  let accumulator = 0;
  let bits = 0;
  for (const digit of input) {
    if (digit < (1 << inputBase)) {
      accumulator = accumulator << inputBase | digit;
      bits += inputBase;
      while (bits >= outputBase) {
        output.push(accumulator >> (bits - outputBase));
        bits -= outputBase;
        accumulator &= (1 << bits) - 1;
      }
    }
  }
  if (convertRemainingBits) {
    if (bits > 0) {
      output.push(accumulator << (outputBase - bits));
    }
  } else {
    assert(accumulator === 0, 'Remaining bits must be zero');
  }
  return output;
}

function getAlphabet(alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/') {
  if (alphabet.length === 65) {
    return alphabet;
  }
  if (alphabet.length === 64) {
    return alphabet + '=';
  }
  throw new Error(`Invalid alphabet ${alphabet}`);
}

/**
 * Encodes a Uint8Array buffer into a base64 string.
 *
 * @param buffer The buffer to encode.
 * @param options Optionally specify the alphabet to use and if the encoded string should be padded. The alphabet must be a 64-character string, or 65 characters if specifying the padding character to use.
 * @returns The base64 encoded string.
 */
export function encode(buffer: Uint8Array, options?: { alphabet?: string; padding?: boolean }): string {
  const alphabet = getAlphabet(options?.alphabet);
  const output = convert({ input: buffer, inputBase: 8, outputBase: 6, convertRemainingBits: true });
  if (options?.padding ?? true) {
    while (output.length % 4 !== 0) {
      output.push(64);
    }
  }
  return output.map((digit) => require(alphabet[digit])).join('');
}

/**
 * Decodes a base64 encoded string into a Uint8Array buffer.
 *
 * @param string The base64 encoded string.
 * @param options Optionally specify the alphabet to use. The alphabet must be a 64-character string, or 65 characters if specifying the padding character to use.
 * @returns The decoded buffer.
 */
export function decode(string: string, options?: { alphabet?: string }): Uint8Array {
  const alphabet = getAlphabet(options?.alphabet);
  const map = new Map(Array.from(alphabet).map((character, index) => [character, index]));
  const input = Array.from(string, (character) => require(map.get(character), `Invalid character ${character}`));
  return new Uint8Array(convert({ input, inputBase: 6, outputBase: 8, convertRemainingBits: false }));
}
