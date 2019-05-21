---
title: Using the Virtual MFA Device with the AWS CLI
slug: using-the-virtual-mfa-device-with-the-aws-cli
author: Kevin Hakanson
date: 2017-10-22
tags: ["aws","aws cli","aws iam","information security"]
---
In [Creating and Using an AWS Virtual MFA Device with the AWS SDK for Python](../2017-10-21-creating-and-using-an-aws-virtual-mfa-device-with-python), some Python code was used to add a Virtual MFA Device to IAM User `kjh-SuperDuperUser` as well as use that to call [`STS.Client.assume_role`](http://boto3.readthedocs.io/en/latest/reference/services/sts.html#STS.Client.assume_role).  This document uses the AWS CLI to call [`assume-role`](http://docs.aws.amazon.com/cli/latest/reference/sts/assume-role.html) using the Virtual MFA Device.

As background, recall that `kjh-DuperRole` has this Trust Policy which requires MFA to be present for `sts:AssumeRole`.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:user/service-user/kjh-SuperDuperUser"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "Bool": {
          "aws:MultiFactorAuthPresent": "true"
        }
      }
    }
  ]
}
```

An attempt to assume role will fail (which is expected):

```console
$ aws --profile kjh-SuperDuperUser sts assume-role \
--role-arn arn:aws:iam::123456789012:role/kjh-DuperRole \
--role-session-name my-cli-session

An error occurred (AccessDenied) when calling the AssumeRole operation: User: arn:aws:iam::123456789012:user/service-user/kjh-SuperDuperUser is not authorized to perform: sts:AssumeRole on resource: arn:aws:iam::123456789012:role/kjh-DuperRole
```

However, when the MFA serial number and token code are supplied, there is a success.

```console
$ aws --profile kjh-SuperDuperUser sts assume-role \
--role-arn arn:aws:iam::123456789012:role/kjh-DuperRole \
--role-session-name my-cli-session \
--serial-number arn:aws:iam::123456789012:mfa/service-user/kjh-SuperDuperUser \
--token-code 000000

{

  "Credentials": {
    "AccessKeyId": "ASIAXXXXXXXXXXXXXXXX",
    "SecretAccessKey": "[redacted]",
    "SessionToken": "[redacted]",
    "Expiration": "2017-10-21T22:59:21Z"
  },
  "AssumedRoleUser": {
    "AssumedRoleId": "AROAXXXXXXXXXXXXXXXXX:my-cli-session",
    "Arn": "arn:aws:sts::123456789012:assumed-role/kjh-DuperRole/my-cli-session"
  }
}
```

Alternatively, a profile can be created in `~/.aws/config` which specifies both the `role_arn` and `mfa_serial`.

```ini
[profile kjh-DuperRole]
role_arn = arn:aws:iam::123456789012:role/kjh-DuperRole
source_profile = kjh-SuperDuperUser
mfa_serial = arn:aws:iam::123456789012:mfa/service-user/kjh-SuperDuperUser
```

This causes the AWS CLI to automatically assume-role and prompt for the MFA code (and store the temporary credentials in a file in the `~/.aws/cache/` directory).

```console
$ aws --profile kjh-DuperRole sts get-caller-identity
Enter MFA code: 000000
{
  "UserId": "AROAXXXXXXXXXXXXXXXXX:AWS-CLI-session-1508622621",
  "Account": "123456789012",
  "Arn": "arn:aws:sts::123456789012:assumed-role/kjh-DuperRole/AWS-CLI-session-1508622621"
}
```