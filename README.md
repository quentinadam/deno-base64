# base64

[![JSR](https://jsr.io/badges/@quentinadam/base64)](https://jsr.io/@quentinadam/base64)
[![CI](https://github.com/quentinadam/deno-base64/actions/workflows/ci.yml/badge.svg)](https://github.com/quentinadam/deno-base64/actions/workflows/ci.yml)

A simple library to encode and decode base64 strings.

Optionnaly supports specifying the alphabet to use.

## Usage

```ts
import * as base64 from '@quentinadam/base64';

base64.encode(new Uint8Array([102, 111, 111, 98])); // returns 'Zm9vYg=='

base64.decode('Zm9vYg=='); // returns Uint8Array([102, 111, 111, 98])

base64.encode(new Uint8Array([102, 111, 111, 98]), { padding: false }); // returns 'Zm9vYg'
```
