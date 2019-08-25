---
title: Investigating Web Cache Poisoning
slug: /2018-08-22-investigating-web-cache-poisoning
author: Kevin Hakanson
date: 2018-08-22
tags: ["http","caching","security"]
---
[Practical Web Cache Poisoning](https://portswigger.net/blog/practical-web-cache-poisoning) had me wondering about `Host` header validation in one application I was consulting on.  I decided to test against an internal endpoint that reflects back HTTP headers. I used `curl`'s [-H](https://curl.haxx.se/docs/manpage.html#-H) to lie about my `Host` and `X-Forwarded-*` headers and routed through an internal proxy server.

_Note: For these examples I replaced the real hostname with the reserved `example.com` from [Special-Use Domain Names](https://tools.ietf.org/html/rfc6761)._

```console
$ curl  -H "Host: poison0.example.com" -H "X-Forwarded-Host: poison1.example.com" \
-H "X-Forwarded-For: 1.1.1.1" -H "X-Forwarded-Proto: ftp" -H "X-Forwarded-Port: 8080" \
--proxy 10.20.30.40:5678 https://ci.int.example.com/api/internalsecurity/v1/requests
{
    "headers": {
        "x-amzn-trace-id": "Root=1-5b7db1ca-321c6f7616980480e520feb6",
        "x-forwarded-host": "poison0.example.com",
        "x-forwarded-proto": "https",
        "host": "poison0.example.com",
        "x-forwarded-port": "443",
        "connection": "close",
        "x-forwarded-for": "1.1.1.1, 10.20.30.40",
        "user-agent": "curl/7.58.0",
        "accept": "*/*"
    },
    "URI": "http://poison0.example.com/api/internalsecurity/v1/requests"
}
```

The AWS Application Load Balancers allow the `Host` header to pass through and correctly set the `X-Forwarded-*` headers on to the target.  The value for `X-Forwarded-For` is a chain of values that was appended to

Recently Amazon added "Redirect Rules" into Application Load Balancers and can preform the `www` to naked domain logic by matching on `Host` and triggering a redirect.  Additionally, you could require all load balancer targets to match a known hostname which has the effect of Host validation.  The load balancer is already indirectly aware of hostnames by the fact it has a TLS Certificate configured containing numerous `subjectAltName` DNS entries.

However, is it "better" to validate the `Host` by leveraging the virtual host functionality of `nginx.conf`?  This is already the place where the `Host` header value is copied to the `X-Forwarded-Host` header.   However, it may require specific `nginx.conf` files for each environment and regional deploy.

```nginx
server {
    server_name www.example.com;
    return 301 $scheme://example.com$request_uri;
}
server {
    server_name example.com;
    # [...]
}
```

[Server names](http://nginx.org/en/docs/http/server_names.html) from the nginx docs documents the strange name `_` which is "just one of a myriad of invalid domain names which never intersect with any real name."

```nginx
    # This is the default server that will 444 on requests that do not
    # have an acceptable host name as defined in external_domains.conf
    server {
        listen 8080;
        server_name _;
        return 444;
    }

    server {
        listen 8080;
        include ./external_domains.conf;
        # [...]
    }
```

In `external_domains.conf`, all the allowable `server_name`s are listed.

```nginx
server_name example.com
    example.net
    example.org
```

This configured worked in that it rejected "unwanted" `Host` headers.
