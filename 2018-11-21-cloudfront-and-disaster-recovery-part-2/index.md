---
title: "CloudFront and Disaster Recovery: Part 2"
slug: cloudfront-and-disaster-recovery-part-2
author: Kevin Hakanson
date: 2018-11-21
tags: ["aws","cloudfront","disaster recovery"]
---
Last year I wrote [CloudFront and Disaster Recovery](../2017-12-12-cloudfront-and-disaster-recovery) based on the ability to use Lambda@Edge to "generate HTTP responses when CloudFront viewer request or origin request events occur."

This year [Amazon CloudFront announces support for Origin Failover](https://aws.amazon.com/about-aws/whats-new/2018/11/amazon-cloudfront-announces-support-for-origin-failover/)

> With CloudFront’s Origin Failover capability, you can setup two origins for your distributions - primary and secondary, such that your content is served from your secondary origin if CloudFront detects that your primary origin is unavailable. CloudFront already allows you to configure custom error pages or generate redirects with Lambda@Edge if your origin is unavailable. Now with Origin Failover, you can easily setup failover logic between combinations of AWS origins or non-AWS custom HTTP origins such that there is minimal interruption to your viewer’s experience. 
