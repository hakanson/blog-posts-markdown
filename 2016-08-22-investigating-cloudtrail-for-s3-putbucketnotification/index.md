---
title: Investigating CloudTrail for S3 PutBucketNotification
slug: investigating-cloudtrail-for-s3-putbucketnotification
author: Kevin Hakanson
date: 2016-08-22
tags: ["aws","cloudtrail"]
---
I was investigating the types of CloudTrail events that are available for S3.  However, when I was comparing [Services Supported by CloudTrail API Activity History](http://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events-supported-services.html#view-cloudtrail-events-supported-apis-s3) against the [s3api — AWS CLI 1.10.58 Command Reference](http://docs.aws.amazon.com/cli/latest/reference/s3api/), I noticed something that confused me.

CloudTrail will log a bucket level API event for PutBucketNotification, but the CLI has `s3api` commands for both [`put-bucket-notification`](http://docs.aws.amazon.com/cli/latest/reference/s3api/put-bucket-notification.html) and [`put-bucket-notification-configuration`](http://docs.aws.amazon.com/cli/latest/reference/s3api/put-bucket-notification-configuration.html).  What is the difference?  Is the later not logged to CloudTrail? Digging into the documentation, I saw this description for `put-bucket-notification`:

> Deprecated, see the PutBucketNotificationConfiguraiton operation.

I tried it out and see what got logged.  First, I created a blank bucket notification configuration file:

```json
{  
    "TopicConfigurations": [],
    "QueueConfigurations": [],
    "LambdaFunctionConfigurations": []  
}  
```

Then I used the s3api CLI to put this configuration onto my S3 bucket:

```console
$ aws --profile saml s3api put-bucket-notification-configuration --bucket kjh-encryption-test1 --notification-configuration file://bucket-notification-configuration-blank.json
```

After a couple minutes, the event appears in CloudTrail as a `PutBucketNotification`. Here's the raw JSON you see if you click "View event":

```json
{  
   "eventVersion":"1.03",  
   "userIdentity":{  
      "type":"AssumedRole",  
      "principalId":"AROAXXXXXXXXXXXXXXXXX:kevin.hakanson@example.com",  
      "arn":"arn:aws:sts::123456789012:assumed-role/PowerUser/kevin.hakanson@example.com",  
      "accountId":"123456789012",  
      "accessKeyId":"ASIAXXXXXXXXXXXXXXXX",  
      "sessionContext":{  
         "attributes":{  
            "mfaAuthenticated":"false",  
            "creationDate":"2016-08-23T01:58:41Z"  
         },  
         "sessionIssuer":{  
            "type":"Role",  
            "principalId":"AROAXXXXXXXXXXXXXXXXX",  
            "arn":"arn:aws:iam::123456789012:role/PowerUser",  
            "accountId":"123456789012",  
            "userName":"PowerUser"  
         }  
      }  
   },  
   "eventTime":"2016-08-23T02:24:27Z",  
   "eventSource":"s3.amazonaws.com",  
   "eventName":"PutBucketNotification",  
   "awsRegion":"us-west-2",  
   "sourceIPAddress":"198.179.137.232",  
   "userAgent":"[aws-cli/1.10.43 Python/2.7.10 Darwin/14.5.0 botocore/1.4.33]",  
   "requestParameters":{  
      "bucketName":"kjh-encryption-test1",  
      "NotificationConfiguration":{  
         "xmlns":"http://s3.amazonaws.com/doc/2006-03-01/"  
      }  
   },  
   "responseElements":null,  
   "requestID":"BABEFFD87216E573",  
   "eventID":"3fb71544-ab01-433b-94df-651b808348fe",  
   "eventType":"AwsApiCall",  
   "recipientAccountId":"123456789012"  
}
```

Bonus:  If you noticed the typo above from the AWS CLI documentation, I created [Issue #2127 · aws/aws-cli · GitHub](https://github.com/aws/aws-cli/issues/2127).
