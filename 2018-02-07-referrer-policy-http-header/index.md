---
title: Referrer-Policy HTTP header
slug: /2018-02-07-referrer-policy-http-header
author: Kevin Hakanson
date: 2018-02-07
tags: ["http", "webdev", "security"]
---
[Referrer-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy) is one the security focused HTTP headers checked during [Observatory by Mozilla](https://observatory.mozilla.org/) scans.  Scott Helme talks about this in [A new security header: Referrer Policy](https://scotthelme.co.uk/a-new-security-header-referrer-policy/), but his comment that you can set [Referrer Policy via the Content Security Policy](https://scotthelme.co.uk/csp-cheat-sheet/#referrer) is based on a [CSP: referrer](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/referrer) feature that had been deprecated.

Using `Referrer-Policy: no-referrer` is effectively setting [rel=noreferrer](https://blog.whatwg.org/tag/rel#rel-noreferrer) on every link and protects the most against information leakage.

Applications that need `Referer` header values sent to themselves should consider `Referrer-Policy: same-origin`
