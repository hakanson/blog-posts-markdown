---
title: AmazonS3EncryptionClient example
slug: amazons3encryptionclient-example
author: Kevin Hakanson
date: 2017-04-14
tags: ["aws","aws sdk","encryption"]
---
The following code uses the `AmazonS3EncryptionClient` from the `aws-java-sdk` to put an encrypted object into an S3 bucket.

```java
String bucketName = "kjh-encryption-test1";
String objectKey  = "sdk-s3/ExampleKMSEncryptedObject";
String kms_cmk_id = "79cce4f6-7e4d-42ab-9942-9e6bb05b6121"; //  "kjh-encryption-s3";

KMSEncryptionMaterialsProvider materialProvider = new KMSEncryptionMaterialsProvider(kms_cmk_id);

encryptionClient = new AmazonS3EncryptionClient(new ProfileCredentialsProvider(), materialProvider,
        new CryptoConfiguration().withKmsRegion(Regions.US_WEST_2))
        .withRegion(Region.getRegion(Regions.US_WEST_2));

// Upload object using the encryption client.
byte[] plaintext = "Hello World, S3 Client-side Encryption Using KMS!"
        .getBytes();
System.out.println("plaintext's length: " + plaintext.length);
encryptionClient.putObject(new PutObjectRequest(bucketName, objectKey,
        new ByteArrayInputStream(plaintext), new ObjectMetadata()));
```

Note: When you view this object in the S3 console, it shows "Encryption" as "None" because it was client-side encryption and not server-side.

> **Object**  
> Key: ExampleKMSEncryptedObject  
> Link: https://s3-us-west-2.amazonaws.com/kjh-encryption-test1/sdk-s3/ExampleKMSEncryptedObject
>
> **Properties**  
> Encryption: None

When you view the Metadata, you will see the tags the SDK uses to indicate client-side encryption (see [Appendix: Amazon S3 client-side encryption meta information](https://docs.aws.amazon.com/AWSJavaSDK/latest/javadoc/com/amazonaws/services/s3/package-summary.html)).

> **x-amz-meta-x-amz-cek-alg**: AES/CBC/PKCS5Padding  
> **x-amz-meta-x-amz-iv**: VeF05slNCyQ1jvAHXDyQyw==  
> **x-amz-meta-x-amz-key-v2**: AQEDAHizfom2LowDtrU53mpnuTkvNGUC8c+nPE8dtp40x+QLMAAAAH4wfAYJKoZIhvcNAQcGoG8wbQIBADBoBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDGsVDhAswrMNCD2PkwIBEIA7rka2dnMOLtAcqNRAShf4iXULv95cqPEjwrf9zEwjPraTfxUN9LFX8EyS3YajUe7N6flxORd0Ybs3ilg=  
> **x-amz-meta-x-amz-matdesc**: {"kms\_cmk\_id":"79cce4f6-7e4d-42ab-9942-9e6bb05b6121"}  
> **x-amz-meta-x-amz-wrap-alg**: kms

This uses a single KMS key, from a single AWS region.  The [aws-encryption-sdk-java](https://github.com/awslabs/aws-encryption-sdk-java) now allows for multiple KMS keys (see also [New AWS Encryption SDK for Python Simplifies Multiple Master Key Encryption | AWS Security Blog](https://aws.amazon.com/blogs/security/new-aws-encryption-sdk-for-python-simplifies-multiple-master-key-encryption/) )

However, check the [Frequently Asked Questions - AWS Encryption SDK](https://docs.aws.amazon.com/encryption-sdk/latest/developer-guide/faq.html#s3-encryption-client) about the difference between this and the S3 encryption client.

> **How is the AWS Encryption SDK different from the Amazon S3 encryption client?**
>
> The Amazon S3 encryption client in the [AWS SDK for Java](http://docs.aws.amazon.com/AWSJavaSDK/latest/javadoc/index.html?com/amazonaws/services/s3/AmazonS3EncryptionClient.html), [AWS SDK for Ruby](http://docs.aws.amazon.com/sdkforruby/api/Aws/S3/Encryption/Client.html), and [AWS SDK for .NET](http://docs.aws.amazon.com/sdkfornet/v3/apidocs/index.html?page=S3/TS3EncryptionS3EncryptionClient.html) provides encryption and decryption for data that you store in Amazon Simple Storage Service (Amazon S3). These clients are tightly coupled to Amazon S3 and are intended for use only with data stored there.
>
> The AWS Encryption SDK provides encryption and decryption for data that you can store anywhere. The AWS Encryption SDK and the Amazon S3 encryption client are not compatible because they produce ciphertexts with different data formats.

**Open Question**: What is the right pattern for multi-region client-side encryption of S3 objects using KMS?