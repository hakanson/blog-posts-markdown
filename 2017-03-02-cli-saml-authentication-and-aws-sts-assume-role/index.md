---
title: CLI SAML Authentication and AWS STS assume-role
slug: cli-saml-authentication-and-aws-sts-assume-role
author: Kevin Hakanson
date: 2017-03-02
tags: ["aws","aws iam"]
---
When I run a CLI based SAML log in (using an internal tool), I can select from the roles available to my account (e.g., PowerUser or ReadOnly).  I think of these as user roles.  However, IAM roles can also be created and assigned to EC2 instances or Lambda functions.  I was trying to understand how local code could run under one of those specific IAM roles.  I decided to try out [assume-role — AWS CLI 1.11.56 Command Reference](http://docs.aws.amazon.com/cli/latest/reference/sts/assume-role.html):

```console
$ aws sts assume-role \
--role-arn arn:aws:iam::123456789012:role/kjh-s3-encryption-test1-role \
--role-session-name cli-kjh-s3-encryption-test1-role

An error occurred (AccessDenied) when calling the AssumeRole operation: User: arn:aws:sts::123456789012:assumed-role/PowerUser/kevin.hakanson@example.com is not authorized to perform: sts:AssumeRole on resource: arn:aws:iam::123456789012:role/kjh-s3-encryption-test1-role
```

As you can see, that didn't work.  `PowerUser` has the authority to `sts:AssumeRole`, but I had to add myself to that role policy so my specific `Principal` could assume `kjh-s3-encryption-test1-role`.  The default was to only allow the EC2 service to do this.  You can see the full policy below.

```console
$ aws iam get-role --role kjh-s3-encryption-test1-role

{
    "Role": {
        "AssumeRolePolicyDocument": {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Action": "sts:AssumeRole",
                    "Effect": "Allow",
                    "Principal": {
                        "Service": "ec2.amazonaws.com"
                    }
                },
                {
                    "Action": "sts:AssumeRole",
                    "Effect": "Allow",
                    "Principal": {
                        "AWS": "arn:aws:sts::123456789012:assumed-role/PowerUser/kevin.hakanson@example.com"
                    }
                }
            ]
        },
        "RoleId": "AROAXXXXXXXXXXXXXXXXX",
        "CreateDate": "2016-08-13T16:31:08Z",
        "RoleName": "kjh-s3-encryption-test1-role",
        "Path": "/",
        "Arn": "arn:aws:iam::123456789012:role/kjh-s3-encryption-test1-role"
    }
}
```

After that change, I was able to perform an `AssumeRole`.

```console
$ aws sts assume-role \
--role-arn arn:aws:iam::123456789012:role/kjh-s3-encryption-test1-role \
--role-session-name cli-kjh-s3-encryption-test1-role

{
    "AssumedRoleUser": {
        "AssumedRoleId": "AROAXXXXXXXXXXXXXXXXX:cli-kjh-s3-encryption-test1-role",
        "Arn": "arn:aws:sts::123456789012:assumed-role/kjh-s3-encryption-test1-role/cli-kjh-s3-encryption-test1-role"
    },
    "Credentials": {
        "SecretAccessKey": "<secret>",
        "SessionToken": "<token>",
        "Expiration": "2017-03-01T22:41:37Z",
        "AccessKeyId": "ASIAXXXXXXXXXXXXXXXX"
    }
}
```

However, this wasn't as useful as I thought, since I would also need to create a profile and copy those credentials into my  `~/.aws/credentials` file.  Luckily, I discovered [Assuming a Role - AWS Command Line Interface](http://docs.aws.amazon.com/cli/latest/userguide/cli-roles.html) and just added a new profile section to my `~/.aws/config` that referenced that role ARN and my `saml` profile.

```ini
[profile kjh-s3-encryption-test1-role]
role_arn = arn:aws:iam::123456789012:role/kjh-s3-encryption-test1-role
source_profile = saml
```

After that, I was able to automatically assume that role with the CLI by specifying my new profile.

```console
$ aws s3api --profile kjh-s3-encryption-test1-role list-objects \
--bucket kjh-encryption-test1 \
--prefix cli-s3api-kms/

{
    "Contents": [
        {
            "LastModified": "2016-12-06T21:02:16.000Z",
            "ETag": "\"f3a07b31bc1cee5e70b6f0bbd9c5bf09\"",
            "StorageClass": "STANDARD",
            "Key": "cli-s3api-kms/QBF.txt.enc",
            "Size": 45
        }
    ]
}
```

Interestingly, when I run that same command with my `saml` profile, I got a different result:

```console
$ aws s3api --profile saml list-objects \
--bucket kjh-encryption-test1 \
--prefix cli-s3api-kms/

{
    "Contents": [
        {
            "LastModified": "2016-12-06T21:02:16.000Z",
            "ETag": "\"f3a07b31bc1cee5e70b6f0bbd9c5bf09\"",
            "StorageClass": "STANDARD",
            "Key": "cli-s3api-kms/QBF.txt.enc",
            "Owner": {
                "DisplayName": "redacted",
                "ID": "redacted"
            },
            "Size": 45
        }
    ]
}
```

Seeing the difference was the `Owner`, I added `s3:GetObjectAcl` to my policy using the AWS Console UI.  After that, I got the same result using either profile.  I also learned that if you want to see the policy document from the CLI, `get-policy` doesn't give you that information....

```console
$ aws iam get-policy --policy-arn arn:aws:iam::123456789012:policy/kjh-s3-encryption-test1

{
    "Policy": {
        "PolicyName": "kjh-s3-encryption-test1",
        "CreateDate": "2016-08-12T22:55:52Z",
        "AttachmentCount": 1,
        "IsAttachable": true,
        "PolicyId": "ANPAXXXXXXXXXXXXXXXXX",
        "DefaultVersionId": "v5",
        "Path": "/",
        "Arn": "arn:aws:iam::123456789012:policy/kjh-s3-encryption-test1",
        "UpdateDate": "2017-03-01T22:15:36Z"
    }
}

... so you need to use `get-policy-version` with the version id to get that policy document.

```console
$ aws iam get-policy-version \
--policy-arn arn:aws:iam::123456789012:policy/kjh-s3-encryption-test1 \
--version-id v5

{
    "PolicyVersion": {
        "CreateDate": "2017-03-01T22:15:36Z",
        "VersionId": "v5",
        "Document": {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Action": [
                        "s3:DeleteObject",
                        "s3:GetObject",
                        "s3:PutObject",
                        "s3:GetObjectAcl"
                    ],
                    "Resource": [
                        "arn:aws:s3:::kjh-encryption-test1/*"
                    ],
                    "Effect": "Allow"
                },
                {
                    "Action": [
                        "s3:ListBucket"
                    ],
                    "Resource": [
                        "arn:aws:s3:::kjh-encryption-test1"
                    ],
                    "Effect": "Allow"
                }
            ]
        },
        "IsDefaultVersion": true
    }
}
```

Hopefully, this will allow me to better understand and change IAM policies in order to apply the [Principle of least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege) and only grant the specific actions required.