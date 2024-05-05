---
title: RDS IAM authentication and MySQL ERROR 1045
slug: /2024-05-03-rds-iam-authentication-and-mysql-error-1045
author: Kevin Hakanson
date: 2024-05-03
tags: ["aws","iam","database","cloud9"]
---

Are you trying to [connect to your MySQL DB instance using IAM authentication using the AWS CLI and mysql client](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.Connecting.AWSCLI.html) and getting this error?

> ERROR 1045 (28000): Access denied for user 'user1'@'172.31.9.140' (using password: YES)

Lucky you!  Well not lucky so far, but hopefully lucky now.  I fought with a scenario for longer than I will admit in public, but this post documents my struggle and how I ended up blaming [AWS Cloud9](https://aws.amazon.com/cloud9/).

✅ Watched [IAM Authentication with Amazon Aurora MySQL](https://www.youtube.com/watch?v=y2QsuwZGZ54) to see how everything works.

✅ [Created an IAM policy for database access](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.IAMPolicy.html) after finding DB instance resource ID using CLI

```bash
aws rds describe-db-instances --db-instance-identifier database-1-instance-1 | jq -r ".DBInstances[].DbiResourceId"
db-XXXXXXXXXXXXXXXXXXXXXXXXXX
```

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "rds-db:connect"
      ],
      "Resource": [
        "arn:aws:rds-db:us-east-1:123456789012:dbuser:db-XXXXXXXXXXXXXXXXXXXXXXXXXX/user1"
      ]
    }
  ]
}
```

Since I want to follow [Security best practices for Amazon RDS for MySQL and MariaDB instances](https://aws.amazon.com/blogs/database/security-best-practices-for-amazon-rds-for-mysql-and-mariadb-instances/), my database is only accessible from its VPC. I created a Cloud9 instance with the right security groups to access the database host and port.

✅ Downloaded the [Certificate bundles for all AWS Regions](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html) to Cloud9 using `wget`

```bash
wget https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem
```

✅ Connected to database as `admin` without having my password appear in `.bash_history`

```bash
RDSHOST="database-1.cluster-xxxxxxxxxxxx.us-east-1.rds.amazonaws.com"
mysql --host=$RDSHOST --port=3306 --ssl-ca=global-bundle.pem  --user=admin --password=$(read -s;echo $REPLY)
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MySQL connection id is 8128
Server version: 8.0.28 Source distribution

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MySQL [(none)]>
```

✅ Create `user1` in the database using IAM authentication

```sql
CREATE USER user1 IDENTIFIED WITH AWSAuthenticationPlugin as 'RDS';
ALTER USER 'user1'@'%' REQUIRE SSL;
```

✅ Generated token using bash command copied from [Connecting to a DB instance](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.Connecting.AWSCLI.html)

```bash
TOKEN="$(aws rds generate-db-auth-token --hostname $RDSHOST --port 3306 --region us-east-1 --username user1 )"
```

❌ Failed to connect to database using `$TOKEN`

```bash
mysql --host=$RDSHOST --port=3306 --ssl-ca=global-bundle.pem  --user=user1 --password=$TOKEN
ERROR 1045 (28000): Access denied for user 'user1'@'172.31.9.140' (using password: YES)
```

✅ Verified from RDS logs that I connected to the database

`RDS > Databases > database-1 > database-1-instance-1 > error/mysql-error.log`

> 2024-05-03T00:00:00.000000Z 5281 [Note] [MY-010926] [Server] Access denied for user 'user1'@'172.31.9.140' (using password: YES) (sql_authentication.cc:1412)

This must be an IAM issue - I even changed the IAM policy to use resource `arn:aws:rds-db:us-east-1:123456789012:dbuser:*/*` and after another `aws rds generate-db-auth-token` there was still access denied.

✅ Verified `user1` was created correctly

```text
MySQL [(none)]> SELECT User, Host, plugin, authentication_string FROM mysql.user WHERE user = "user1";
+-------+------+-------------------------+-----------------------+
| User  | Host | plugin                  | authentication_string |
+-------+------+-------------------------+-----------------------+
| user1 | %    | AWSAuthenticationPlugin | RDS                   |
+-------+------+-------------------------+-----------------------+
1 row in set (0.063 sec)
```

✅ Be confused, but eventually blame [AWS managed temporary credentials](https://docs.aws.amazon.com/cloud9/latest/user-guide/security-iam.html#auth-and-access-control-temporary-managed-credentials) and their restrictions on `iam` and `sts` actions.

I temporarily solved this by running `aws rds generate-db-auth-token` outside of Cloud9, copying that string value, and pasting into my Cloud9 terminal session (e.g. `TOKEN="<pasted token>"`).  After that I was able to connect as expected and have the [`SELECT CURRENT_USER()`](https://dev.mysql.com/doc/refman/8.0/en/information-functions.html#function_current-user) to prove it.

```text
MySQL [(none)]> SELECT CURRENT_USER();
+----------------+
| CURRENT_USER() |
+----------------+
| user1@%        |
+----------------+
1 row in set (0.073 sec)
```
