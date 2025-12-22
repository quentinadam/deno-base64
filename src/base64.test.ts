import assert from '@quentinadam/assert';
import * as base64 from '../src/base64.ts';

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
    decoded: Uint8Array.fromHex('00108310518720928b30d38f41149351559761969b71d79f8218a39259a7a29aabb2dbafc31cb3d35db7e39ebbf3dfbf'),
    encoded: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
  },
  {
    // deno-fmt-ignore
    decoded: Uint8Array.fromHex('00108310518720928b30d38f41149351559761969b71d79f8218a39259a7a29aabb2dbafc31cb3d35db7e39ebbf3dfbf00'),
    encoded: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/AA==',
  },
  {
    // deno-fmt-ignore
    decoded: Uint8Array.fromHex('00108310518720928b30d38f41149351559761969b71d79f8218a39259a7a29aabb2dbafc31cb3d35db7e39ebbf3dfbf00'),
    alphabet: 'BCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/A',
    encoded: 'BCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/ABB==',
  },
  {
    // deno-fmt-ignore
    decoded: Uint8Array.fromHex('00108310518720928b30d38f41149351559761969b71d79f8218a39259a7a29aabb2dbafc31cb3d35db7e39ebbf3dfbf00'),
    alphabet: 'BCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/A*',
    encoded: 'BCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/ABB**',
  },
];

Deno.test('encode', () => {
  for (const { decoded, encoded, alphabet, padding } of vectors) {
    const buffer = typeof decoded === 'string' ? new TextEncoder().encode(decoded) : decoded;
    const result = base64.encode(buffer, { alphabet, padding });
    assert(result === encoded, `Expected ${JSON.stringify(encoded)} but got ${JSON.stringify(result)}`);
  }
});

Deno.test('decode', () => {
  for (const { decoded, encoded, alphabet } of vectors) {
    if (typeof decoded === 'string') {
      const result = new TextDecoder().decode(base64.decode(encoded, { alphabet }));
      assert(result === decoded, `Expected ${JSON.stringify(decoded)} but got ${JSON.stringify(result)}`);
    } else {
      const result = base64.decode(encoded, { alphabet });
      assert(
        result.toHex() === decoded.toHex(),
        `Expected [${decoded.toHex()}] but got [${result.toHex()}]`,
      );
    }
  }
});
