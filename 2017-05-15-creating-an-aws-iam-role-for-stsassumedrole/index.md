---
title: Creating an AWS IAM Role for sts:AssumedRole
slug: creating-an-aws-iam-role-for-stsassumedrole
author: Kevin Hakanson
date: 2017-05-15
tags: ["aws","aws iam"]
---
This post is a research summary of tasks relating to creating an IAM role via the CLI:

```console
$ aws iam create-role \
--role-name kjh-wildcard-test-role \
--assume-role-policy-document file://kjh-wildcard-test-role.iam.policy.json
```

The "trust policy" only included an explicit single member of the `204503-PowerUser` role: kevin.hakanson@example.com

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": [
          "arn:aws:sts::123456789012:assumed-role/204503-PowerUser/kevin.hakanson@example.com"
        ]
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

Test if it works via the CLI, and it does.

```console
$ aws sts assume-role \
--role-arn arn:aws:iam::123456789012:role/kjh-wildcard-test-role \
--role-session-name cli-kjh-wildcard-test-role
```

Update `~/.aws/config` to enable the `--profile` CLI option:

```ini
[profile kjh-wildcard-test-role]
role_arn = arn:aws:iam::123456789012:role/kjh-wildcard-test-role
source_profile = xx-sandbox
```

Try something "easy", like `get-role`

```console
$ aws iam --profile kjh-wildcard-test-role \
get-role --role-name kjh-wildcard-test-role

An error occurred (AccessDenied) when calling the GetRole operation: User: arn:aws:sts::123456789012:assumed-role/kjh-wildcard-test-role/AWS-CLI-session-1494616606 is not authorized to perform: iam:GetRole on resource: role kjh-wildcard-test-role
```

It didn't work because that new role has no permissions. Add an inline policy document via the console which lets this role get itself:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "Stmt1494616662000",
            "Effect": "Allow",
            "Action": [
                "iam:GetRole",
                "iam:GetRolePolicy"
            ],
            "Resource": [
                "arn:aws:iam::123456789012:role/kjh-wildcard-test-role"
            ]
        }
    ]
}
```

Try again and see a result. 

```console
$ aws iam --profile kjh-wildcard-test-role \
get-role --role-name kjh-wildcard-test-role

{
    "Role": {
        "AssumeRolePolicyDocument": {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Action": "sts:AssumeRole",
                    "Effect": "Allow",
                    "Principal": {
                        "AWS": "arn:aws:sts::123456789012:assumed-role/204503-PowerUser/kevin.hakanson@example.com"
                    }
                }
            ]
        },
        "RoleId": "AROAZZZZZZZZZZZZZZZZZ",
        "CreateDate": "2017-05-12T19:09:07Z",
        "RoleName": "kjh-wildcard-test-role",
        "Path": "/",
        "Arn": "arn:aws:iam::123456789012:role/kjh-wildcard-test-role"
    }
}
```

Since this only applies to kevin.hakanson@example.com, I'll try and expand to "everyone" in `204503-PowerUser`, but wildcards don't work here.

> An error occurred: Invalid principal in policy: "AWS":"arn:aws:sts::123456789012:assumed-role/204503-PowerUser/\*"

Instead, find the `RoleId` for `204503-PowerUser`

```console
$ aws iam get-role --role-name 204503-PowerUser

{
    "Role": {
        "AssumeRolePolicyDocument": {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Action": "sts:AssumeRoleWithSAML",
                    "Effect": "Allow",
                    "Condition": {
                        "StringEquals": {
                            "SAML:aud": "https://signin.aws.amazon.com/saml"
                        }
                    },
                    "Principal": {
                        "Federated": "arn:aws:iam::123456789012:saml-provider/ADFS"
                    }
                },
                {
                    "Action": "sts:AssumeRole",
                    "Effect": "Allow",
                    "Principal": {
                        "Service": "lambda.amazonaws.com"
                    }
                }
            ]
        },
        "RoleId": "AROAXXXXXXXXXXXXXXXXX",
        "CreateDate": "2017-04-05T14:28:24Z",
        "RoleName": "204503-PowerUser",
        "Path": "/204503/",
        "Arn": "arn:aws:iam::123456789012:role/204503/204503-PowerUser"
    }
}
```

Then add a `Condition` that uses `aws:userId`, which is based on `RoleId` mentioned above.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:root"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringLike": {
          "aws:userId": "AROAXXXXXXXXXXXXXXXXX:*"
        }
      }
    }
  ]
}
```

Try again and see a result that includes the new `AssumeRolePolicyDocument` section.

```console
$ aws iam --profile kjh-wildcard-test-role \
get-role --role-name kjh-wildcard-test-role

{
    "Role": {
        "AssumeRolePolicyDocument": {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Action": "sts:AssumeRole",
                    "Effect": "Allow",
                    "Condition": {
                        "StringLike": {
                            "aws:userId": "AROAXXXXXXXXXXXXXXXXX:*"
                        }
                    },
                    "Principal": {
                        "AWS": "arn:aws:iam::123456789012:root"
                    }
                }
            ]
        },
        "RoleId": "AROAZZZZZZZZZZZZZZZZZ",
        "CreateDate": "2017-05-12T19:09:07Z",
        "RoleName": "kjh-wildcard-test-role",
        "Path": "/",
        "Arn": "arn:aws:iam::123456789012:role/kjh-wildcard-test-role"
    }
}
```

Next steps are probably to automate as part of a Python script or CloudFormation template that creates these service roles, looking up the RoleId and building the trust policy there.