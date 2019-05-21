---
title: Amazon RDS and Tag-Based Permissions
slug: amazon-rds-and-tag-based-permissions
author: Kevin Hakanson
date: 2017-04-27
tags: ["aws","aws iam"]
---
[AWS Identity-Based, Resource-Based, Resource-Level, and Tag-Based Permissions](../2017-04-25-aws-identity-based-resource-based-resource-level-and-tag-based-permissions) contains a link to [AWS Services That Work with IAM - AWS Identity and Access Management](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_aws-services-that-work-with-iam.html), which has the table of services supporting tag-based permissions.

Amazon RDS is one of those services. See [Using IAM Policy Conditions for Fine-Grained Access Control - Amazon Relational Database Service](http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAM.Conditions.html) for some example policies using condition keys with custom tags.

```json
"Condition":{
  "StringEquals":{
      "rds:db-tag/stage":[
        "development",
        "test"
      ]
  }
}
```

In the above example, the RDS tag identifier `db-tag` applies to "DB instances, including Read Replicas." The link above also has a table that lists the RDS tag identifiers that you can use in a `Condition` element.
