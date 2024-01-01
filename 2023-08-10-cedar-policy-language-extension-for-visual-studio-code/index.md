---
title: Cedar policy language extension for Visual Studio Code
slug: /2023-08-10-cedar-policy-language-extension-for-visual-studio-code
author: Kevin Hakanson
date: 2023-08-10
tags: ["cedar", "vscode", "opensource", "rust", "wasm"]
---

The [Cedar policy language extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=cedar-policy.vscode-cedar) is available for installation from the Visual Studio Marketplace as well as open source on GitHub at [cedar-policy/vscode-cedar](https://github.com/cedar-policy/vscode-cedar).  This extension supports syntax highlighting, formatting, and validation of Cedar policy language (`*.cedar`) and Cedar schema (`cedarschema.json` / `*.cedarschema.json`) files.

This was a project I started near the beginning of 2023 as personal tool to make my editing of Cedar files easier.  Why Visual Studio Code?  It's what I use everyday, and "remains the preferred IDE across all developers" per [Stack Overflow 2022 Developer Survey](https://survey.stackoverflow.co/2022#section-most-popular-technologies-integrated-development-environment) with 74.48% of respondents.  When Cedar became open source in May, I started the process to have this extension published and become open source since "half of developers (55%) install UI themes and add-ons for their IDEs or editors" according to [The State of Developer Ecosystem 2022](https://www.jetbrains.com/lp/devecosystem-2022/#what-kinds-of-plugins-do-you-install-with-your-ide-or-editor-if-any-).

For a polished README, I created some (what I consider) nice looking animated GIF screen captures to show off the features, but wanted to find a solution that worked without installing any new software.

I put Visual Studio Code in full screen mode, then hid stuff I didn't want on the screen, including extra left rail views, minimap, etc.  I disabled any extensions adding unwanted problems (like spelling or markdown linting) that I didn't wanted included.

I created a script for myself that would look good in a loop, Then recorded using QuickTime to a `.mov` file on my desktop. Since my laptop is a MacBook Pro 16" 2019, the native screen resolution was 3584x2240.  I opened Keynote and set the custom size to 25% of that, or 896x540 then imported the `.mov` followed my an export to an Animated GIF, extra large resolution (1080x675), 15 fps, with 0-sec auto advance.