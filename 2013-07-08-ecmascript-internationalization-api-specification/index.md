---
title: ECMAScript Internationalization API Specification
slug: ecmascript-internationalization-api-specification
author: Kevin Hakanson
date: 2013-07-08
tags: ["javascript"]
---
I recently downloaded and installed Windows 8.1 Preview to take a look at IE 11 Preview and check out the new "web standards" based features.  One of these standards supported is [Ecma-402](http://ecma-international.org/publications/standards/Ecma-402.htm) or the [ECMAScript Internationalization API Specification](http://www.ecma-international.org/ecma-402/1.0/) (see [Internet Explorer Standards Support Documents](http://msdn.microsoft.com/en-us/library/ff405926(v=vs.85).aspx) for the full list).  If you don't want to read through the specification, [Norbert's Corner](http://norbertlindenberg.com/2012/12/ecmascript-internationalization-api/) has a December 2012 article explaining the API.

[ECMAScript Internationalization test402](http://test262.ecmascript.org/testcases_intl402.html) hosts a set of runnable test cases to test the JavaScript implementation against the API specification. I was curious how well IE 11 stood up against the other browsers.

For a baseline, here are the results for Google Chrome (Mac; Version 27.0.1453.116)

![Google Chrome (Mac; Version 27.0.1453.116)](./images/chrome-mac.png)]

So how do the bleeding edge versions of the leading web browsers compare?

Firefox Nightly 25.0a1 (Windows; 2013-07-08)

![Firefox Nightly 25.0a1 (Windows; 2013-07-08)](./images/firefox-windows.png)

Internet Explorer Preview (11.0.9431.0)

![Internet Explorer Preview (11.0.9431.0)](./images/ie-preview.png)

Google Chrome (Windows; Version 30.0.1559.0 canary)

![Google Chrome (Windows; Version 30.0.1559.0 canary)](./images/chrome-windows.png)

I was a little surprised to see IE 11 come out on top, but not after reading [Updates to the Internet Explorer Testing Center](http://blogs.msdn.com/b/ie/archive/2013/07/01/updates-to-the-internet-explorer-testing-center.aspx) and seeing how many test cases they created, and are submitting back to the official standards bodies.

However, given our customers still request IE 7 support, I guess I will be looking for a polyfill.