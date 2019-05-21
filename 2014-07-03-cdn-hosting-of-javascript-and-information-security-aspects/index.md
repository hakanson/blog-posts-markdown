---
title: CDN Hosting of JavaScript and Information Security Aspects
slug: cdn-hosting-of-javascript-and-information-security-aspects
author: Kevin Hakanson
date: 2014-07-03
tags: ["javascript", "information security"]
---
During the last Front-End group call, we were discussing JavaScript combination/minification when the topic of using a [Content Delivery Network](http://en.wikipedia.org/wiki/Content_delivery_network) (CDN) came up.  This is a well-known performance "best practice" on the internet, but I mentioned it comes with some interesting information security concerns.  It looks something like this:

> `<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>`

For those new to the topic, you can find many blog posts detailing this strategy.  For example, take a look at [3 reasons why you should let Google host jQuery for you](http://encosia.com/3-reasons-why-you-should-let-google-host-jquery-for-you/).  Since this article mentions jQuery and not AngularJS, I'm going to continue to use jQuery for this discussion.  The author asserts that:

> Doing so has several advantages over hosting jQuery on your server(s): **decreased latency**, **increased parallelism**, and **better caching**.

Let me summarize these points with some more quotes from that article:

* **decreased latency** - "automatically target the closest available server in the network" so the user "will be able to download jQuery faster"
* **increased parallelism** - "doesn’t make a gigantic difference for users with a six concurrent connection browser"
* **better caching** - "if someone visits hundreds of sites using the same Google hosted version of jQuery, they will only need download it once!"

The jQuery site itself mentions [Using jQuery with a CDN](http://jquery.com/download/#using-jquery-with-a-cdn) including listing several CDNs that host jQuery.

> CDNs can offer a performance benefit by hosting jQuery on servers spread across the globe. This also offers an advantage that if the visitor to your webpage has already downloaded a copy of jQuery from the same CDN, it won't have to be re-downloaded.

I am going to differentiate using a public, free CDN like [jQuery CDN](http://code.jquery.com/) or [Google Hosted Libraries](https://developers.google.com/speed/libraries/devguide#jquery) from using a paid product like [Dynamic Site Accelerator](http://www.akamai.com/html/solutions/dynamic-site-accelerator.html) from Akamai.  With the latter, you have an established business relationship that has been vetted around topics like uptime/SLA and security reviews.

From an information security perspective, here are some items to consider:

1. Isn't CDN hosting logically just another one of the [Types of Cross-Site Scripting](https://www.owasp.org/index.php/Types_of_Cross-Site_Scripting)?  Yes, it is true that you injected the script yourself, but it is still loading a remote executable that has access to your data.  What if the CDN gets hacked?
2. Not hosting the source code yourself means it may not be included in any static source code scanning performed on your build (like Veracode).
3. You implicitly accept any [Termgenerals of Service](https://developers.google.com/speed/libraries/terms) for your users, including any user or IP address tracking.  Is this compatible with your product's terms of service?
4. The [Other CDNs](http://jquery.com/download/#other-cdns) section on the jQuery site states "there may be delays between a jQuery release and its availability there", which means if you have to push out a security fix, you need to wait for the CDN to deploy.
5. The [jQuery CDN HTTPS certificate expired on July 31](https://plus.google.com/+IlyaGrigorik/posts/N8dDov8vWcM) and caused a short outage.  So, in addition to not being in control of the code that is hosted, you don't have control over if the site is functional or not.

In general, I like the idea of free hosting.  For a personal blog, where users may quickly pop in to read a post and maybe never come back, they serve an important purpose.  In fact, many of these CDNs have excellent operational and security characteristics.  However, for a paid product where we are trusted with the privacy of their data, these are essential points to consider.  I wouldn't recommend a free CDN for the projects I am working on, but "your mileage may vary" so understand the risks vs. the rewards before taking general advice from the internet.
