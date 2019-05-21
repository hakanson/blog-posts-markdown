---
title: Amazon RDS and IAM Policy Notes
slug: amazon-rds-and-iam-policy-notes
author: Kevin Hakanson
date: 2017-08-24
tags: ["aws","aws iam"]
---
As a follow up to [Amazon RDS and Tag-Based Permissions](../2017-04-27-amazon-rds-and-tag-based-permissions), this document digs into an IAM policy that restricts by tag value.

Took a look at the AWS Managed (Predefined) Policies for Amazon RDS, including `AmazonRDSFullAccess` (see [Using Identity-Based Policies (IAM Policies) for Amazon RDS](http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAM.AccessControl.IdentityBased.html)), which includes `Action` `rds:*` for `Resource` `*`.

The following are the general formats for ARNs; the specific components and values used depend on the AWS service. (see [Amazon Resource Names (ARNs) and AWS Service Namespaces](http://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html#genref-arns) )

> arn:partition:service:region:account-id:resource  
> arn:partition:service:region:account-id:resourcetype/resource  
> arn:partition:service:region:account-id:resourcetype:resource

RDS has 11 ARN resource types (see [Amazon Resource Names (ARNs) and AWS Service Namespaces](http://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html#arn-syntax-rds)).

> arn:aws:rds:region:account-id:db:db-instance-name  
> arn:aws:rds:region:account-id:snapshot:snapshot-name  
> arn:aws:rds:region:account-id:cluster:db-cluster-name  
> arn:aws:rds:region:account-id:cluster-snapshot:cluster-snapshot-name  
> arn:aws:rds:region:account-id:og:option-group-name  
> arn:aws:rds:region:account-id:pg:parameter-group-name  
> arn:aws:rds:region:account-id:cluster-pg:cluster-parameter-group-name  
> arn:aws:rds:region:account-id:secgrp:security-group-name  
> arn:aws:rds:region:account-id:subgrp:subnet-group-name  
> arn:aws:rds:region:account-id:es:subscription-name

Each RDS resource type has its own tag name, like `db-tag` or `cluster-tag` (see [Amazon RDS API Permissions: Actions, Resources, and Conditions Reference](http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAM.ResourcePermissions.html)).

I tried to add `StringEqualsIfExists` for each RDS tag type, but fails with duplicate keys for `StringEqualsIfExists`.

```json
"Condition": {
  "StringEqualsIfExists": {
    "rds:db-tag/xx:project-id": "123456"
  },
  "StringEqualsIfExists": {
    "rds:cluster-tag/xx:project-id": "123456"
  },
```

_Note_: "You cannot use a wildcard in the portion of the ARN that specifies the resource type" (see [Amazon Resource Names (ARNs) and AWS Service Namespaces](http://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html#arns-paths) ).  Since `rds` is service namespace and `db` or `snapshot` is the resource type, this syntax won't work.

```json
"Resource": [
  "arn:aws:rds:*:*:*:123456-*",
```

Therefore, you need to wildcard on resource name prefix (assuming all RDS resources are customer nameable vs. generated).

```json
"Resource": [
  "arn:aws:rds:*:*:db:123456-*",
  "arn:aws:rds:*:*:cluster:123456-*",
  "arn:aws:rds:*:*:es:123456-*",
  "arn:aws:rds:*:*:og:123456-*",
  "arn:aws:rds:*:*:pg:123456-*",
  "arn:aws:rds:*:*:cluster-pg:123456-*",
  "arn:aws:rds:*:*:secgrp:123456-*",
  "arn:aws:rds:*:*:subgrp:123456-*",
  "arn:aws:rds:*:*:snapshot:123456-*",
  "arn:aws:rds:*:*:cluster-snapshot:123456-*",
  "arn:aws:rds:*:*:ri:123456-*"
]
```

_Note_:  "Policies have a maximum size between 2048 characters and 10,240 characters, depending on what entity the policy is attached to." (see [Grammar of the IAM Policy Language](http://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_grammar.html)).

```json
{
     "Effect": "Allow",
     "Action": [
          "rds:*"
     ],
     "Resource": [
          "arn:aws:rds:*:123456789012:db:*"
     ],
     "Condition": {
          "StringEqualsIfExists": {
               "rds:db-tag/xx:project-id": "123456"
          }
     }
},
{
     "Effect": "Allow",
     "Action": [
          "rds:*"
     ],
     "Resource": [
          "arn:aws:rds:*:123456789012:cluster:*"
     ],
     "Condition": {
          "StringEqualsIfExists": {
               "rds:cluster-tag/xx:project-id": "123456"
          }
     }
},
```