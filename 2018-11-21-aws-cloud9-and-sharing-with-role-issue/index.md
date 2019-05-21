---
title: AWS Cloud9 and Sharing with Role Issue
slug: aws-cloud9-and-sharing-with-role-issue
author: Kevin Hakanson
date: 2018-11-21
tags: ["aws","aws iam", "ide"]
---
A co-worker and I were investigating [AWS Cloud9](https://aws.amazon.com/cloud9/) and the ability to share environments.  However, when you do a **Window - Share...** from inside the environment, you get this dialog:

[![](images/pastedImage_3.png)](images/pastedImage_3.png)

However, we are not using IAM users, but roles assumed via SAML.

```console
$ aws sts get-caller-identity
{
    "Account": "123456789012",
    "UserId": "AROAXXXXXXXXXXXXXXXXX:kevin.hakanson@example.com",
    "Arn": "arn:aws:sts::123456789012:assumed-role/projectID-PowerUser/kevin.hakanson@example.com"
}
```

However, I know that all AWS features have an API and can be called via the AWS CLI, so I thought I would just call [create-environment-membership](https://docs.aws.amazon.com/cli/latest/reference/cloud9/create-environment-membership.html) from the Cloud9 IDE integrated terminal.

```console
$ aws --version
aws-cli/1.15.83 Python/2.7.14 Linux/4.14.72-68.55.amzn1.x86_64 botocore/1.10.82

$ aws ec2 describe-instances \
--instance-id $(curl -s http://169.254.169.254/latest/meta-data/instance-id) \
--query "Reservations[*].Instances[*].Tags[?Key=='aws:cloud9:environment'].Value" \
--output text
6a26600d70aa41cd9b81bdb662b1c715

$ aws cloud9 describe-environment-memberships --environment-id 6a26600d70aa41cd9b81bdb662b1c715
{
    "memberships": [
        {
            "environmentId": "6a26600d70aa41cd9b81bdb662b1c715", 
            "lastAccess": 1542842576.0, 
            "userId": "AROAXXXXXXXXXXXXXXXXX:kevin.hakanson@example.com", 
            "userArn": "arn:aws:sts::123456789012:assumed-role/projectID-PowerUser/kevin.hakanson@example.com", 
            "permissions": "owner"
        }
    ]
}
```

But it didn't work as expected when I tried to add my trusted coworker. Adding the **\--debug** flag didn't give me any more info.

```console
$ aws cloud9 create-environment-membership \
--environment-id 6a26600d70aa41cd9b81bdb662b1c715 \
--user-arn arn:aws:sts::123456789012:assumed-role/projectID-PowerUser/trusted.coworker@example.com \
--permissions read-only

An error occurred (UnrecognizedClientException) when calling the CreateEnvironmentMembership operation: The security token included in the request is invalid
```

When I went to a terminal on my Mac and tried the same command (as the same assumed role), it succeeded.  So, it doesn't seem like an IAM permission issue for my role.

```console
$ aws sts get-caller-identity
{
    "UserId": "AROAXXXXXXXXXXXXXXXXX:kevin.hakanson@example.com",
    "Account": "123456789012",
    "Arn": "arn:aws:sts::123456789012:assumed-role/projectID-PowerUser/kevin.hakanson@example.com"
}

$ aws cloud9 create-environment-membership \
--environment-id 6a26600d70aa41cd9b81bdb662b1c715 \
--user-arn arn:aws:sts::123456789012:assumed-role/projectID-PowerUser/trusted.coworker@example.com \
--permissions read-only --region us-east-2
{
    "membership": {
        "permissions": "read-only",
        "userId": "AROAXXXXXXXXXXXXXXXXX:trusted.coworker@example.com",
        "userArn": "arn:aws:sts::123456789012:assumed-role/projectID-PowerUser/trusted.coworker@example.com",
        "environmentId": "6a26600d70aa41cd9b81bdb662b1c715"
    }
}
```

Back in the Cloud9 IDE terminal, I checked and saw the membership was updated.

```console
$ aws cloud9 describe-environment-memberships --environment-id 6a26600d70aa41cd9b81bdb662b1c715
{
    "memberships": [
        {
            "environmentId": "6a26600d70aa41cd9b81bdb662b1c715",
            "userId": "AROAXXXXXXXXXXXXXXXXX:trusted.coworker@example.com",
            "userArn": "arn:aws:sts::123456789012:assumed-role/projectID-PowerUser/trusted.coworker@example.com",
            "permissions": "read-only"
        },
        {
            "environmentId": "6a26600d70aa41cd9b81bdb662b1c715",
            "lastAccess": 1542846944.0,
            "userId": "AROAXXXXXXXXXXXXXXXXX:kevin.hakanson@example.com",
            "userArn": "arn:aws:sts::123456789012:assumed-role/projectID-PowerUser/kevin.hakanson@example.com",
            "permissions": "owner"
        }
    ]
}
```

I'm not sure what went wrong.  There is no record in CloudTrail, but when I look at [CloudTrail Unsupported Services](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-unsupported-aws-services.html) I see AWS Cloud9 listed.  I did find in the [Actions Supported by AWS Managed Temporary Credentials](https://docs.aws.amazon.com/cloud9/latest/user-guide/auth-and-access-control.html#auth-and-access-control-temporary-managed-credentials-supported) for AWS Cloud9 EC2 development environments that there is an IAM restriction that could be responsible.

> All IAM actions that interact with roles are allowed only for role names starting with Cloud9-.

This looks like an AWS Enterprise Support question - but a lower priority because I have a workaround (and it is Thanksgiving tomorrow and re:Invent next week).

**Update:**  Working with AWS Support, we realized I could add a role using the full arn via the UI. I closed my case with the suggestion that the "help text" on that "share this environment" screen should  be updated not just to reference "IAM username" but give an indication that a full ARN (include role) could be used.