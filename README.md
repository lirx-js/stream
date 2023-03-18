[![npm (scoped)](https://img.shields.io/npm/v/@lirx/stream.svg)](https://www.npmjs.com/package/@lirx/stream)
![npm](https://img.shields.io/npm/dm/@lirx/stream.svg)
![NPM](https://img.shields.io/npm/l/@lirx/stream.svg)
![npm type definitions](https://img.shields.io/npm/types/@lirx/stream.svg)

## lirx/stream


## 📦 Installation

```bash
yarn add @lirx/stream
# or
npm install @lirx/stream --save
```

This library supports:

- **common-js** (require): transpiled as es2015, with .cjs extension, useful for old nodejs versions
- **module** (esm import): transpiled as esnext, with .mjs extension (requires node resolution for external packages)

In a **node** environment the library works immediately (no extra tooling required),
however, in a **browser** environment, you'll probably need to resolve external imports thought a bundler like
[snowpack](https://www.snowpack.dev/),
[rollup](https://rollupjs.org/guide/en/),
[webpack](https://webpack.js.org/),
etc...
or directly using [skypack](https://www.skypack.dev/):
[https://cdn.skypack.dev/@lirx/stream](https://cdn.skypack.dev/@lirx/stream)
