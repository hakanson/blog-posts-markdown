---
title: Capital One Cloud Custodian "Test Drive"
slug: capital-one-cloud-custodian-test-drive
author: Kevin Hakanson
date: 2017-07-05
tags: ["aws","python","automation","information security"]
---
I've mentioned [capitalone/cloud-custodian: Rules engine for AWS management](https://github.com/capitalone/cloud-custodian) before but hadn't taken it for a "test drive" yet.

However, instead of following the instructions, I wanted to use the [Anaconda](https://www.continuum.io/what-is-anaconda) distribution of Python, so I used these install commands.

```console
$ conda create --name custodian python=2.7
$ source activate custodian
$ pip install c7n
```

I wanted something simple to test, and easy to verify, so I created this `policy.yml` to find any running ec2 instances without the `xx:financial-identifier` tag:

```yaml
policies:
- name: tag-compliance
  resource: ec2
  filters:
    - State.Name: running
    - "tag:xx:financial-identifier": absent
```

I ran `custodian` using the command line to first validate the `policy.yml` and the execute a dry run:

```console
$ custodian validate policy.yml 
2017-07-05 10:31:35,651: custodian.commands:INFO Configuration valid: policy.yml

$ custodian run --dryrun -s out policy.yml
2017-07-05 10:31:41,651: custodian.policy:INFO policy: tag-compliance resource:ec2 region:us-east-1 count:24 time:0.01
```

It found 24 instances!  If I look in `out/tag-compliance/resources.json` I can see the full details, or I can just grep for the `InstanceId` values and see something like:

```console
$ grep InstanceId out/tag-compliance/resources.json
    "InstanceId": "i-01234567890123456",
    "InstanceId": "i-01234567"
```

I chose this filter because I can use the AWS Console Tag Editor to verify that count.

Now that I know it works, time to start crafting some interesting policies.