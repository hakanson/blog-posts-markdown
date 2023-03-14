---
title: CloudFormation Output Values using the AWS CLI
slug: /2023-03-13-cloudformation-output-values-using-the-aws-cli
author: Kevin Hakanson
date: 2023-03-13
tags: ["aws", "cli", "cloudformation"]
---

I was updating the [Hello Go CDK](https://github.com/aws-samples/hello-go-cdk) sample project and looking for an easy way to get a CloudFormation stack output value for use in a CLI command.

The AWS CLI [describe-stacks](https://docs.aws.amazon.com/cli/latest/reference/cloudformation/describe-stacks.html) command will get that value, but there is an entire page of JSON to parse through.  Most AWS CLI command support the `--query` global option, which is a "JMESPath query to use in filtering the response data."  See the [JMESPath Specification¶](https://jmespath.org/specification.html) for full details.

I ran the command below using `Stacks[].Outputs[]` as the JMESPath query to see all the `Outputs`.

`$ aws cloudformation describe-stacks --stack-name HelloGoAppStage-HelloGoAppStack --query Stacks[].Outputs[]`

```json
[
    {
        "OutputKey": "FargateServiceLoadBalancerDNSXXXXXXXX",
        "OutputValue": "hello-alb-0000000000.us-east-1.elb.amazonaws.com"
    },
    {
        "OutputKey": "FargateServiceServiceURLXXXXXXXX",
        "OutputValue": "http://hello-alb-0000000000.us-east-1.elb.amazonaws.com"
    }
]
```

The above JSON had unique values I redacted using `XXXXXXXX` and `0000000000`.  This makes finding the correct output harder than just matching an exact key value.  Narrowing the `describe-stacks` command down to just `FargateServiceServiceURLXXXXXXXX` required a more complicated JMESPath query - one that would select the "OutputKey" that [starts_with](https://jmespath.org/specification.html#starts-with) a "FargateServiceServiceURL" value.

```bash
$ aws cloudformation describe-stacks --stack-name HelloGoAppStage-HelloGoAppStack --query  "Stacks[0].Outputs[?starts_with(OutputKey, 'FargateServiceServiceURL')].OutputValue" 
[
    "http://hello-alb-0000000000.us-east-1.elb.amazonaws.com"
]
```

This output is better, but still a JSON string array with a quoted value.  Another AWS CLI global option is `--output` which indicates the "formatting style for command output" and takes "json", "text", or "table" as values.

I changed my command to use `--output text` and now the value is in the format I need.

```bash
$ aws cloudformation describe-stacks --stack-name HelloGoAppStage-HelloGoAppStack --query  "Stacks[0].Outputs[?starts_with(OutputKey, 'FargateServiceServiceURL')].OutputValue" --output text
http://hello-alb-0000000000.us-east-1.elb.amazonaws.com
```

The last step was to use the backtick operator to interpolate the value and assign it to the `HELLO_GO_URL` environment variable so I can use it in the subsequent `curl` command.

```bash
export HELLO_GO_URL=`aws cloudformation describe-stacks --stack-name HelloGoAppStage-HelloGoAppStack --query "Stacks[0].Outputs[?starts_with(OutputKey, 'FargateServiceServiceURL')].OutputValue" --output text`
curl -w "\n" $HELLO_GO_URL/servicetest
```
