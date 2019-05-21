---
title: Monotonic Time in JavaScript
slug: monotonic-time-in-javascript
author: Kevin Hakanson
date: 2017-02-15
tags: ["aws","javascript"]
---
I was looking at the source code for [The AWS X-Ray SDK for Node.js](http://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-nodejs.html) and saw these code snippets:

```javascript
Segment.prototype.init = function init(name, rootId, parentId) {  
  var traceId = rootId || '1-' + Math.round(new Date().getTime() / 1000).toString(16) + '-' +
    crypto.randomBytes(12).toString('hex');
  var id = crypto.randomBytes(8).toString('hex');
  var startTime = new Date().getTime()/1000;

// ... stuff removed ...

Segment.prototype.close = function (e) {
  if(!this.end_time)
    this.end_time = new Date().getTime()/1000;
```

Whenever I see `new Date()` in JavaScript for performance timings, my [Spider-Sense](http://marvelanimated.wikia.com/wiki/Spider-Sense) tingles. Browsers have `performance.now()` for this, which always returns values that increase at a constant rate. Other terms you see relating to this concept are monotonically increasing, monotonic clock, and monotonic time. For more info:

* [When milliseconds are not enough: performance.now  |  Web  |  Google Developers](https://developers.google.com/web/updates/2012/08/When-milliseconds-are-not-enough-performance-now) 
* [performance.now() - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now) 
* [High Resolution Time Level 3](http://w3c.github.io/hr-time/) 

Now, the X-Ray SDK is running in Node.js and not in the browser, but [`process.hrtime()`](https://nodejs.org/api/process.html#process_process_hrtime_time) and NPM packages like [`performance-now`](https://www.npmjs.com/package/performance-now) ensure the reported time will be monotonically increasing.

Do you remember the leap second earlier this year? Do you also remember that this caused some problems? From [How and why the leap second affected Cloudflare DNS](https://blog.cloudflare.com/how-and-why-the-leap-second-affected-cloudflare-dns/):

> ## A falsehood programmers believe about time
> The root cause of the bug that affected our DNS service was the belief that _time cannot go backwards_. In our case, some code assumed that the _difference_ between two times would always be, at worst, zero.
>
> RRDNS is written in Go and uses Go’s [time.Now()](https://golang.org/pkg/time/#Now) function to get the time. Unfortunately, this function does not guarantee monotonicity. Go currently doesn’t offer a monotonic time source (see issue [12914](https://github.com/golang/go/issues/12914) for discussion).

So, not understanding that computer time can go backward causes bigger problems than invalid performance metrics. It makes me glad [The TARDIS](http://www.bbc.co.uk/programmes/profiles/5Dp7g7b0dSVhD2TM1xNlf7c/the-tardis) is a living consciousness and not written in either JavaScript or Go.

[![TARDIS](images/pastedImage_1.jpg)](images/pastedImage_1.jpg)