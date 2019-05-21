---
title: Out with HPKP, in with CAA?
slug: out-with-hpkp-in-with-caa
author: Kevin Hakanson
date: 2017-08-30
tags: ["http","information security"]
---
I hadn't looked at HTTP Public Key Pinning (HPKP) in detail at until [Pokemon Go vs. Certificate Pinning](../2016-07-11-pokemon-go-vs-certificate-pinning), and later realized how bad things could get with [HPKP and RansomPKP](../2016-09-06-hpkp-and-ransompkp).  Now, as I read [I'm giving up on HPKP](https://scotthelme.co.uk/im-giving-up-on-hpkp/) from Scott Helme ([@Scott\_Helme](https://twitter.com/Scott_Helme)) I think I agree with this statement:

> The problem with HPKP is that it can be quite a complex idea to get your head around and requires a perfect deployment otherwise things can go wrong.

So, what instead?  Maybe use [Certificate Authority Authorization](https://scotthelme.co.uk/certificate-authority-authorization/) (CAA), which is a DNS record that lists the Certificate Authorities (CAs) which are permitted to issue certificates for your domain.  Luckily for our AWS based projects, [Amazon Route 53 now supports CAA records](https://aws.amazon.com/about-aws/whats-new/2017/08/amazon-route-53-now-supports-caa-records/).