---
title: Making a secure connection to ElastiCache (Redis)
slug: making-a-secure-connection-to-elasticache-redis
author: Kevin Hakanson
date: 2018-06-27
tags: ["aws","redis","information security"]
---
In [Redis Security Investigation](../2018-06-22-redis-security-investigation), I recommended enabling both Encryption in-transit and Redis Auth.  Below is an ElastiCache Redis server I created to test against.  Note that instead of port 6379, I specified 6380 (which seems to be the common Redis "SSL" port).

[![](Redis Cluster Information)](images/pastedImage_2.png)

However, the `redis-cli` doesn't support encrypted connections so I had to install `stunnel` with help from [Using redis-cli with SSL/TLS | Compose Help](https://help.compose.com/docs/redis-and-redis-cli#section-using-redis-cli-with-ssltls) and [How to use redis-cli with Azure Redis Cache | Microsoft Docs](https://docs.microsoft.com/en-us/azure/redis-cache/cache-how-to-redis-cli-tool) to create my `stunnel.conf`.

```console
$ cat /etc/stunnel/stunnel.conf
pid = /run/stunnel-redis.pid

[redis-cli]
client = yes
accept = 127.0.0.1:6379
connect = master.a204503-kjh-auth.jbfxlf.use1.cache.amazonaws.com:6380
```

This allowed me to connect to localhost:6379 which would be an SSL proxy to the remote Redis server.  You can also see the connection is refused without the proper AUTH token.

```console
$ redis-cli -h 127.0.0.1 -p 6379 ping
(error) NOAUTH Authentication required.

$ redis-cli -h 127.0.0.1 -p 6379 -a [REDACTED] ping
PONG
```

Note: \[REDACTED\] isn't my real AUTH token. See [Selecting an ElastiCache (Redis) AUTH token](../2018-06-27-selecting-an-elasticache-redis-auth-token) for recommendations on this topic.

To show this is the server from the screenshot above, here are some select lines from the `info` command:

```console
$ redis-cli -h 127.0.0.1 -p 6379 -a [REDACTED] info
# Server
redis_version:4.0.10
redis_mode:standalone
os:Amazon ElastiCache
tcp_port:6380

# SSL
ssl_enabled:yes
```

[Redis and Python | Compose Help](https://help.compose.com/docs/redis-and-python) provided me with sample Python code I also tested with.

```python
import redis

# connection string and initialization
r = redis.StrictRedis(
    host='master.a204503-kjh-auth.jbfxlf.use1.cache.amazonaws.com',
    port=6380,
    password='[REDACTED]',
    ssl=True,
)

#test the connection
value = r.info()
print(value)
```

For Java users, Jedis can use the [rediss](https://www.iana.org/assignments/uri-schemes/prov/rediss) scheme to connect. Sample code derived from [jedis/SSLJedisTest.java](https://github.com/xetorthio/jedis/blob/master/src/test/java/redis/clients/jedis/tests/SSLJedisTest.java).

```java
  public void connectWithUrl() {
    // The "rediss" scheme instructs jedis to open a SSL/TLS connection.
    Jedis jedis = new Jedis("rediss://master.a204503-kjh-auth.jbfxlf.use1.cache.amazonaws.com:6380");
    jedis.auth("[REDACTED]");
    assertEquals("PONG", jedis.ping());
    jedis.close();
  }
```

For C# users, set [StackExchange.Redis](https://stackexchange.github.io/StackExchange.Redis/Configuration.html) ConfigurationOptions this way:

```csharp
var options = new ConfigurationOptions
{
    Endpoint = "master.a204503-kjh-auth.jbfxlf.use1.cache.amazonaws.com",
    // Endpoints without an explicit port will use 6379 if ssl is not enabled, and 6380 if ssl is enabled
    Password = "[Redacted]",
    Ssl = True
};
```