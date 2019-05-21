---
title: Amazon Elasticsearch Service and IAM Policies on HTTP Methods
slug: amazon-elasticsearch-service-and-iam-policies-on-http-methods
author: Kevin Hakanson
date: 2017-06-25
tags: ["aws","aws iam"]
---
The [Creating and Configuring Amazon Elasticsearch Service Domains](http://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/es-createupdatedomains.html#es-createdomain-configure-access-policies) documentation shows the Elasticsearch HTTP methods could be controlled using IAM policies:

> Amazon ES supports the following actions for HTTP methods. You can attach a separate access policy to each HTTP method:
>
> * es:ESHttpDelete
> * es:ESHttpGet
> * es:ESHttpHead
> * es:ESHttpPost
> * es:ESHttpPut

Since this is an open source interface and not an Amazon solution, it may be initially confusing to understand how this could work. The [aws-sdk-java/AWSElasticsearchClient.java](https://github.com/aws/aws-sdk-java/blob/master/aws-java-sdk-elasticsearch/src/main/java/com/amazonaws/services/elasticsearch/AWSElasticsearchClient.java) source in GitHub shows an AWSCredentialsProvider implementing the [Signature Version 4 Signing Process](http://docs.aws.amazon.com/general/latest/gr/signature-version-4.html) on the HTTP requests.  Unfortunately, this means not all [Elasticsearch Clients](https://www.elastic.co/guide/en/elasticsearch/client/index.html) will be compatible with this security configuration.