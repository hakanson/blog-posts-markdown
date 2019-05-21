---
title: HPKP and RansomPKP
slug: hpkp-and-ransompkp
author: Kevin Hakanson
date: 2016-09-06
tags: ["http","information security"]
---
In [Pokemon Go vs. Certificate Pinning](../2016-07-11-pokemon-go-vs-certificate-pinning) I explored [RFC 7469 - Public Key Pinning Extension for HTTP](https://tools.ietf.org/html/rfc7469) and the HPKP header.  This looked like something that was complicated to implement if you didn't have a very mature key management process that already knew about future certificates' public keys.  I was a little scared, since I could see a scenario where someone sets this header without completely thinking it through - and locks out paying customers from accessing our products.

Today, I read [Is HTTP Public Key Pinning Dead?](https://blog.qualys.com/ssllabs/2016/09/06/is-http-public-key-pinning-dead) and was introduced to the concept of **RansomPKP** and I am even more scared.  In [Using security features to do bad things](https://scotthelme.co.uk/using-security-features-to-do-bad-things/), Scott Helme explains how an attacker who has access to your server's HTTP response headers could generate a public key that you don't have access to, lock your customers out of your website for the next 60 days, and then ransom that key back to you.

It gets worse since HPKP has the `includeSubDomains` feature:

> If this optional parameter is specified, this rule applies to all of the site's subdomains as well.

Now suppose somebody applies RansomPKP to our naked domain server (e.g., example.com) and includes the includeSubDomains option?  Could they ransom multiple company products all at once?  Our public facing website is now an attack vector for other unrelated properties.

All hope is not lost.  [Is HTTP Public Key Pinning Dead?](https://blog.qualys.com/ssllabs/2016/09/06/is-http-public-key-pinning-dead) did have some ideas in a "What can you do today?" section, including just stripping that header in your reverse proxy / load balancer. Alternatively, you can implement HPKP yourself (and only be a little scared).
