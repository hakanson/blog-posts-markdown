---
title: Web Browser Secure Contexts
slug: web-browser-secure-contexts
author: Kevin Hakanson
date: 2017-02-14
tags: ["web","information security"]
---
> **HTTPS - it isn't just for ~~breakfast~~ authentication anymore.**

Yeah, I stole that from a [Florida Orange Juice 1979 TV commercial](https://www.youtube.com/watch?v=7lhFNAYfxNg).

[![Florida Orange Juice](images/pastedImage_3.jpg)](images/pastedImage_3.jpg)

So, what are [Secure Contexts](https://www.w3.org/TR/secure-contexts/) anyway? [Secure Contexts - Web security | MDN](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts) provides full info, but some key points:

* A context will be considered secure when it's delivered securely or locally.
* Secure contexts allow the browser to expose APIs that should only be permitted when transferred securely to the user.

Some APIs (Service Workers, Web Bluetooth, Encrypted Media Extensions) require secure contexts per specification, while other APIs (getUserMedia, Geolocation, etc) have been disabled in non-secure contexts due to browser vendor decisions (see [Prefer Secure Origins For Powerful New Features - The Chromium Projects](https://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features)).

That means for some browser features even to work, you need to have full session HTTPS.  Lots of web applications do this today and have been doing so for years.  I'm personally proud that WestlawNext launched this way, starting with our User Acceptance Testing (UAT) pre-release environment in 2009.  That predates both Gmail ([Official Gmail Blog: Default https access for Gmail](https://gmail.googleblog.com/2010/01/default-https-access-for-gmail.html) ) and Google Search ([Official Google Blog: Search more securely with encrypted Google web search](https://googleblog.blogspot.com/2010/05/search-more-securely-with-encrypted.html)).