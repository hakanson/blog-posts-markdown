---
title: DataDog APM Tracing HTTP Headers
slug: datadog-apm-tracing-http-headers
author: Kevin Hakanson
date: 2017-08-07
tags: ["api"]
---
**Update:** Might be obsolete based on [Datadog + OpenTracing: Embracing the open standard for APM](https://www.datadoghq.com/blog/opentracing-datadog-cncf/) from December 6, 2017

---

Do the [DataDog APM](https://www.datadoghq.com/apm/) tracing headers to see if they match [Zipkin](https://github.com/openzipkin/b3-propagation) (`X-B3-*`) or OpenTracing or [AWS X-Ray](http://docs.aws.amazon.com/xray/latest/devguide/xray-concepts.html#xray-concepts-tracingheader) (`X-Amzn-Trace-Id`) or anything else? Of course not, they use `x-ddtrace-*`.

It's hard to find the docs, but look in the [official Python source](https://github.com/DataDog/dd-trace-py/blob/bb4812f13f8bb5b28f3c3f4d7aa5ee2b7d319db6/docs/index.rst) and find them:

```python
parent_trace_id = request.headers.get(‘x-ddtrace-parent_trace_id‘)
parent_span_id = request.headers.get(‘x-ddtrace-parent_span_id‘)
```

Also, the [unofficial Java](https://github.com/chonton/apm-client/blob/19adc8e6c442cb463d0422d05574348042ba68ee/README.md) documents them:

> The TraceServletFilter traces every incoming request. If the client request includes the **x-ddtrace-parent\_trace\_id** and **x-ddtrace-parent\_span\_id** headers, that indicated span is used as the parent trace and span. Otherwise, a new trace is created. Once the request is complete, the new span or trace is closed and sent to Datadog APM.

