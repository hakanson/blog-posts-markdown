---
title: "IAM Roles: \"trust policy\" == \"assume role policy\""
slug: iam-roles-trust-policy-assume-role-policy
author: Kevin Hakanson
date: 2017-10-04
tags: ["aws","aws iam"]
---
Take a look at the screenshot below.  What's the name of this policy?

[!["Trust relationships" tab](images/pastedImage_4.png)](images/pastedImage_4.png)

If you said "trust relationships policy" or "trusted entities policy" then good luck finding the API to update it, where it is called the "assume role policy" document. Just to show how confusing the terms are, take this example from [update-assume-role-policy — AWS CLI 1.11.164 Command Reference](http://docs.aws.amazon.com/cli/latest/reference/iam/update-assume-role-policy.html):

> **To update the trust policy for an IAM role**
>
> The followingupdate-assume-role-policycommand updates the trust policy for the role namedTest-Role:
>
> > aws iam update-assume-role-policy --role-name Test-Role --policy-document file://Test-Role-Trust-Policy.json
>
> The trust policy is defined as a JSON document in the_Test-Role-Trust-Policy.json_file. (The file name and extension do not have significance.) The trust policy must specify a principal.
>
> To update the permissions policy for a role, use theput-role-policycommand.

It not only calls it a "trust policy", but the example policy document as "Trust-Policy" in the filename.  Maybe "assume role policy" was the legacy name, and no one wanted to rename the API?

Naming is hard!