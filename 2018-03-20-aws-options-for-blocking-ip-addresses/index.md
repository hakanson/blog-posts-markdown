---
title: AWS Options for Blocking IP Addresses
slug: aws-options-for-blocking-ip-addresses
author: Kevin Hakanson
date: 2018-03-20
tags: ["aws","information security"]
---
While diving into BIG-IP iRules code researching [HTTP to HTTPS Redirection](../2018-03-13-http-to-https-redirection), I ran across this snippet:

```tcl
ltm rule APPX_BLOCK {
    when CLIENT_ACCEPTED {
        if {[matchclass [IP::remote_addr] eq APPX_BLOCK_IPs]} {
            reject
        }
    }
}
```

Reaching out to one of the DevOps team to learn more, he directed me to a process document on how to block IP address in our data center.  That caused me to consider what the AWS solution to this problem look like?  Below are a couple of options.

## Static Blocking

If you wanted to mimic the legacy process, you could used a Security Group and DENY access to those IPs.  However, according to [Amazon VPC Limits](https://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/VPC_Appendix_Limits.html#vpc-limits-security-groups), the "Inbound or outbound rules per security group" limit is 50.

> You can have 50 inbound and 50 outbound rules per security group (giving a total of 100 combined inbound and outbound rules). To increase or decrease this limit, contact AWS Support — a limit change applies to both inbound and outbound rules. However, the limit for inbound or outbound rules per security group multiplied by the limit for security groups per network interface cannot exceed 250. For example, if you want to increase the limit to 100, we decrease your number of security groups per network interface to 2.

Combining the low IP limit with the fact that modern hackers change IP addresses frequently, a static option isn't very attractive.

## Dynamic Blocking

An internal project has published some WAF templates that include rules which block requests from IP addresses on third-party reputation lists:

> This lambda function checks third-party IP reputation lists hourly for new IP ranges to block. These lists include the Spamhaus Dont Route Or Peer (DROP) and Extended Drop (EDROP) lists, the Proofpoint Emerging Threats IP list, and the Tor exit node list.

This dynamically catches threats, but not necessary the IPs attacking our products.

## Custom Dynamic Blocking

Amazon publishes solutions where Lambda functions monitor logs and automatically update AWS WAF rules.  One such solution is [Tutorial: Blocking IP Addresses That Submit Bad Requests](https://docs.aws.amazon.com/waf/latest/developerguide/tutorials-4xx-blocking.html).

[![Blocking IP Addresses That Submit Bad Requests](images/pastedImage_1.png)](images/pastedImage_1.png)

This type of solution is the most compelling, because it reacts to malicious traffic explicitly directed at our products.  It is also the most complex.

More research is needed, so another item for the backlog.
