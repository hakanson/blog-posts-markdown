---
title: Zipkin JS Investigation (Part 2)
slug: zipkin-js-investigation-part-2
author: Kevin Hakanson
date: 2016-07-20
tags: ["javascript","api"]
---
The continuing story from my [Zipkin JS Investigation](../2016-06-10-zipkin-js-investigation)

My zipkin-js [issue](https://github.com/openzipkin/zipkin-js/issues/15) was fixed a couple days ago when [zipkin-js/packages/zipkin-transport-http](https://github.com/openzipkin/zipkin-js/tree/master/packages/zipkin-transport-http) landed, so I decided to revisit my test project and see how it works.

I updated my `app.js` to use `BatchRecorder` and `HttpLogger`.

```javascript
const {Tracer, ExplicitContext, BatchRecorder} = require('zipkin');  
const {HttpLogger} = require('zipkin-transport-http');  
  
const ctxImpl = new ExplicitContext();  
const recorder = new BatchRecorder({  
  logger: new HttpLogger({  
    endpoint: 'http://localhost:9411/api/v1/spans'  
  })  
});  
const tracer = new Tracer({ctxImpl, recorder});  
```

Then using instructions from [Quickstart · OpenZipkin](http://zipkin.io/pages/quickstart.html), I ran a docker command to get started, ...

```console
$ docker run -d -p 9411:9411 openzipkin/zipkin
```

... ran my recursive service code, ...

[![](images/pastedImage_24.png)](images/pastedImage_24.png)

... and looked in zipkin to see the result:

[![](images/pastedImage_0.png)](images/pastedImage_0.png)
