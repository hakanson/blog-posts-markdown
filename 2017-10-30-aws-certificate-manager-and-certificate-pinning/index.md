---
title: AWS Certificate Manager and Certificate Pinning
slug: aws-certificate-manager-and-certificate-pinning
author: Kevin Hakanson
date: 2017-10-30
tags: ["aws","http","information security"]
---
As a background, please review [Out with HPKP, in with CAA?](../2017-08-30-out-with-hpkp-in-with-caa) to re-familiarize yourself with HTTP Public Key Pinning (HPKP) and Certificate Authority Authorization (CAA).

Today, I saw [How to Prepare for AWS’s Move to Its Own Certificate Authority | AWS Security Blog](https://aws.amazon.com/blogs/security/how-to-prepare-for-aws-move-to-its-own-certificate-authority/) and saw this comment about Certificate Pinning:

> AWS recommends against using certificate pinning because it introduces a potential availability risk. If the certificate to which you pin is replaced, your application will fail to connect. If your use case requires pinning, we recommend that you pin to a CA rather than to an individual certificate. If you are pinning to an Amazon Trust Services CA, you should pin to all CAs shown in the table earlier in this post.

It wasn't mentioned in that blog posting, but AWS Certificate Manager works with CAA Records (see [(Optional) Configure a CAA Record](http://docs.aws.amazon.com/acm/latest/userguide/setup-caa.html)) and as of August 2017 [Amazon Route 53 now supports CAA records](https://aws.amazon.com/about-aws/whats-new/2017/08/amazon-route-53-now-supports-caa-records/).

It Seems like we don't want to [pin one's hopes on](http://www.dictionary.com/browse/pin-one-s-hopes-on) HPKP.
