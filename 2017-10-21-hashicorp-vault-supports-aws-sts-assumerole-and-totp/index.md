---
title: HashiCorp Vault supports AWS STS AssumeRole and TOTP
slug: hashicorp-vault-supports-aws-sts-assumerole-and-totp
author: Kevin Hakanson
date: 2017-10-21
tags: ["aws","aws iam","information security"]
---
The working security model for on-premise servers to access AWS resources is an IAM User which should only assume an IAM Role.  This makes the behavior similar to the Role-based permissions used by EC2 or Lambda.  This IAM User cannot log in onto the AWS Console, but uses an Access Key as long term credentials.  The call to `sts:AssumeRole` returns temporary security credentials that are valid for an hour. (see [Controlling Permissions for Temporary Security Credentials - AWS Identity and Access Management](http://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp_control-access.html)).

Reading about [Vault by HashiCorp](https://www.vaultproject.io/) highlighted two relevant features:

1. The [AWS Secret Backend](https://www.vaultproject.io/docs/secrets/aws/index.html#sts-assumerole) has built-in support for STS AssumeRole, which allows a `POST /aws/sts/:name` call to retrieve temporary credentials (see [AWS Secret Backend - HTTP API](https://www.vaultproject.io/api/secret/aws/index.html#generate-iam-with-sts) for full reference).  For internal teams that use Vault, this could allow the long term credentials (from the IAM User Access Key) to be securely stored once, and server instances request temporary security credentials as needed.
2. The [TOTP Secret Backend](https://www.vaultproject.io/docs/secrets/totp/index.html) allows Vault users to store their multi-factor authentication keys in Vault and use the API to retrieve time-based one-time use passwords on demand.  The **Using MFA with AssumeRole** section of [AssumeRole - AWS Security Token Service](https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html) explains how can optionally include multi-factor authentication (MFA) information when you call AssumeRole.  However, storage of the TOTP secret and generation of the TOTP code don't have an implemented solution.  If the secret is stored alongside the long term credentials, then it is as easy to steal two secrets, as it is one.
