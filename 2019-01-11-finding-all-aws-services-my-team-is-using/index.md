---
title: Finding all AWS Services my Team is Using
slug: finding-all-aws-services-my-team-is-using
author: Kevin Hakanson
date: 2019-01-11
tags: ["aws","python","aws iam"]
---
I was reading [Automate analyzing your permissions using IAM access advisor APIs | AWS Security Blog](https://aws.amazon.com/blogs/security/automate-analyzing-permissions-using-iam-access-advisor/) and realized it would also be way see what AWS features one of my project teams (a.k.a. redacted-project) was using.

So, I put together a Python script to call [generate\_service\_last\_accessed\_details](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/iam.html#IAM.Client.generate_service_last_accessed_details) / [get\_service\_last\_accessed\_details](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/iam.html#IAM.Client.get_service_last_accessed_details)  then sorted by the most recent LastAuthenticated date to get the ServiceName list.

```
2019-01-11 20:23:00+00:00 AWS CodeCommit
2019-01-11 20:20:00+00:00 AWS Health APIs and Notifications
2019-01-11 20:20:00+00:00 AWS CloudFormation
2019-01-11 20:19:00+00:00 AWS Key Management Service
2019-01-11 20:18:00+00:00 Amazon S3
2019-01-11 20:12:00+00:00 AWS CodeBuild
2019-01-11 20:11:00+00:00 AWS CodePipeline
2019-01-11 20:04:00+00:00 Amazon Elasticsearch Service
2019-01-11 19:57:00+00:00 AWS AppSync
2019-01-11 19:56:00+00:00 Amazon DynamoDB
2019-01-11 19:56:00+00:00 AWS Identity and Access Management
2019-01-11 19:55:00+00:00 AWS Lambda
2019-01-11 19:51:00+00:00 Amazon CloudWatch Logs
2019-01-11 19:28:00+00:00 Amazon SNS
2019-01-11 18:15:00+00:00 AWS Security Token Service
2019-01-11 17:40:00+00:00 Amazon CloudWatch
2019-01-11 17:39:00+00:00 Application Auto Scaling
2019-01-11 01:00:00+00:00 AWS Cloud9
2019-01-11 00:36:00+00:00 Amazon Resource Group Tagging API
2019-01-11 00:36:00+00:00 Amazon EC2
2019-01-10 21:10:00+00:00 Amazon Cognito User Pools
2019-01-10 21:09:00+00:00 Amazon Cognito Identity
2019-01-10 17:35:00+00:00 Amazon CloudWatch Events
2019-01-10 17:27:00+00:00 Amazon EC2 Auto Scaling
2019-01-09 23:54:00+00:00 AWS Amplify
2019-01-09 15:49:00+00:00 AWS CloudTrail
2019-01-08 23:25:00+00:00 Amazon EC2 Container Registry
2019-01-08 22:17:00+00:00 AWS Resource Groups
2019-01-08 17:43:00+00:00 AWS Systems Manager
2018-12-18 20:46:00+00:00 AWS X-Ray
2018-12-18 14:40:00+00:00 AWS Serverless Application Repository
2018-12-18 13:17:00+00:00 Elastic Load Balancing
2018-12-17 19:29:00+00:00 AWS CodeDeploy
2018-12-17 19:22:00+00:00 AWS Directory Service
2018-12-10 19:48:00+00:00 AWS Config
2018-12-07 22:42:00+00:00 Amazon SimpleDB
2018-12-07 22:42:00+00:00 Amazon SQS
2018-12-07 22:42:00+00:00 AWS Elastic Beanstalk
2018-12-07 20:51:00+00:00 AWS Support
2018-12-04 17:21:00+00:00 Manage - Amazon API Gateway
2018-12-03 23:01:00+00:00 Amazon Kinesis
2018-12-03 20:53:00+00:00 Data Pipeline
2018-12-03 19:34:00+00:00 Amazon Kinesis Firehose
2018-11-30 21:33:00+00:00 Amazon CloudFront
2018-11-29 23:09:00+00:00 AWS Database Migration Service
2018-11-27 18:00:00+00:00 AWS CodeStar
2018-11-22 01:52:00+00:00 AWS Trusted Advisor
```

Here's the python code (which could likely be much improved)

```python
import sys
import time
import boto3

ARG_PROFILE  = 'aws-account-alias'
ARN = 'arn:aws:sts::123456789012:role/human-role/redacted-project'

def main():
  session = boto3.session.Session(profile_name=ARG_PROFILE)
  client = session.client('iam')

  response = client.generate_service_last_accessed_details(
      Arn=ARN
  )
  job_id = response['JobId']

  while True:
    time.sleep(3)
    print(f'checking {job_id}')
    response = client.get_service_last_accessed_details(
        JobId=job_id
    )
    if response['JobStatus'] == 'COMPLETED':
      break
  
  services = []
  for service in response['ServicesLastAccessed']:
    if (service['TotalAuthenticatedEntities'] > 0):
      services.append('{LastAuthenticated} {ServiceName}'.format(**service))
  
  print(*sorted(services, reverse=True), sep='\n')


if __name__ == '__main__':
    sys.exit(main())
```
