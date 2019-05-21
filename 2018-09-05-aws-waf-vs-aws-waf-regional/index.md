---
title: AWS WAF vs AWS WAF Regional
slug: aws-waf-vs-aws-waf-regional
author: Kevin Hakanson
date: 2018-09-05
tags: ["aws","waf","information security"]
---
[Welcome - AWS WAF](https://docs.aws.amazon.com/waf/latest/APIReference/Welcome.html) lists separate API references for AWS WAF and AWS WAF Regional.  AWS WAF is "available for protecting Amazon CloudFront distributions" and AWSWAF Regional is "available for protecting Application Load Balancers."  These APIs are almost identical, except for Web ACL management:

* [AssociateWebACL](https://docs.aws.amazon.com/waf/latest/APIReference/API_regional_AssociateWebACL.html) / [DisassociateWebACL](https://docs.aws.amazon.com/waf/latest/APIReference/API_regional_DisassociateWebACL.html) (use WebACLId parameter of [UpdateDistribution - Amazon CloudFront](https://docs.aws.amazon.com/cloudfront/latest/APIReference/API_UpdateDistribution.html) )
* [ListResourcesForWebACL](https://docs.aws.amazon.com/waf/latest/APIReference/API_regional_ListResourcesForWebACL.html) (use [ListDistributionsByWebACLId - Amazon CloudFront](https://docs.aws.amazon.com/cloudfront/latest/APIReference/API_ListDistributionsByWebACLId.html) )

AWS WAF is available globally on CloudFront but only regionally on Application Load Balancers. From [AWS Regions and Endpoints - Amazon Web Services](https://docs.aws.amazon.com/general/latest/gr/rande.html#waf_region) (Sept 2018):

> ## AWS WAF
> AWS WAF for CloudFront distributions has a single endpoint: waf.amazonaws.com. It supports HTTPS requests only.
> | Region Name | Region | Endpoint | Protocol |
> | --- | --- | --- | --- |
> | US East (N. Virginia) | us-east-1 | waf.amazonaws.com | HTTPS |
> | Canada (Central) | ca-central-1 | waf.amazonaws.com | HTTPS |
> | EU (London) | eu-west-2 | waf.amazonaws.com | HTTPS |
>
> AWS WAF for Application Load Balancers has the following endpoints:
> | Region Name | Region | Endpoint | Protocol |
> | --- | --- | --- | --- |
> | US East (Ohio) | us-east-2 | waf-regional.us-east-2.amazonaws.com | HTTPS |
> | US East (N. Virginia) | us-east-1 | waf-regional.us-east-1.amazonaws.com | HTTPS |
> | US West (N. California) | us-west-1 | waf-regional.us-west-1.amazonaws.com | HTTPS |
> | US West (Oregon) | us-west-2 | waf-regional.us-west-2.amazonaws.com | HTTPS |
> | Asia Pacific (Tokyo) | ap-northeast-1 | waf-regional.ap-northeast-1.amazonaws.com | HTTPS |
> | Asia Pacific (Sydney) | ap-southeast-2 | waf-regional.ap-southeast-2.amazonaws.com | HTTPS |
> | EU (Frankfurt) | eu-central-1 | waf-regional.eu-central-1.amazonaws.com | HTTPS |
> | EU (Ireland) | eu-west-1 | waf-regional.eu-west-1.amazonaws.com | HTTPS |
> | AWS GovCloud (US) | us-gov-west-1 | waf-regional.us-gov-west-1.amazonaws.com | HTTPS

In addition to the documentation, other ways to look for supported regions are a CLI "list" operation or **nslookup** the DNS name.

```console
$ aws waf-regional list-ip-sets --region eu-west-2

Could not connect to the endpoint URL: "https://waf-regional.eu-west-2.amazonaws.com/"

$ nslookup waf-regional.eu-west-2.amazonaws.com
Server: 10.204.50.29
Address: 10.204.50.29#53

** server can't find waf-regional.eu-west-2.amazonaws.com: NXDOMAIN

$ nslookup waf-regional.us-west-2.amazonaws.com
Server: 10.204.50.29
Address: 10.204.50.29#53

Non-authoritative answer:
Name: waf-regional.us-west-2.amazonaws.com
Address: 52.94.210.110
```

These `waf-regional` API calls will return different results based on `--region`.

```console
$ aws waf-regional list-ip-sets --region us-east-1
{
    "NextMarker": "7ec3bad0-7b26-491e-affa-00a2718a7160",
    "IPSets": [
        {
            "IPSetId": "777f1102-1803-4730-b666-fc22c452a366",
            "Name": "project1-dev-match-blacklisted-ips"
        },
        {
            "IPSetId": "7ec3bad0-7b26-491e-affa-00a2718a7160",
            "Name": "project2-dev-match-blacklisted-ips"
        }
    ]
}

$ aws waf-regional list-ip-sets --region us-west-2
{
    "IPSets": []
}
```

But the `waf` API call is global and returns the same results, ignoring the CLI `--region` parameter

```console
$ aws waf list-ip-sets
```

[AWS Firewall Manager | Centralized WAF Management](https://aws.amazon.com/firewall-manager/) does not have a separate API, but likely uses [PutPermissionPolicy - AWS WAF](https://docs.aws.amazon.com/waf/latest/APIReference/API_regional_PutPermissionPolicy.html) to "share a RuleGroup across accounts."  A [RuleGroup](https://docs.aws.amazon.com/waf/latest/APIReference/API_regional_RuleGroup.html) is a "collection of predefined rules that you can add to a web ACL" and "subject to the following limits:"

> * Three rule groups per account. You can request an increase to this limit by contacting customer support.
> * One rule group per web ACL.
> * Ten rules per rule group.

To use [https://console.aws.amazon.com/waf/fms#/home](https://console.aws.amazon.com/waf/fms#/home) there are AWS Account level settings that need to be enabled:

> Your AWS account must be part of an organization in AWS Organizations, and the account must have the full feature set enabled. [Learn more](http://docs.aws.amazon.com/console/waf/fms-prereq)

> An AWS account must be set as an AWS Firewall Manager administrator. [Learn more](http://docs.aws.amazon.com/console/waf/fms-prereq)
