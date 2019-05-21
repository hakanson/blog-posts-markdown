---
title: How IAM Roles Become Credentials on EC2
slug: how-iam-roles-become-credentials-on-ec2
author: Kevin Hakanson
date: 2016-08-15
tags: ["aws","aws iam"]
---
While investigating how to secure S3 buckets using IAM Roles, I was curious how the IAM Role assigned to my EC2 instance became the credentials an AWS based application could use.  IAM Roles for EC2 are the recommended practices, but how they worked was "magic" to me.

First, I created an IAM Role with a policy that allowed Get, Put, and Delete access to my S3 bucket.

```json
{  
    "Version": "2012-10-17",  
    "Statement": [  
        {  
            "Sid": "Stmt1471042403000",  
            "Effect": "Allow",  
            "Action": [  
                "s3:DeleteObject",  
                "s3:GetObject",  
                "s3:PutObject"  
            ],  
            "Resource": [  
                "arn:aws:s3:::kjh-encryption-test1/*"  
            ]  
        }  
    ]  
}  
```

Then, I created an EC2 instance and assigned that IAM role:

[![](images/pastedImage_2.png)](images/pastedImage_2.png)

I connected to my instance over SSH...

```console
ssh -i kjh-tax-sandbox.pem ec2-user@54.200.155.114
```

...and on that instance, I followed the instruction from [IAM Roles for Amazon EC2 - Amazon Elastic Compute Cloud](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html#instance-metadata-security-credentials) to get the credentials the same way the AWS SDK does:

```console
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/kjh-s3-encryption-test1-role  
{  
  "Code" : "Success",  
  "LastUpdated" : "2016-08-13T16:36:13Z",  
  "Type" : "AWS-HMAC",  
  "AccessKeyId" : "ASIAJ27C6XNOZEXAMPLE",  
  "SecretAccessKey" : "rrGyOOa3TPLJQIIedUfW5hbCzPXb+EXAMPLEKEY",  
  "Token" : "TOKEN",  
  "Expiration" : "2016-08-13T23:09:05Z"  
}  
```

For a test, I edited my local `.aws/credentials` to add a new profile to match that ec2role

```ini
[ec2role]  
aws_access_key_id = ASIAJ27C6XNOZEXAMPLE  
aws_secret_access_key = rrGyOOa3TPLJQIIedUfW5hbCzPXb+EXAMPLEKEY  
aws_session_token = TOKEN
```

Then, from my local machine, I did an upload using the AWS CLI S3 command and specifying that new `ec2role` profile.

```console
$ aws --profile ec2role s3 cp quickbrownfox.txt s3://kjh-encryption-test1/cli-s3-sse/ --sse  
upload: ./quickbrownfox.txt to s3://kjh-encryption-test1/cli-s3-sse/quickbrownfox.txt
```

Back on the EC2 instance, I downloaded that same file, but using the default profile

```console
$ aws s3 cp s3://kjh-encryption-test1/cli-s3-sse/quickbrownfox.txt quickbrownfox.txt  
download: s3://kjh-encryption-test1/cli-s3-sse/quickbrownfox.txt to ./quickbrownfox.txt  
```

Everything worked as expected.  AWS took care of supplying IAM credentials to an EC2 instance in a way the AWS SDK could find them.  However, since I had root access via SSH, it was also easy for me to "steal" my own credentials and access that S3 bucket from outside the VPC.  For protecting customer data stored in S3, additional controls like [VPC Endpoints](http://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/vpc-endpoints.html) or [Using Server-Side Encryption with Customer-Provided Encryption Keys (SSE-C)](https://docs.aws.amazon.com/AmazonS3/latest/dev/ServerSideEncryptionCustomerKeys.html) should be considered.