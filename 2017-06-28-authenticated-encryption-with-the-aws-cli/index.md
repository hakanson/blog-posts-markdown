---
title: Authenticated Encryption with the AWS CLI
slug: authenticated-encryption-with-the-aws-cli
author: Kevin Hakanson
date: 2017-06-28
tags: ["aws","aws cli","encryption"]
---
I wanted to understand [Authenticated Encryption](http://docs.aws.amazon.com/kms/latest/developerguide/crypto_authen.html) better, so I thought I would try and learn interactively.  First, I saved some "sensitive" data into a file.

```console
$ echo -n "P@ssword1" > pw1.txt
```

Then using [aws kms encrypt](http://docs.aws.amazon.com/cli/latest/reference/kms/encrypt.html) from the AWS CLI, I tried to encrypt one of the values.

```console
$ aws kms encrypt \
--key-id arn:aws:kms:us-west-2:123456789012:key/79cce4f6-7e4d-42ab-9942-9e6bb05b6121 \
--plaintext fileb://pw1.txt

An error occurred (NotFoundException) when calling the Encrypt operation: Invalid arn
```

Hmm, that didn't work despite using the full ARN (which includes the region). I need to set the AWS region explicitly and `--region` is one of the general options for the AWS CLI (see [AWS CLI Configuration Variables](http://docs.aws.amazon.com/cli/latest/topic/config-vars.html?highlight=region)).  If you didn't know about the region restriction, that error message wouldn't be very helpful.

```console
$ aws kms encrypt \
--region us-west-2 \
--key-id 79cce4f6-7e4d-42ab-9942-9e6bb05b6121 \
--plaintext fileb://pw1.txt

{
    "CiphertextBlob": "AQECAHizfom2LowDtrU53mpnuTkvNGUC8c+nPE8dtp40x+QLMAAAAGcwZQYJKoZIhvcNAQcGoFgwVgIBADBRBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDEubUtCeZ5dJiDjQ4QIBEIAkhYDNKHuwbu5FSxP1sknpWa5K0lOVnXBLIXg6K+ekvSyrOW+M",
    "KeyId": "arn:aws:kms:us-west-2:123456789012:key/79cce4f6-7e4d-42ab-9942-9e6bb05b6121"
}
```

If I encrypt it again, the `CiphertextBlob` value is different (but starts with many of the same characters).

```console
$ aws kms encrypt \
--region us-west-2 \
--key-id 79cce4f6-7e4d-42ab-9942-9e6bb05b6121 \
--plaintext fileb://pw1.txt

{
    "CiphertextBlob": "AQECAHizfom2LowDtrU53mpnuTkvNGUC8c+nPE8dtp40x+QLMAAAAGcwZQYJKoZIhvcNAQcGoFgwVgIBADBRBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDJyjJV/HtiuS0S8pFAIBEIAkMe2atLnrx1L2/TtuGx4hS+9bN/76AgaEkK5lvUbiCA+xhC+Y",
    "KeyId": "arn:aws:kms:us-west-2:123456789012:key/79cce4f6-7e4d-42ab-9942-9e6bb05b6121"
}
```

I went back to the original example from the AWS CLI documentation, and saved the binary, encrypted data to a file:

```console
$ aws kms encrypt \
--region us-west-2 \
--key-id 79cce4f6-7e4d-42ab-9942-9e6bb05b6121 \
--plaintext fileb://pw1.txt \
--output text \
--query CiphertextBlob \
| base64 --decode > ExampleEncryptedFile
```

Then it was time to decrypt and verify I could get my original data back.

```console
$ aws kms decrypt \
--ciphertext-blob fileb://ExampleEncryptedFile \
--output text \
--query Plaintext

An error occurred (AccessDeniedException) when calling the Decrypt operation: The ciphertext refers to a customer master key that does not exist, does not exist in this region, or you are not allowed to access.
```

Notice I didn't need to provide the KMS key id. However, I have the same region problem - but this time, I had an error message that gives me a hint.

```console
$ aws kms decrypt \
--region us-west-2 \
--ciphertext-blob fileb://ExampleEncryptedFile \
--output text \
--query Plaintext

UEBzc3dvcmQx
```

That worked but didn't look like my password.  I needed to base64 decode the value.

```console
$ aws kms decrypt \
--region us-west-2 \
--ciphertext-blob fileb://ExampleEncryptedFile \
--output text \
--query Plaintext \
| base64 --decode

P@ssword1
```

Back to Authenticated Encryption, where I need to provide a name-value pair that specifies the encryption context using the `--encryption-context` parameter.

```console
$ aws kms encrypt \
--region us-west-2 \
--key-id 79cce4f6-7e4d-42ab-9942-9e6bb05b6121 \
--encryption-context database_username=service1 \
--plaintext fileb://pw1.txt \
--output text \
--query CiphertextBlob \
| base64 --decode > ExampleAuthenticatedEncryptedFile
```

And for the decrypt, I need to provide the same `--encryption-context` parameter.

```console
$ aws kms decrypt \
--region us-west-2 \
--encryption-context database_username=service1 \
--ciphertext-blob fileb://ExampleAuthenticatedEncryptedFile \
--output text \
--query Plaintext \
| base64 --decode

P@ssword1
```

With an incorrect context, I get an `InvalidCiphertextException`.

```console
$ aws kms decrypt \
--region us-west-2 \
--encryption-context database_username=service2 \
--ciphertext-blob fileb://ExampleAuthenticatedEncryptedFile \
--output text \
--query Plaintext \
| base64 --decode

An error occurred (InvalidCiphertextException) when calling the Decrypt operation:
```

This begins to help me understand how to apply Authenticated Encryption to a story on Encrypted Properties and IAM Roles.
