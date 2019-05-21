---
title: AWS sts:AssumeRole and Condition Keys
slug: aws-stsassumerole-and-condition-keys
author: Kevin Hakanson
date: 2017-04-19
tags: ["aws","aws iam"]
---
In wondering how to restrict roles to only allowed to be assumed from specific EC2 instances, I found [Actions and Condition Context Keys for AWS Security Token Service - AWS Identity and Access Management](http://docs.aws.amazon.com/IAM/latest/UserGuide/list_sts.html), which lists the `Action` key that is used to assume role:

* [sts:AssumeRole](http://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html)

Here is an example of a trust policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

It doesn’t look like any `Condition` keys can be applied here based on:

> **Condition context keys for AWS Security Token Service**
>
> AWS Security Token Service has no service-specific context keys that can be used in an IAM policy. For the list of the global condition context keys that are available to all services, see [Available Global Condition Keys](http://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html#AvailableKeys) in the _IAM Policy Elements Reference_.

Maybe some of these Global Condition Keys could be used?

* **aws:SourceArn**
* **aws:userid**