---
title: Hello Rust WASM NodeJS
slug: /2023-02-06-hello-rust-wasm-nodejs
author: Kevin Hakanson
date: 2023-02-06
tags: ["rust", "wasm"]
---

I am working on a project that requires calling some Rust crates from a NodeJS runtime.  I had a project with some working code (which I didn't fully understand), so I wanted to start by implementing the classic "Hello World!" problem.  Let's start at the end with the TypeScript code:

```typescript
import * as wasm from "hello-wasm";

wasm.greet("WASM");
```

It's "Hello WASM!" instead of "Hello World!", but you get the point.

```rust
#[wasm_bindgen]
pub fn greet(name: &str) {
  use web_sys::console;
  console::log_1(&JsValue::from_str(&format!("Hello, {}!", name)));
}
```

Most of the Rust "magic" comes from [wasm-bindgen](https://docs.rs/wasm-bindgen/latest/wasm_bindgen/) and [web_sys](https://docs.rs/web-sys/latest/web_sys/), but [wasm-pack](https://rustwasm.github.io/docs/wasm-pack/introduction.html) is what allows me to build rust-generated WebAssembly and use alongside my TypeScript.

```bash
wasm-pack build --target nodejs
```

Check out my "Hello World" in Rust, compiled to WASM, and called from NodeJS project on GitHub at [hakanson/hello-rust-wasm-nodejs](https://github.com/hakanson/hello-rust-wasm-nodejs).  You don't even need to install Rust because I used Visual Studio Code Dev Containers to [develop in a container](https://code.visualstudio.com/docs/devcontainers/containers)