import * as base64 from './base64.ts';
import assert from '@quentinadam/assert';

const vectors = [
  { decoded: '', encoded: '' },
  { decoded: 'f', encoded: 'Zg==' },
  { decoded: 'fo', encoded: 'Zm8=' },
  { decoded: 'foo', encoded: 'Zm9v' },
  { decoded: 'foob', encoded: 'Zm9vYg==' },
  { decoded: 'fooba', encoded: 'Zm9vYmE=' },
  { decoded: 'foobar', encoded: 'Zm9vYmFy' },
  { decoded: '', encoded: '', padding: false },
  { decoded: 'f', encoded: 'Zg', padding: false },
  { decoded: 'fo', encoded: 'Zm8', padding: false },
  { decoded: 'foo', encoded: 'Zm9v', padding: false },
  { decoded: 'foob', encoded: 'Zm9vYg', padding: false },
  { decoded: 'fooba', encoded: 'Zm9vYmE', padding: false },
  { decoded: 'foobar', encoded: 'Zm9vYmFy', padding: false },
  {
    decoded: 'm<oZ=X|D~TR*3IPk.N,0|?8?y@;$~7Joaf+dsl+^wl4jz(*.',
    encoded: 'bTxvWj1YfER+VFIqM0lQay5OLDB8Pzg/eUA7JH43Sm9hZitkc2wrXndsNGp6KCou',
  },
  {
    decoded: 'm<oZ=X|D~TR*3IPk.N,0|?8?y@;$~7Joaf+dsl+^wl4jz(*.',
    encoded: 'BtXVwJ8yFer#vfiQm9LqAY4oldb1pZG@Eua2jh56sM0HzITKC7WRxNDSngP3kcOU',
    alphabet: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ9876543210#@',
  },
  {
    decoded: new Uint8Array(Array.from({ length: 256 }, (_, i) => i)),
    // deno-fmt-ignore
    encoded: 'AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/w==',
  },
  {
    // deno-fmt-ignore
    decoded: new Uint8Array([
      0x00, 0x10, 0x83, 0x10, 0x51, 0x87, 0x20, 0x92, 0x8b, 0x30, 0xd3, 0x8f, 0x41, 0x14, 0x93, 0x51,
      0x55, 0x97, 0x61, 0x96, 0x9b, 0x71, 0xd7, 0x9f, 0x82, 0x18, 0xa3, 0x92, 0x59, 0xa7, 0xa2, 0x9a,
      0xab, 0xb2, 0xdb, 0xaf, 0xc3, 0x1c, 0xb3, 0xd3, 0x5d, 0xb7, 0xe3, 0x9e, 0xbb, 0xf3, 0xdf, 0xbf
    ]),
    encoded: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
  },
  {
    // deno-fmt-ignore
    decoded: new Uint8Array([
      0x00, 0x10, 0x83, 0x10, 0x51, 0x87, 0x20, 0x92, 0x8b, 0x30, 0xd3, 0x8f, 0x41, 0x14, 0x93, 0x51,
      0x55, 0x97, 0x61, 0x96, 0x9b, 0x71, 0xd7, 0x9f, 0x82, 0x18, 0xa3, 0x92, 0x59, 0xa7, 0xa2, 0x9a,
      0xab, 0xb2, 0xdb, 0xaf, 0xc3, 0x1c, 0xb3, 0xd3, 0x5d, 0xb7, 0xe3, 0x9e, 0xbb, 0xf3, 0xdf, 0xbf,
      0x00
    ]),
    encoded: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/AA==',
  },
  {
    // deno-fmt-ignore
    decoded: new Uint8Array([
      0x00, 0x10, 0x83, 0x10, 0x51, 0x87, 0x20, 0x92, 0x8b, 0x30, 0xd3, 0x8f, 0x41, 0x14, 0x93, 0x51,
      0x55, 0x97, 0x61, 0x96, 0x9b, 0x71, 0xd7, 0x9f, 0x82, 0x18, 0xa3, 0x92, 0x59, 0xa7, 0xa2, 0x9a,
      0xab, 0xb2, 0xdb, 0xaf, 0xc3, 0x1c, 0xb3, 0xd3, 0x5d, 0xb7, 0xe3, 0x9e, 0xbb, 0xf3, 0xdf, 0xbf,
      0x00
    ]),
    alphabet: 'BCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/A',
    encoded: 'BCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/ABB==',
  },
  {
    // deno-fmt-ignore
    decoded: new Uint8Array([
      0x00, 0x10, 0x83, 0x10, 0x51, 0x87, 0x20, 0x92, 0x8b, 0x30, 0xd3, 0x8f, 0x41, 0x14, 0x93, 0x51,
      0x55, 0x97, 0x61, 0x96, 0x9b, 0x71, 0xd7, 0x9f, 0x82, 0x18, 0xa3, 0x92, 0x59, 0xa7, 0xa2, 0x9a,
      0xab, 0xb2, 0xdb, 0xaf, 0xc3, 0x1c, 0xb3, 0xd3, 0x5d, 0xb7, 0xe3, 0x9e, 0xbb, 0xf3, 0xdf, 0xbf,
      0x00
    ]),
    alphabet: 'BCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/A*',
    encoded: 'BCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/ABB**',
  },
];

Deno.test('encode', () => {
  for (const { decoded, encoded, alphabet, padding } of vectors) {
    const buffer = typeof decoded === 'string' ? new TextEncoder().encode(decoded) : decoded;
    const result = base64.encode(buffer, { alphabet, padding });
    assert(result === encoded, `Expected ${encoded} but got ${result}`);
  }
});

Deno.test('decode', () => {
  for (const { decoded, encoded, alphabet } of vectors) {
    const result = base64.decode(encoded, { alphabet });
    if (typeof decoded === 'string') {
      assert(new TextDecoder().decode(result) === decoded);
    } else {
      assert(result.length === decoded.length);
      for (let i = 0; i < result.length; i++) {
        assert(result[i] === decoded[i]);
      }
    }
  }
});
