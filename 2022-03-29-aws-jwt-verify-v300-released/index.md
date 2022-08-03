---
title: aws-jwt-verify v3.0.0 Released
slug: /2022-03-29-aws-jwt-verify-v300-released
author: Kevin Hakanson
date: 2022-03-29
tags: ["aws","opensource","security"]
---

What started as [pull request #60](https://github.com/awslabs/aws-jwt-verify/pull/60), escalated to becoming a maintainer on [aws-jwt-verify](https://github.com/awslabs/aws-jwt-verify) and releasing [v3.0.0](https://github.com/awslabs/aws-jwt-verify/releases/tag/v3.0.0).

AWS JWT Verify is a JavaScript library for verifying JWTs signed by Amazon Cognito, and any OIDC-compatible IDP that signs JWTs with RS256 / RS384 / RS512.  I wanted to add web browser compatibility for a project I was working on.  It was a nice return to using the Web Cryptography API as I had done in various [presentations](/presentations) over the years.