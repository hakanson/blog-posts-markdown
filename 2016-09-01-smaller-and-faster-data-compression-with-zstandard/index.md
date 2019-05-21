---
title: Smaller and faster data compression with Zstandard
slug: smaller-and-faster-data-compression-with-zstandard
author: Kevin Hakanson
date: 2016-09-01
tags: ["web"]
---
I saw this post from Facebook on their new open source compression algorithm: [Smaller and faster data compression with Zstandard | Engineering Blog | Facebook Code](https://code.facebook.com/posts/1658392934479273).

> We're thrilled to announce [Zstandard 1.0](https://github.com/facebook/zstd), a new compression algorithm and implementation designed to scale with modern hardware and compress smaller and faster. Zstandard combines recent compression breakthroughs, like [Finite State Entropy](https://github.com/Cyan4973/FiniteStateEntropy), with a performance-first design — and then optimizes the implementation for the unique properties of modern CPUs. As a result, it improves upon the trade-offs made by other compression algorithms and has a wide range of applicability with very high decompression speed. Zstandard, available now under the BSD license, is designed to be used in nearly every lossless compression \[1\] scenario, including many where current algorithms aren't applicable.

The "internet standard" today is Deflate, which is used by zip, gzip, and zlib. When compared to zlib, Facebook shows that zstandard scales much better:

> * At the same compression ratio, it compresses substantially faster: ~3-5x.
> * At the same compression speed, it is substantially smaller: 10-15 percent smaller.
> * It is almost 2x faster at decompression, regardless of compression ratio; the command line tooling numbers show an even bigger difference: more than 3x faster.
> * It scales to much higher compression ratios, while sustaining lightning-fast decompression speeds.

The article continues with an "under the hood" section talking about "parallel execution" and "branchless design" and how those are important to today's CPU architectures.  Good reading for those propeller-heads out there.

One of their highlighted use cases is storing "small data"; some examples are pages in a database or JSON documents.  They also mention that compressed data stored on SSDs help with both IOPs and the write endurance of the hardware.  Facebook stores a lot of data and buys a lot of SSDs, so I can see how this will save them money.