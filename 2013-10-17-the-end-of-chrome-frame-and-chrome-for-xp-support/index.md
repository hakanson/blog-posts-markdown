---
title: The End of Chrome Frame and Chrome for XP Support
slug: the-end-of-chrome-frame-and-chrome-for-xp-support
author: Kevin Hakanson
date: 2013-10-17
---
Since Chrome Frame was pushed out to employees to support Workday, we have been seeing some odd browser issues with a few of our applications.  This has led us to "disable" Chrome Frame support by setting the maximum IE version used to IE6 (N.b. chrome=0 does not work; you can verify by looking at the [chromium GetXUaCompatibleDirective source code](https://code.google.com/p/chromium/codesearch#chromium/src/chrome_frame/utils.cc&sq=package:chromium&type=cs)).

> `<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=IE6" />`

More details on the end of Chrome support are available from some Google Chrome/Chromium blog posts.

From [Extending Chrome support for XP users until April 2015](http://chrome.blogspot.com/2013/10/extending-chrome-support-for-xp-users.html) (Wednesday, October 16, 2013)

> On April 8, 2014, after more than a decade of powering many of the world’s computers, Windows XP will officially retire. Like all technologies that come to their end-of-life, the XP operating system and most of its desktop applications will no longer receive updates and security patches. Since unpatched browser bugs are often used by malware to infect computers, we’re extending support for Chrome on Windows XP, and will continue to provide regular updates and security patches until at least April 2015.

From [Retiring Chrome Frame](http://blog.chromium.org/2013/06/retiring-chrome-frame.html) (Thursday, June 13, 2013)

> Given these factors we’ve decided to retire Chrome Frame, and will cease support and updates for the product in January 2014.