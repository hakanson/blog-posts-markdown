---
title: AWS Chalice, Amazon API Gateway, and AWS IAM Authorization
slug: aws-chalice-amazon-api-gateway-and-aws-iam-authorization
author: Kevin Hakanson
date: 2017-08-15
tags: ["aws","aws iam","python","api"]
---
I've wanted to take a hands-on look at [Amazon API Gateway](https://aws.amazon.com/api-gateway/) and the recent 1.0 release of [aws/chalice: Python Serverless Microframework for AWS](https://github.com/aws/chalice) pushed me over the edge.

> The python serverless microframework for AWS allows you to quickly create and deploy applications that use Amazon API Gateway and AWS Lambda.

Since I am using the [Anaconda Distribution](https://docs.continuum.io/anaconda/) of Python, I needed to consult [Managing environments — Conda documentation](https://conda.io/docs/using/envs.html) for setting things up without using [virtualenv](https://virtualenv.pypa.io/en/stable/).

```console
$ conda create --name chalice python=3
$ source activate chalice
$ pip install chalice
$ chalice new-project helloworld
```

A simple `app.py` file was created for me...

```python
from chalice import Chalice

app = Chalice(app_name='helloworld')

@app.route('/')
def index():
    return {'hello': 'world'}
```

...which I was able to easily deploy to our AWS account.

```console
$ chalice deploy
Initial creation of lambda function.
Creating role
Creating deployment package.
Initiating first time deployment...
Deploying to: api
https://fw7xjo57bc.execute-api.us-east-1.amazonaws.com/api/
```

I tested with curl and got the result I was expecting.

```console
$ curl https://fw7xjo57bc.execute-api.us-east-1.amazonaws.com/api/
{"hello": "world"}
```

However, this was now publicly exposed and I don't want everyone to know about "Hello World".  It was time to consult the documentation on how to secure my new API:

* [apigateway — AWS CLI 1.11.134 Command Reference](http://docs.aws.amazon.com/cli/latest/reference/apigateway/) 
* [APIGateway — botocore 1.6.2 documentation](http://botocore.readthedocs.io/en/latest/reference/services/apigateway.html) 

I needed the `resource-id` of my GET method to add an authorizationType of `AWS_IAM` so only a valid AWS user in this account could call my API.

```console
$ aws apigateway get-resources --rest-api-id fw7xjo57bc
{
    "items": [
        {
            "id": "9y11coidb1",
            "path": "/",
            "resourceMethods": {
                "GET": {}
            }
        }
    ]
}

$ aws apigateway update-method \
  --rest-api-id fw7xjo57bc \
  --resource-id 9y11coidb1 \
  --http-method GET \
  --patch-operations op="replace",path="/authorizationType",value="AWS_IAM"
```

But this didn't work right away, so I had to deploy my changes before my curl was rejected.

```console
$ aws apigateway create-deployment --rest-api-id fw7xjo57bc --stage-name api
{
    "id": "5pr2ed",
    "createdDate": 1502815254
}

$ curl https://fw7xjo57bc.execute-api.us-east-1.amazonaws.com/api/
{"message":"Missing Authentication Token"}
```

The docs for [Signing AWS API Requests](http://docs.aws.amazon.com/general/latest/gr/signing_aws_api_requests.html) had [Examples of the Complete Version 4 Signing Process (Python)](http://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html#sig-v4-examples-get-auth-header) but they weren't working for me, so I used [jmenga/requests-aws-sign: This package allows for AWS V4 request signing using the Python requests library](https://github.com/jmenga/requests-aws-sign) instead.

```console
$ pip install requests
$ pip install requests_aws_sign
```

Since naming things is hard, I created `fw7xjo57bc.py` to make the signed request.

```python
import requests
from requests_aws_sign import AWSV4Sign
from boto3 import session

session = session.Session()
credentials = session.get_credentials()
region = session.region_name or 'us-east-1'
service = 'execute-api'

url = "https://fw7xjo57bc.execute-api.us-east-1.amazonaws.com/api/"
auth = AWSV4Sign(credentials, region, service)
response = requests.get(url, auth=auth)

print(response.text)
```

It works!

```console
$ python3 fw7xjo57bc.py 
{"hello": "world"}
```

I then set authorizationType back to NONE, deployed, and tested again.

```console
$ aws apigateway update-method \
  --rest-api-id fw7xjo57bc \
  --resource-id 9y11coidb1 \
  --http-method GET \
  --patch-operations op="replace",path="/authorizationType",value="NONE"

$ aws apigateway create-deployment --rest-api-id fw7xjo57bc --stage-name api
{
    "id": "xxtj1w",
    "createdDate": 1502816441
}

$ curl https://fw7xjo57bc.execute-api.us-east-1.amazonaws.com/api/
{"hello": "world"}
```

Using an `authorizationType` of `AWS_IAM` is only interesting for more "internal" or "infrastructure" APIs.  Most cases where API Gateway come up is for customer-facing, external API which needs either API Keys for [Usage Plans](http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-usage-plans.html) or [Custom Authorizers](http://docs.aws.amazon.com/apigateway/latest/developerguide/use-custom-authorizer.html).

Lastly, it was also just as easy to clean up after myself

```console
$ chalice delete
Deleting rest API fw7xjo57bc
Deleting lambda function helloworld-dev
Delete the role helloworld-dev? [y/N]: y
Deleting role name helloworld-dev
```