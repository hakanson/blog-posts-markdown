---
title: First Thoughts on AWS Cloud9
slug: first-thoughts-on-aws-cloud9
author: Kevin Hakanson
date: 2018-07-05
tags: ["http","cloud9","python","ide"]
---
The other week I had trouble creating an [AWS Cloud9](https://aws.amazon.com/cloud9/) environment, so I tried again today - and with success, because I actually met the requirements found at [VPC Settings for AWS Cloud9 Development Environments](https://docs.aws.amazon.com/cloud9/latest/user-guide/vpc-settings.html) and put the instance in a public subnet.  However, it created a Security Group with port 22 open to the internet - which I didn't like...

[![](images/pastedImage_3.png)](images/pastedImage_3.png)

..and neither did an automated security process because within a minute it removed that rule - which was good for security, but bad for accessing the Cloud9 based environment.  However, there are instructions to limit to specific IPs.

> All IP addresses using SSH over port 22. However, you can restrict these IP addresses to only those that AWS Cloud9 uses. For more information, see [Inbound SSH IP Address Ranges](https://docs.aws.amazon.com/cloud9/latest/user-guide/ip-ranges.html).

I did that, and within seconds of saving, I was able to connect to my Cloud9 environment from the browser.

[![](images/pastedImage_4.png)](images/pastedImage_4.png)

I opened the Terminal window and tested what sort of AWS access I had.  The environment runs with my Federated Identity credentials.

```console
$ aws sts get-caller-identity
{
    "Account": "123456789012", 
    "UserId": "AROAXXXXXXXXXXXXXXXXX:kevin.hakanson@example.com", 
    "Arn": "arn:aws:sts::123456789012:assumed-role/projectID-PowerUser/kevin.hakanson@example.com"
}

$ aws --version
aws-cli/1.14.9 Python/2.7.14 Linux/4.14.47-56.37.amzn1.x86_64 botocore/1.8.13
```

The [Amazon Machine Image (AMI) Contents for an AWS Cloud9 EC2 Development Environment](https://docs.aws.amazon.com/cloud9/latest/user-guide/ami-contents.html) did not impress me as they had an outdated version of the awscli.  Also, I followed the [Python Sample for AWS Cloud9](https://docs.aws.amazon.com/cloud9/latest/user-guide/sample-python.html) which I think confused me even more because in one place it is using virtual environments  (`virtualenv -p /usr/bin/python36 vpy36`) and later running as sudo for the system Python (`sudo python -m pip install boto3`).  I did figure out how to create a custom "runner" that would use the virtualenv.

```console
$ cat .c9/runners/vpy36.run 
// Create a custom Cloud9 runner - similar to the Sublime build system
// For more information see http://docs.aws.amazon.com/console/cloud9/create-run-config
{
    "cmd" : ["/home/ec2-user/environment/vpy36/bin/python", "$file", "$args"],
    "info" : "Started $project_path$file_name",
    "env" : {},
    "selector" : "source.ext"
}
```

Eventually I got some code to run, but I don't think my Python environment is in a stable state - certainly not a "spin up and get coding" experience.

```python
import boto3
import sys
import json

def main():
    session = boto3.session.Session()
    caller_identity = session.client('sts').get_caller_identity()
    print(json.dumps(caller_identity, indent=2))

if __name__ == '__main__':
    sys.exit(main())
```
