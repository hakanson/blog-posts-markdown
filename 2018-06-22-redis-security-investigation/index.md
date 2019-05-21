---
title: Redis Security Investigation
slug: redis-security-investigation
author: Kevin Hakanson
date: 2018-06-22
tags: ["aws","redis","information security"]
---
The Securing Redis section from the [Redis Quick Start](https://redis.io/topics/quickstart#securing-redis) stresses applying network level security (firewalls), the `requirepass` option ([AUTH](https://redis.io/commands/auth) command), and SSL tunneling.  Additional details can be found by reading [A few things about Redis security](http://antirez.com/news/96) and [Redis Security – Redis](https://redis.io/topics/security).

Amazon VPC Security Groups and the ElastiCache Subnet Groups provide network security.  For data security, Amazon ElastiCache for Redis supports each of In-Transit Encryption (TLS), At-Rest Encryption, and AUTH for clusters running Redis version 3.2.6.

* [Now You Can Use Amazon ElastiCache for Redis with In-Transit and At-Rest Encryption to Help Protect Sensitive Information](https://aws.amazon.com/blogs/security/amazon-elasticache-now-supports-encryption-for-elasticache-for-redis/)
* [Open Sourcing Encryption in Transit for Redis | AWS Open Source Blog](https://aws.amazon.com/blogs/opensource/open-sourcing-encryption-in-transit-redis/)
* [Data Security - Amazon ElastiCache for Redis](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/encryption.html)

[Redis Java](https://redislabs.com/lp/redis-java/) lists both [Lettuce](https://github.com/mp911de/lettuce/) and [Jedis](https://github.com/xetorthio/jedis) as Java clients that support SSL connections.

Note: The [redis-cli](https://redis.io/topics/rediscli) supports the AUTH command (with the `-a password` parameter) but might not support SSL without [spiped](http://www.tarsnap.com/spiped.html).

Recommendations:

* Enable all ElastiCache Data Security Features (TLS, At-Rest, AUTH)
* Disable backups/snapshots for transient data
* Store AUTH token similar to other secrets (e.g. database passwords)
* Lockdown network access via VPC security groups to specific services requiring access
* Require a bastion service with audit logging (don't circumvent network security with routing backdoors)
