---
title: AWS Request IDs
slug: aws-request-ids
author: Kevin Hakanson
date: 2017-03-08
tags: ["aws","api"]
---
I was reading [Techniques and Tools for Better Serverless API Logging with Amazon API Gateway and AWS Lambda](https://aws.amazon.com/blogs/compute/techniques-and-tools-for-better-serverless-api-logging-with-amazon-api-gateway-and-aws-lambda/) when I came across a reference to the **x-amzn-RequestId** HTTP response header.  This appears to be a common way for Amazon services to return a unique request id. Each service has documentation similar to this:

> **x-amzn-RequestId**
> 
> A value created by Amazon {service} that uniquely identifies your request. If you have a problem with Amazon {service}, AWS can use this value to troubleshoot the problem. We recommend that you log these values.

(_Note_: S3 is an exception using **x-amz-request-id** (and optionally **x-amz-id-2 )**, and CloudFront adds an **X-Amz-Cf-Id** request header before forwarding to your origin.)

Assuming you are not making raw HTTP requests and are using an AWS SDK, this value becomes easy to access using the **requestId** property of the response.

I started to wonder how this relates to the **X-Amzn-Trace-Id** [Tracing Header](http://docs.aws.amazon.com/xray/latest/devguide/xray-concepts.html#xray-concepts-tracingheader) from AWS X-Ray, which uses an extendable **Field=version-time-id** format.  Here is an example:

> X-Amzn-Trace-Id: Root=1-5759e988-bd862e3fe1be46a994272793; Parent=53995c3f42cd8ad8; Sampled=1

The answer is probably as simple as request tracing vs. response logging, but does the AWS X-Ray SDK take advantage of this common request id?  Looking at the Node.js SDK source code, I see that `patchers/aws_p.js` uses `segments/attributes/aws.js` which has this line of code:

```javascript
this.request_id = res.extendedRequestId || res.requestId || '';
```

It is logged as an attribute of subsegments related to AWS services. However, I could have found this by looking at the example from [Tracing AWS SDK Calls with the X-Ray SDK for Node.js](http://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-nodejs-awssdkclients.html).

In the end, it looks like Amazon's advice to "log these values" ourselves s what we should do. That will give us the best option to log other important data alongside the request id and not have to worry if our tracing request was sampled.