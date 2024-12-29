# @quentinadam/base64

[![JSR][jsr-image]][jsr-url] [![NPM][npm-image]][npm-url] [![CI][ci-image]][ci-url]

A simple library to encode and decode base64 strings.

Optionnaly supports specifying the alphabet to use.

## Usage

```ts
import * as base64 from '@quentinadam/base64';

base64.encode(new Uint8Array([102, 111, 111, 98])); // returns 'Zm9vYg=='

base64.decode('Zm9vYg=='); // returns Uint8Array([102, 111, 111, 98])

base64.encode(new Uint8Array([102, 111, 111, 98]), { padding: false }); // returns 'Zm9vYg'
```

[ci-image]: https://img.shields.io/github/actions/workflow/status/quentinadam/deno-base64/ci.yml?branch=main&logo=github&style=flat-square
[ci-url]: https://github.com/quentinadam/deno-base64/actions/workflows/ci.yml
[npm-image]: https://img.shields.io/npm/v/@quentinadam/base64.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@quentinadam/base64
[jsr-image]: https://jsr.io/badges/@quentinadam/base64?style=flat-square
[jsr-url]: https://jsr.io/@quentinadam/base64
