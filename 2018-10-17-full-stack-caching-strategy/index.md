---
title: "\"Full Stack\" Caching Strategy"
slug: full-stack-caching-strategy
author: Kevin Hakanson
date: 2018-10-17
tags: ["caching","http","web"]
---
> _"Caching is somebody else's problem, until it's not" - me (just now)_

OK, so that's a dumb quote I just made up, until it's not.  Microservices do their work, generate their HTTP, response and sent it to the browser.  Often, it isn't until there is a performance or scale problem before a caching strategy gets addressed.

How might a "full stack" caching strategy work?  Take a look at the representative diagram below:

[![](images/pastedImage_5.png)](images/pastedImage_5.png)

Let's start with the microservice and follow the response out.  How much of a response could benefit from a cache?  If it is partially built from of a query result, look at an external cache that works with your database.  If it is the entire HTTP response, look at something that works with your web server pipeline.  However, with all shared caches, think about security and privacy so you don't disclose one customer's data to another.  Some additional links:

* [Cache ASP.NET Output Cache Provider | Microsoft Docs](https://docs.microsoft.com/en-us/azure/redis-cache/cache-aspnet-output-cache-provider)
* [Chapter 26. NHibernate.Caches](http://nhibernate.info/doc/nhibernate-reference/caches.html#NHibernate.Caches.CoreDistributedCache.Redis)

The response flows through NGINX, which has [Content caching](https://www.nginx.com/products/nginx/caching/) functionality.  However, this might not be the best place in the architecture for an application with lots of microservices.  Some additional links:

* [NGINX Docs | NGINX Content Caching](https://docs.nginx.com/nginx/admin-guide/content-cache/content-caching/)
* [A Guide to Caching with NGINX and NGINX Plus - NGINX](https://www.nginx.com/blog/nginx-caching-guide/)  

The response may flow through a content delivery network (like CloudFront) where it could get cached on the "edge" based on the HTTP cache headers.  Early CDNs required you to push out "static content" and use a discrete hostname for browser connection limit reasons.  However, mature CDNs allow for "dynamic acceleration" where requests flow through and utilize HTTP cache headers.  HTTP/2 connections make a single hostname the preferred option.  These distributed shared caches are closer to the browser and give a network latency benefit.  Some additional links:

* [Caching Content Based on Request Headers - Amazon CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/header-caching.html)
* [Headers - Amazon CloudFront](https://docs.aws.amazon.com/cloudfront/latest/APIReference/API_Headers.html) 
* [Managing How Long Content Stays in an Edge Cache (Expiration) - Amazon CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html)

Once the response gets to the browser, there is another ecosystem in play.  The browser has a private cache (populated by HTTP cache headers) and localStorage/indexedDB (populated by JavaScript code).  Additionally, "evergreen" browsers now support Service Workers which can intercept HTTP requests and have access to a Cache API.  Some additional links:

* [HTTP Caching  |  Web Fundamentals  |  Google Developers](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching)
* [Caching Files with Service Worker  |  Web  |  Google Developers](https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker)
* [Using Service Workers - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers)

Any place that has a shared cache needs to be concerned about the cache key.  This is more than just the URL, since different users might get different results (e.g. /profile/me) or different Content Types might be returned based on Accept headers.  The Vary header is often used as part of the cache key.  Some additional links:

* [Getting the most out of Vary with Fastly](https://www.fastly.com/blog/getting-most-out-vary-fastly) 
* [Understanding The Vary Header — Smashing Magazine](https://www.smashingmagazine.com/2017/11/understanding-vary-header/) 

This was just a quick overview as there is a lot more complexity to this topic.  What key parts are missing?  Where in the architecture makes the most sense to you, and how should a development team decide where caching belongs?