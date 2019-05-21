---
title: AWS Identity-Based, Resource-Based, Resource-Level, and Tag-Based Permissions
slug: aws-identity-based-resource-based-resource-level-and-tag-based-permissions
author: Kevin Hakanson
date: 2017-04-25
tags: ["aws","aws iam"]
---
In [Overview of AWS IAM Permissions - AWS Identity and Access Management](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_permissions.html), they introduce identity-based and resource-based permissions:

> Permissions can be assigned in two ways: as _identity-based_ or as _resource-based_.

They also introduce the concept of resource-level permissions.

> There's a difference between _resource-based_ permissions and _resource-level_ permissions. Resource-based permissions are permissions you can attach directly to a resource, as described in this topic. Resource-level permissions refers to the ability to specify not just what actions users can perform, but which resources they're allowed to perform those actions on.

Resource-based permissions are being looked at to secure S3 and KMS, but not all services support these inline policies.

> Resource-based permissions are supported only by some AWS services. For a list of which services support resource-level permissions, see [AWS Services That Work with IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_aws-services-that-work-with-iam.html).

There is also the concept of tag-based permissions for those services that support testing resource tags in a `Condition` element.  However, in the list linked above, hardly any of the services support this.