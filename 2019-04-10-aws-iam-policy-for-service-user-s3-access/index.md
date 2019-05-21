---
title: AWS IAM Policy for Service User S3 Access
slug: aws-iam-policy-for-service-user-s3-access
author: Kevin Hakanson
date: 2019-04-10
tags: ["aws","aws iam"]
---
As a "security custodian" for some of my company's AWS accounts, I review requests for what we call "service users," including the AWS IAM Policy documents attached to those users. I prefer these to meet the [Principle of least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege) but demand they are not overly aggressive.   Recently, I received this proposed policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "s3:GetObject",
        "s3:ListBucket",
        "s3:PutObject"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::*"
    }
  ]
}
```

I replied that this would grant access to all S3 buckets and the `Resource` clause needed to be restricted to a specific bucket.  The requesting team responded with:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "s3:GetObject",
        "s3:ListBucket",
        "s3:PutObject"
      ],
      "Effect": "Allow",
      "Resource": [
         "arn:aws:s3:::project-bucket-name"
      ]
    }
  ]
}
```

I realized I should have sent a link to [Actions, Resources, and Condition Keys for Amazon S3](https://docs.aws.amazon.com/IAM/latest/UserGuide/list_amazons3.html) because some S3 Actions apply to S3 _Buckets_ and other to S3 _Objects_.  The ARN syntax for S3 Objects requires a slash ( `/` ) after the bucket name, where `/*` is the syntax for all objects.  The policy below includes a `Resource` array that includes both the Bucket and all the Objects.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "s3:GetObject",
        "s3:ListBucket",
        "s3:PutObject"
      ],
      "Effect": "Allow",
      "Resource": [
         "arn:aws:s3:::project-bucket-name",
         "arn:aws:s3:::project-bucket-name/*"
      ]
    }
  ]
}
```

Strictly speaking, the above syntax includes some `Action` and `Resource` combinations that are not valid, but I feel it is more readable (and smaller in size) than the more correct syntax.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "s3:ListBucket"
      ],
      "Effect": "Allow",
      "Resource": [
         "arn:aws:s3:::project-bucket-name"
      ]
    },
{
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Effect": "Allow",
      "Resource": [
         "arn:aws:s3:::project-bucket-name/*"
      ]
    }
  ]
}
```