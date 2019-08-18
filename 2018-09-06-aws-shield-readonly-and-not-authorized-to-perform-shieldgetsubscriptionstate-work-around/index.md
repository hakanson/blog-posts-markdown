---
title: "AWS Shield, ReadOnly, and \"not authorized to perform: shield:GetSubscriptionState\" work-around"
slug: aws-shield-readonly-and-not-authorized-to-perform-shieldgetsubscriptionstate-work-around
author: Kevin Hakanson
date: 2018-09-06
tags: ["aws","aws iam","information security"]
---
As a "ReadOnly" user, if you go to try and look at [https://console.aws.amazon.com/waf/home#/ddp/onboard/info](https://console.aws.amazon.com/waf/home#/ddp/onboard/info), you may get blocked with this message:

> Identity and Access Management (IAM) policies currently restrict your access to the console. Contact your AWS administrator if you need help. If you are an AWS administrator, see the [AWS WAF documentation](http://docs.aws.amazon.com/waf/latest/developerguide/waf-iam.html).  
>
> User: arn:aws:sts::123456789012:assumed-role/projectID-ReadOnly/kevin.hakanson@example.com is not authorized to perform: shield:GetSubscriptionState on resource: arn:aws:shield::829215188275:subscription/\*

Jump directly to the summary page with [https://console.aws.amazon.com/waf/home#/ddp/summary](https://console.aws.amazon.com/waf/home#/ddp/summary) 

You can also verify the AWS Shield subscription using the AWS CLI, but make sure to target the `us-east-1` region (see [AWS Regions and Endpoints](https://docs.aws.amazon.com/general/latest/gr/rande.html#shield_region)).

```console
$ aws shield describe-subscription --region us-east-1
{
    "Subscription": {
        "StartTime": 1531749886.0,
        "EndTime": 1563372286.0,
        "TimeCommitmentInSeconds": 31622400,
        "AutoRenew": "ENABLED",
        "Limits": [
            {
                "Type": "ROUTE53_HOSTED_ZONE",
                "Max": 100
            },
            {
                "Type": "CF_DISTRIBUTION",
                "Max": 100
            },
            {
                "Type": "ELB_LOAD_BALANCER",
                "Max": 100
            },
            {
                "Type": "EC2_ELASTIC_IP_ALLOCATION",
                "Max": 100
            }
        ]
    }
}
```