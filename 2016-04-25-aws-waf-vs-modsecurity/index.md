---
title: AWS WAF vs. ModSecurity
slug: aws-waf-vs-modsecurity
author: Kevin Hakanson
date: 2016-04-25
tags: ["aws","web","information security"]
---
In a recent meeting with the corporate security team, it was mentioned that a Web Application Firewall (WAF) might be the recommendation for cloud projects to protect against XSS and SQL Injection.  The Cloud Security Workstream has done some research, including WAF options.  As I dug into what an AWS WAF solution might look like, I came up with this diagram:

[![AWS Static Content - AWS WAF.png](images/AWS+Static+Content+-+AWS+WAF.png)](images/AWS+Static+Content+-+AWS+WAF.png)

Since [AWS WAF](https://aws.amazon.com/waf/) and its [Web ACL](http://docs.aws.amazon.com/waf/latest/developerguide/web-acl.html) rules are a feature of the [Amazon CloudFront CDN](https://aws.amazon.com/cloudfront/), a full solution would pull in other Amazon functionality.  CloudFront is most useful as a CDN, if you host your static content assets in S3.  You can configure both an S3 Origin for your static content and a Custom Origin for your dynamic content.  In the diagram above, a "behavior" with the "path prefix" of `api/*` was used to route application requests to the ELB.

However, this solution requires some DNS changes.  CloudFront will now be configured for application hostname, and the ELB needs a new hostname.  This is where things become interesting.  In the classic `www.example.com` scenario, you make CloudFront respond to `www.example.com`, and your original ELB becomes something like `origin-www.example.com`, reflecting the fact it is the "Origin" server.  Our products use "naked" domains meaning `example.com` is the hostname instead of the more traditional `www.example.com`.  This makes the naming of `origin.example.com` harder (since `origin-example.com` would be a new domain).  It also may require us to use Route 53 for DNS because the requirement for an ALIAS record for the zone apex (see [Choosing Between Alias and Non-Alias Resource Record Sets - Amazon Route 53](http://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html)).  This topic needs more investigation.

Earlier, I investigated putting Apache HTTP in front of Zuul and use the ProxyPass directive to pass any `/api` URIs.  This was for HTTP/2 protocol support, but could also be used if we use the [ModSecurity](https://www.modsecurity.org/) Apache module as a WAF.  This solution means no new hostnames, less new infrastructure and could also be used by the deployments in the corporate data center until they can move to AWS.

[![AWS Static Content - ModSecurity.png](images/AWS+Static+Content+-+ModSecurity.png)](images/AWS+Static+Content+-+ModSecurity.png)

CloudFront will be an important feature for the United States, but for the South America and Australia deployments, there are fewer edge locations (see [Amazon CloudFront Product Details](http://aws.amazon.com/cloudfront/details/) ) and will be less customer traffic.  An alternate solution to AWS WAF may be the best solution for now.