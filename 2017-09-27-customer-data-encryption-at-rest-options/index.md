---
title: Customer Data Encryption-At-Rest Options
slug: customer-data-encryption-at-rest-options
author: Kevin Hakanson
date: 2017-09-27
tags: ["aws", "encryption", "information security"]
---
This post is going to enumerate some customer data encryption-at-rest options for those customers asking about specific key management choices.  Examples below will refer to AWS specific technologies.

## No Encryption

Although this option may have been used in the past, it is no longer acceptable for applications.  Listed here for completeness.

## Transparent

This leverages software like disk encryption (e.g. BitLocker or Vormetric), database encryption (e.g. [Transparent Data Encryption (TDE)](https://docs.microsoft.com/en-us/sql/relational-databases/security/encryption/transparent-data-encryption) ), or Amazon managed keys (see [Encryption for Amazon RDS using keys managed in AWS Key Management Service](https://aws.amazon.com/about-aws/whats-new/2015/01/06/amazon-rds-encryption-with-kms-mysql-postgresql/) or [Protecting Data Using Server-Side Encryption with Amazon S3-Managed Encryption Keys (SSE-S3)](http://docs.aws.amazon.com/AmazonS3/latest/dev/UsingServerSideEncryption.html)) to transparently encrypt data being stored.  This "checks the box" when customers ask about encryption.

## Managed Keys

A Key Management Service (KMS) is used to handle encryption keys for the application.  These keys may be both region and data store specific.  The application team is responsible for safeguarding, managing, and rotating these keys.  This can be used along with [envelope encryption](http://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#enveloping) to protect data at the object or field level further.

## Customer Specific, Managed Keys

The features of Managed Keys apply, but these keys are customer specific.  This may also imply that data is not able to be stored in a multi-tenant database (which the application code would need to support).  Separate keys could allow customers to monitor an event stream for key rotation and encryption/decryption operations.  Costs for extra keys and separate hardware could be passed on to the customer.

## Customer Specific, Customer Managed Keys

Similar to Managed Keys, the customer manages these keys in their AWS account (e.g., [How to Use an External ID When Granting Access to Your AWS Resources to a Third Party](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user_externalid.html)).  This also introduces an operational dependency between our application the customer managed key, which could result in loss of functionality or data and would affect support and contractual agreements like service level agreement (SLA).  Customers would also need to understand that the application has access to the unencrypted data, and this does not imply separate application servers or processing engines.

## Pre Encryption

With this option, Thomson Reuters never sees unencrypted versions of data. However, this results in significant functionality loss and treats applications like a raw data store.  Since no processing nor business value can be applied to the data, this has limited customer value as well.  This is an unlikely option.

## Diagram

[![Encryption Options](images/EncryptionOptions.png)](images/EncryptionOptions.png)
