---
title: Python Typings for AWS Lambda Function Events
slug: /2022-04-10-python-typings-for-aws-lambda-function-events
author: Kevin Hakanson
date: 2022-04-10
tags: ["aws","lambda","python"]
---

I was building a Python-based AWS Lambda function similar to what was announced by [New – Use Amazon S3 Event Notifications with Amazon EventBridge](https://aws.amazon.com/blogs/aws/new-use-amazon-s3-event-notifications-with-amazon-eventbridge/) and the code looked similar to this - full of "magic strings" that I had to discover.

```python
import boto3

def lambda_handler(event, context):
    bucket = event['detail']['bucket']['name']
    file_key = event['detail']['object']['key']

    s3 = boto3.client('s3')
    file_to_process = s3.get_object(Bucket=bucket, Key=file_key)

```

Python has a module called [typing](https://docs.python.org/3/library/typing.html) that provides support for type hints, which make for a nice autocomplete experience in Visual Studio Code.  I started googling for some options and first found [AWS Lambda Typing](https://pypi.org/project/aws-lambda-typing/) and it's [events/s3.py](https://github.com/MousaZeidBaker/aws-lambda-typing/blob/master/src/aws_lambda_typing/events/s3.py) uses TypedDict from typing.

Here is the same code using those type definitions - still "magic strings" but they autocomplete.

```python
from aws_lambda_typing import context as context_, events
from aws_lambda_typing.s3 import S3

def handler(event: events.EventBridgeEvent, context: context_.Context) -> None:
    event_detail: S3 = S3(event['detail'])
    bucket = event_detail['bucket']['name']
    file_key = event_detail['object']['key']

    s3 = boto3.client('s3')
    file_to_process = s3.get_object(Bucket=bucket, Key=file_key)
```

Next I found that [Lambda Powertools Python](https://awslabs.github.io/aws-lambda-powertools-python/latest/) has [Event Source Data Classes]( https://awslabs.github.io/aws-lambda-powertools-python/latest/utilities/data_classes/) and it's [s3_event.py](https://github.com/awslabs/aws-lambda-powertools-python/blob/develop/aws_lambda_powertools/utilities/data_classes/s3_event.py) uses custom [DictWrapper](https://github.com/awslabs/aws-lambda-powertools-python/blob/develop/aws_lambda_powertools/utilities/data_classes/common.py) class which "Provides a single read only access to a wrapper dict."

Here is the same code using those type definitions - less "magic strings" and some properties.

```python
import boto3
from aws_lambda_powertools.utilities.typing import LambdaContext
from aws_lambda_powertools.utilities.data_classes import event_source, EventBridgeEvent
from aws_lambda_powertools.utilities.data_classes.s3_event import S3Message

@event_source(data_class=EventBridgeEvent)
def lambda_handler(event: EventBridgeEvent, context: LambdaContext) -> None:

    # can use either event['detail'] or event.detail
    event_detail: S3Message = S3Message(event['detail'])
    bucket = event_detail.bucket.name
    file_key = event_detail.get_object.key

    s3 = boto3.client('s3')
    file_to_process = s3.get_object(Bucket=bucket, Key=file_key)
```




