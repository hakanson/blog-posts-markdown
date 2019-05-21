---
title: AWS WAF / AWS Shield for DDoS Protection
slug: aws-waf-aws-shield-for-ddos-protection
author: Kevin Hakanson
date: 2018-08-31
tags: ["aws","waf","information security"]
---
One of the [AWS Whitepapers](https://aws.amazon.com/whitepapers/#security) is the 30-page [AWS Best Practices for DDoS Resiliency (June 2018)](https://d1.awsstatic.com/whitepapers/Security/DDoS_White_Paper.pdf) which gives a overall summary of the topic as well as a good distinction where AWS Shield and AWS WAF fit.

First, a definition and some key facts about DDoS:

> A Denial of Service (DoS) attack is a deliberate attempt to make your website or application  
> unavailable to users, such as by flooding it with network traffic.
>
> But in a Distributed Denial of Service (DDoS) attack, an attacker uses multiple sources \[...\] to orchestrate an attack against a target.

Later, there is a distinction between _infrastructure layer attacks_ and _application layer attacks_.

> DDoS attacks are most common at layers 3, 4, 6, and 7 of the Open Systems Interconnection (OSI) model, which is described in following table (Table 1). Layer 3 and 4 attacks correspond to the Network and Transport layers of the OSI model. We’ll refer to these collectively as _infrastructure layer attacks_. Layer 6 and 7 attacks correspond to the Presentation and Application layers of the OSI model. We’ll address these together as _application layer attacks_.

The Mitigation Techniques section starting on Page 7 highlights AWS Shield Advanced as a way to mitigate DDoS attacks.  The network level protection is most helpful for Infrastructure Layer Defense, but one of the many items included with the AWS Shield Advanced subscription is:

* Access to AWS WAF, at no additional cost, for the mitigation of application layer DDoS attacks (when used with Amazon CloudFront or ALB).

AWS WAF helps with Application Layer Defense but "requires you to implement an architecture that allows you to  
specifically detect, scale to absorb, and block malicious requests."  [Protect Web Sites & Services Using Rate-Based Rules for AWS WAF](https://aws.amazon.com/blogs/aws/protect-web-sites-services-using-rate-based-rules-for-aws-waf/) showcases a good rule to start with, even if used in count mode.  Moving beyond DDoS attacks applications can look at [Use AWS WAF to Mitigate OWASP’s Top 10 Web Application Vulnerabilities](https://d1.awsstatic.com/whitepapers/Security/aws-waf-owasp.pdf), but these require synergy with the application architecture.

The DDoS whitepaper also highlights Operational Techniques such as Visibility.  Included with AWS Shield Advanced is access to a number of additional CloudWatch metrics.  However, these are only valuable when monitored.

Give the whitepaper a read through.  What key points do you see highlighted?