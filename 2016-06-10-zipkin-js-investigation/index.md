---
title: Zipkin JS Investigation
slug: zipkin-js-investigation
author: Kevin Hakanson
date: 2016-06-10
tags: ["javascript","api"]
---
To better understand the concepts behind [Zipkin](http://zipkin.io/), I took a look at [Zipkin JS](https://github.com/openzipkin/zipkin-js) (a Zipkin instrumentation implementation for Node.js), including submitting [Pull Request #10](https://github.com/openzipkin/zipkin-js/pull/10) and [Issue #11](https://github.com/openzipkin/zipkin-js/issues/11) to that project.

I wrote this (ugly but) simple Node.js Express app that recursively calls itself after decrementing a count value.  I thought this was an easy way to generate a distributed trace tree of arbitrary depth.

```javascript
const express = require('express');  
const {Tracer, ExplicitContext, ConsoleRecorder} = require('zipkin');  
const zipkinMiddleware = require('zipkin-instrumentation-express').expressMiddleware;  
  
const fetch = require('node-fetch');  
const wrapFetch = require('zipkin-instrumentation-fetch');  
  
const ctxImpl = new ExplicitContext();  
const recorder = new ConsoleRecorder();  
const tracer = new Tracer({ctxImpl, recorder}); // configure your tracer properly here  
  
const app = express();  
app.set('port', process.env.PORT || 3000);  
app.set('servicename', 'helloservice');  
  
// Add the Zipkin middleware  
app.use(zipkinMiddleware({  
  tracer,  
  serviceName: app.get('servicename') // name of this application  
}));  
  
const zipkinFetch = wrapFetch(fetch, {tracer, serviceName: app.get('servicename')});  
  
["log", "warn", "error"].forEach(function(method) {  
    var oldMethod = console[method].bind(console);  
    console[method] = function() {  
        arguments[0] = `${tracer.id} ${arguments[0]}`;  
        oldMethod.apply(  
            console,  
            arguments  
        );  
    };  
});  
  
app.get('/', function (req, res) {  
  var count = req.query.count || 1;  
  console.log(`count = ${count}`);  
  if (count > 1) {  
    var url = 'http://localhost:' + app.get('port') + '/?count=' + (count - 1);  
    console.log(`calling ${url}`);  
    zipkinFetch(url, {})  
      .then(fetchres => fetchres.text())  
      .then(function(result) {  
        res.send(`Hello World! (x${count})\n${result}`);  
      })  
      .catch(ex => console.error(ex));  
  } else {  
    res.send('Hello World!\n');  
  }    
});  
  
app.listen(app.get('port'), function () {  
  console.log('Example app listening on port ' + app.get('port'));  
});  
```

When I call it like this (explicitly passing in a TraceId and SpanId)

```
curl -H "X-B3-TraceId: 1234567890abcdef" -H "X-B3-SpanId: 1234567890abcdef" http://localhost:8001/?count=3
```

I get this result

```
Hello World! (x3)
Hello World! (x2)
Hello World!
```

and see this on the Node.js console as a result of my both `console.log` calls and the configured `ConsoleRecorder`.

```
TraceId(spanId=977a88d5c9febc13, parentId=977a88d5c9febc13, traceId=977a88d5c9febc13) Example app listening on port 8001  
Record at (spanId=1234567890abcdef, parentId=1234567890abcdef, traceId=1234567890abcdef): ServiceName("myservice1")  
Record at (spanId=1234567890abcdef, parentId=1234567890abcdef, traceId=1234567890abcdef): Rpc("GET")  
Record at (spanId=1234567890abcdef, parentId=1234567890abcdef, traceId=1234567890abcdef): BinaryAnnotation(http.url="http://localhost:8001/%3Fcount=3")  
Record at (spanId=1234567890abcdef, parentId=1234567890abcdef, traceId=1234567890abcdef): ServerRecv()  
Record at (spanId=1234567890abcdef, parentId=1234567890abcdef, traceId=1234567890abcdef): LocalAddr(host="InetAddress(10.212.146.110)", port=0)  
TraceId(spanId=1234567890abcdef, parentId=1234567890abcdef, traceId=1234567890abcdef) count = 3  
TraceId(spanId=1234567890abcdef, parentId=1234567890abcdef, traceId=1234567890abcdef) calling http://localhost:8001/?count=2  
Record at (spanId=94a8246c4c298188, parentId=1234567890abcdef, traceId=1234567890abcdef): ServiceName("myservice1")  
Record at (spanId=94a8246c4c298188, parentId=1234567890abcdef, traceId=1234567890abcdef): Rpc("GET")  
Record at (spanId=94a8246c4c298188, parentId=1234567890abcdef, traceId=1234567890abcdef): BinaryAnnotation(http.url="http://localhost:8001/?count=2")  
Record at (spanId=94a8246c4c298188, parentId=1234567890abcdef, traceId=1234567890abcdef): ClientSend()  
Record at (spanId=94a8246c4c298188, parentId=1234567890abcdef, traceId=1234567890abcdef): ServiceName("myservice1")  
Record at (spanId=94a8246c4c298188, parentId=1234567890abcdef, traceId=1234567890abcdef): Rpc("GET")  
Record at (spanId=94a8246c4c298188, parentId=1234567890abcdef, traceId=1234567890abcdef): BinaryAnnotation(http.url="http://localhost:8001/%3Fcount=2")  
Record at (spanId=94a8246c4c298188, parentId=1234567890abcdef, traceId=1234567890abcdef): ServerRecv()  
Record at (spanId=94a8246c4c298188, parentId=1234567890abcdef, traceId=1234567890abcdef): LocalAddr(host="InetAddress(10.212.146.110)", port=0)  
TraceId(spanId=94a8246c4c298188, parentId=1234567890abcdef, traceId=1234567890abcdef) count = 2  
TraceId(spanId=94a8246c4c298188, parentId=1234567890abcdef, traceId=1234567890abcdef) calling http://localhost:8001/?count=1  
Record at (spanId=9b550ac514a4af5, parentId=94a8246c4c298188, traceId=1234567890abcdef): ServiceName("myservice1")  
Record at (spanId=9b550ac514a4af5, parentId=94a8246c4c298188, traceId=1234567890abcdef): Rpc("GET")  
Record at (spanId=9b550ac514a4af5, parentId=94a8246c4c298188, traceId=1234567890abcdef): BinaryAnnotation(http.url="http://localhost:8001/?count=1")  
Record at (spanId=9b550ac514a4af5, parentId=94a8246c4c298188, traceId=1234567890abcdef): ClientSend()  
Record at (spanId=9b550ac514a4af5, parentId=94a8246c4c298188, traceId=1234567890abcdef): ServiceName("myservice1")  
Record at (spanId=9b550ac514a4af5, parentId=94a8246c4c298188, traceId=1234567890abcdef): Rpc("GET")  
Record at (spanId=9b550ac514a4af5, parentId=94a8246c4c298188, traceId=1234567890abcdef): BinaryAnnotation(http.url="http://localhost:8001/%3Fcount=1")  
Record at (spanId=9b550ac514a4af5, parentId=94a8246c4c298188, traceId=1234567890abcdef): ServerRecv()  
Record at (spanId=9b550ac514a4af5, parentId=94a8246c4c298188, traceId=1234567890abcdef): LocalAddr(host="InetAddress(10.212.146.110)", port=0)  
TraceId(spanId=9b550ac514a4af5, parentId=94a8246c4c298188, traceId=1234567890abcdef) count = 1  
Record at (spanId=9b550ac514a4af5, parentId=94a8246c4c298188, traceId=1234567890abcdef): BinaryAnnotation(http.status_code="200")  
Record at (spanId=9b550ac514a4af5, parentId=94a8246c4c298188, traceId=1234567890abcdef): ServerSend()  
Record at (spanId=9b550ac514a4af5, parentId=94a8246c4c298188, traceId=1234567890abcdef): BinaryAnnotation(http.status_code="200")  
Record at (spanId=9b550ac514a4af5, parentId=94a8246c4c298188, traceId=1234567890abcdef): ClientRecv()  
Record at (spanId=94a8246c4c298188, parentId=1234567890abcdef, traceId=1234567890abcdef): BinaryAnnotation(http.status_code="200")  
Record at (spanId=94a8246c4c298188, parentId=1234567890abcdef, traceId=1234567890abcdef): ServerSend()  
Record at (spanId=94a8246c4c298188, parentId=1234567890abcdef, traceId=1234567890abcdef): BinaryAnnotation(http.status_code="200")  
Record at (spanId=94a8246c4c298188, parentId=1234567890abcdef, traceId=1234567890abcdef): ClientRecv()  
Record at (spanId=1234567890abcdef, parentId=1234567890abcdef, traceId=1234567890abcdef): BinaryAnnotation(http.status_code="200")  
Record at (spanId=1234567890abcdef, parentId=1234567890abcdef, traceId=1234567890abcdef): ServerSend()  
```

You can see the consistent TraceId for the request (`1234567890abcdef`) as well as the `1234567890abcdef` -> `94a8246c4c298188` -> `9b550ac514a4af5` lineage.  The `ConsoleRecorder` emitted the lines starting with "Record at" and I overloaded console methods to add the TraceId information.

Instead of outputting to the console, I wanted to write to a Zipkin UI instance that could take reports over HTTP.  However, zipkin-js does not include a version of the Spring Cloud Slueth [HttpZipkinSpanReporter.java](https://github.com/spring-cloud/spring-cloud-sleuth/blob/2e2c8b3e17cbef809abf350f4960acdf14618d16/spring-cloud-sleuth-zipkin/src/main/java/org/springframework/cloud/sleuth/zipkin/HttpZipkinSpanReporter.java) or the Zipkin [JsonCodec.java](https://github.com/openzipkin/zipkin/blob/680170cf5ccce96d31cc3b6e1c1d430edf70e070/zipkin/src/main/java/zipkin/internal/JsonCodec.java) I need.
