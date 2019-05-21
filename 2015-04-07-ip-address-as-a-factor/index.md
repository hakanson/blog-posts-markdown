---
title: IP Address as a factor?
slug: ip-address-as-a-factor
author: Kevin Hakanson
date: 2015-04-07
tags: ["information security"]
---
On a call we "discussed" if IP address could be considered a second factor, including the spoof-ability of IPs.

Some excerpts from a Security Stack Exchange question: [network - Can IP address be a component of 2-factor authentication? - Information Security Stack Exchange](http://security.stackexchange.com/questions/12701/can-ip-address-be-a-component-of-2-factor-authentication)

> Although IP addresses are trivial to spoof, TCP connections are not and SSH is a protocol built on top of TCP. The IP address of a TCP connection _is_ a reliable indicator of who you are directly connected to.
>
> I would not consider an IP address to be a factor on its own.

I also found this article which seems to have relevant information:  [Network Authentication, Authorization, and Accounting: Part One - The Internet Protocol Journal - Volume 10, No. 1](http://www.cisco.com/web/about/ac123/ac147/archived_issues/ipj_10-1/101_aaa-part1.html)

> **Elements of Authentication**
>
> When performing authentication, numerous elements can be evaluated before a PDP reaches its access decision. At a high level, these elements can be broken down into three categories: the principal itself (the user, device, or service requesting access), the credential the principal submits (shared key, one-time password, digital certificate, or biometric credential), and the contextual information describing the transaction (location, time of day, software state, and so on)

I like the fact this article adds **contextual information** separate from the credential.  IP address information seems to fit in this category.

Is it correct to state that IP Address is not an additional factor for authentication, but it is additional context that can be taken into account to add security?  Is this really authorization at this point?