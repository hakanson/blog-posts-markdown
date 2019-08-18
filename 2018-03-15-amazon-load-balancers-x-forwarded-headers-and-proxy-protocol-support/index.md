---
title: "Amazon Load Balancers: X-Forwarded Headers and Proxy Protocol Support"
slug: amazon-load-balancers-x-forwarded-headers-and-proxy-protocol-support
author: Kevin Hakanson
date: 2018-03-15
tags: ["aws","http"]
---
Amazon has multiple [Elastic Load Balancing](https://aws.amazon.com/elasticloadbalancing/) products:

* Application Load Balancer is best suited for load balancing of HTTP and HTTPS traffic and operates at the individual request level (Layer 7).
* Network Load Balancer is best suited for load balancing of TCP traffic and operates at the connection level (Layer 4).
* Classic Load Balancer is intended for applications that were built within the EC2-Classic network and operates at either Layer 7 or Layer 4.

Because load balancers intercept traffic between clients and servers, your server sees the IP address of the load balancer.  However, protocols exist to help your service identify the IP address of a client:

* Layer 7 uses [Forwarded](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Forwarded) HTTP header(s)  

    > The **Forwarded** header contains information from the client-facing side of proxy servers that is altered or lost when a proxy is involved in the path of the request.  
    >
    > The alternative and de-facto standard versions of this header are the [X-Forwarded-For](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For), [X-Forwarded-Host](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Host) and [X-Forwarded-Proto](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Proto) headers.

* Layer 4 uses the [PROXY protocol](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt).

    > The PROXY protocol provides a convenient way to safely transport connection information such as a client's address across multiple layers of NAT or TCP proxies. It is designed to require little changes to existing components and to limit the performance impact caused by the processing of the transported information.

Because AWS Classic Load Balancers operate at either Layer 7 or Layer 4, they support the both the X-Forwarded headers and the Proxy Protocol:

* [HTTP Headers and Classic Load Balancers - Elastic Load Balancing](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/x-forwarded-headers.html))
* [Configure Proxy Protocol Support for Your Classic Load Balancer - Elastic Load Balancing](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/enable-proxy-protocol.html))

AWS Network Load Balancers operate at Layer 4 and support the Proxy Protocol.

> [Target Groups for Your Network Load Balancers - Elastic Load Balancing](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-target-groups.html#proxy-protocol)  
> Network Load Balancers use Proxy Protocol version 2 to send additional connection information such as the source and destination. Proxy Protocol version 2 provides a binary encoding of the Proxy Protocol header.

AWS Application Load Balancers operate on Layer 7 and support the X-Forwarded headers.

> [How Elastic Load Balancing Works - Elastic Load Balancing](https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html)  
> Application Load Balancers and Classic Load Balancers support X-Forwarded-For, X-Forwarded-Proto, and X-Forwarded-Port headers.

Additional Resources:

* [Log the Public IP Addresses of a Client Behind a Load Balancer When Using Apache](https://aws.amazon.com/premiumsupport/knowledge-center/log-client-ip-load-balancer-apache/)
* [RFC 7239 - Forwarded HTTP Extension](https://tools.ietf.org/html/rfc7239)
* [NGINX Docs | Configuring NGINX to Accept the PROXY Protocol](https://docs.nginx.com/nginx/admin-guide/load-balancer/using-proxy-protocol/)
* [mod\_proxy\_protocol - Apache HTTP Server Version 2.4](https://roadrunner2.github.io/mod-proxy-protocol/mod_proxy_protocol.html)
