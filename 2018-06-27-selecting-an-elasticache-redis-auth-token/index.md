---
title: Selecting an ElastiCache (Redis) AUTH token
slug: selecting-an-elasticache-redis-auth-token
author: Kevin Hakanson
date: 2018-06-27
tags: ["aws","redis","information security"]
---
[Redis Security](https://redis.io/topics/security) highlights some items about selecting an AUTH token (password).

> It should be long enough to prevent brute force attacks for two reasons:
> 
> * Redis is very fast at serving queries. Many passwords per second can be tested by an external client.
> * The Redis password is stored inside the `redis.conf` file and inside the client configuration, so it does not need to be remembered by the system administrator, and thus it can be very long.

From [Authenticating Users with Redis AUTH - Amazon ElastiCache for Redis](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/auth.html) we see some additional AUTH constraints.

> **AUTH Token Constraints when using with ElastiCache**
> * Passwords must be at least 16 and a maximum of 128 printable characters.
> * The only permitted printable special characters are !, &, #, $, ^, <, >, and -. Other printable special characters cannot be used in the AUTH token.
> * AUTH can only be enabled when creating clusters where in-transit encryption is enabled.
> * The password set at cluster creation cannot be changed.

Since the special character set is limited, it makes sense to avoid them but generate a very long password.  This also has the side benefit of allowing a "double click" on the string to select it (which is usually hard with interior punctuation).  Below is an AWS CLI command that uses [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/) to generate that random string.

```console
$ aws secretsmanager get-random-password --password-length 128 --exclude-punctuation 
{
    "RandomPassword": "FiXWVSsPAJmA1y4c6E63pc9p4YgM4m0lJzTVeRZD0hyJTiYPqZD5YkToDxBHX9N2APQqhnqVXYNipIkErKByFD9Gx38rbF5vE80z28u2v9NGD9vZz6GtgnElS1yqAfMk"
}
```

This secret is needed in plaintext during ElasticCache creation.  It should then be KMS encrypted and stored  in Secrets Manager, the microservice needing access to Redis can retrieve it.

Note: I was glad to see the usage of `time_independent_strcmp` to avoid timing attacks in [redis/server.c](https://github.com/antirez/redis/blob/3.2/src/server.c#L2683)

```c
void authCommand(client *c) {
    if (!server.requirepass) {
        addReplyError(c,"Client sent AUTH, but no password is set");
    } else if (!time_independent_strcmp(c->argv[1]->ptr, server.requirepass)) {
      c->authenticated = 1;
      addReply(c,shared.ok);
    } else {
      c->authenticated = 0;
      addReplyError(c,"invalid password");
    }
}
```