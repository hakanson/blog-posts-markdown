---
title: Database Credential Rotation in PostgreSQL
slug: /2018-04-09-database-credential-rotation-in-postgresql
author: Kevin Hakanson
date: 2018-04-09
tags: ["aws", "secretsmanager", "database", "security"]
---
I recently read [Rotate Amazon RDS database credentials automatically with AWS Secrets Manager](https://aws.amazon.com/blogs/security/rotate-amazon-rds-database-credentials-automatically-with-aws-secrets-manager/) and learned...

> Secrets Manager offers built-in integrations for MySQL, PostgreSQL, and Amazon Aurora on Amazon RDS, and can rotate credentials for these databases natively.

From listening to [SE-Radio Episode 311: Armon Dadgar on Secrets Management](http://www.se-radio.net/2017/12/se-radio-episode-311-armon-dadgar-on-secrets-management/), I understood that the "ideal" state being each instance gets their own credentials and that tools like [HashiCorp Vault](https://www.hashicorp.com/products/vault/) support this unique credentials feature as well as lease and expiration times.

In [Encrypted Properties and AWS IAM Roles](../2017-06-26-encrypted-properties-and-aws-iam-roles), I wrote about storing encrypted database passwords in a Config Server, from where the application microservices could read (and decrypt) the password after the DBA (encrypts and) sets it.  The automatic credential rotation above means that even the DBA doesn't know the password.

I was wondering if that would work for one of my application teams using RDS PostgreSQL.  I reached out to the DBA, who had been wanting automated password rotation in place for a while.  However, some of the microservices were "optimized" to access the Config Server during startup.  This meant that if the password were changed, that service would be broken until a restart.

Not being a PostgreSQL security expert, I wondered if there were concepts of users and roles.  In researching how to solve this problem, I found [Postgres Credential Rotation](http://davidhollenberger.com/2017/03/16/postgres-credential-rotation/) presented a possible solution.  Here is a snippet from that article:

> ```sql
> create role foo nologin;
> create role foo_a with encrypted password 'md5...' login;
> create role foo_b with encrypted password 'md5...' nologin;
> grant foo to foo_a;
> grant foo to foo_b;
> ```
>
> This gets us most of the way to a seamless credential rotation. The issue I ran into next was any new objects created by foo\_a or foo\_b users were owned by foo\_a and foo\_b respectively. To ensure all objects created by foo\_a and foo\_b are owned by the group user foo we need to override their default role.
>
> ```sql
> alter role foo_a set role foo;
> alter role foo_b set role foo;
> ```

The DBA agreed this model was workable as we already implemented the user and role pattern (albeit with a single user).  Adding additional users would require some modification to utility scripts but would work.
