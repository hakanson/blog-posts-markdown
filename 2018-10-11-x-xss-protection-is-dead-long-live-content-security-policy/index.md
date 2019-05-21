---
title: X-XSS-Protection is Dead, Long Live Content-Security-Policy
slug: x-xss-protection-is-dead-long-live-content-security-policy
author: Kevin Hakanson
date: 2018-10-11
tags: ["information security","http","web"]
---
In mid-July it was reported that [XSS protection disappears from Microsoft Edge](https://portswigger.net/daily-swig/xss-protection-disappears-from-microsoft-edge) and [Find out what’s new in Windows and Office in October](https://blogs.windows.com/windowsexperience/2018/10/02/find-out-whats-new-in-windows-and-office-in-october/) confirms this happened.

> **Retired XSS Filter:** We are retiring the XSS filter in Microsoft Edge beginning with the October 2018 Update. Our customers remain protected thanks to modern standards like [Content Security Policy](https://na01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FHTTP%2FCSP&data=02%7C01%7C%7C1637778c952e44c3f3d908d623f92679%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C636735950338487722&sdata=0kd8LS0AikL0iBKIXI0ZEhUhsrdHVeP3ye4k%2FWlJtpA%3D&reserved=0), which provide more powerful, performant and secure mechanisms to protect against content injection attacks, with [high compatibility across modern browsers](https://na01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fcaniuse.com%2F%23search%3Dcontent%2520security%2520policy&data=02%7C01%7C%7C1637778c952e44c3f3d908d623f92679%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C636735950338487722&sdata=Kev9PTWrQ%2BRxjEgggBqCNJrQjdNnRqXxWHf8vpz29vI%3D&reserved=0).

MDN Web Docs for [X-XSS-Protection](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection) also refer to [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) as the preferred solution

> The HTTP `X-XSS-Protection` response header is a feature of Internet Explorer, Chrome and Safari that stops pages from loading when they detect reflected cross-site scripting ([XSS](https://developer.mozilla.org/en-US/docs/Glossary/XSS)) attacks. Although these protections are largely unnecessary in modern browsers when sites implement a strong [`Content-Security-Policy`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) that disables the use of inline JavaScript (`'unsafe-inline'`), they can still provide protections for users of older web browsers that don't yet support [CSP](https://developer.mozilla.org/en-US/docs/Glossary/CSP).

Now go back to [XSS protection disappears from Microsoft Edge](https://portswigger.net/daily-swig/xss-protection-disappears-from-microsoft-edge) and see their analysis.

> “The XSS Filter is supposed to be on by default,” Heyes explained. “However, it is now off by default, and even if you try to turn it on with `X-XSS-Protection: 1` it remains off.”
>
> “The only way to actually turn it on now is when you have the header `X-XSS-Protection: 1; mode=block`.”

So, unless you are targeting IE11 (see [https://caniuse.com/#feat=contentsecuritypolicy](https://caniuse.com/#feat=contentsecuritypolicy)), it seems like it is time to embrace the [Content-Security-Policy HTTP Header](https://thehub.thomsonreuters.com/docs/DOC-2501378).