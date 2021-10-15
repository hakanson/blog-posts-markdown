---
title: My first C# AWS Lambda Function
slug: /2021-07-29-my-first-c-aws-lambda-function
author: Kevin Hakanson
date: 2021-07-29
tags: ["aws","lambda","csharp","dotnet"]
---

Here it is - my very first AWS Lambda Function coded in C#.

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace MyFirstCsharpLambda
{
    public class Functions
    {
        /// <summary>
        /// Default constructor that Lambda will invoke.
        /// </summary>
        public Functions()
        {
        }


        /// <summary>
        /// A Lambda function to respond to HTTP Get methods from API Gateway
        /// </summary>
        /// <param name="request"></param>
        /// <returns>The API Gateway response.</returns>
        public APIGatewayProxyResponse Get(APIGatewayProxyRequest request, ILambdaContext context)
        {
            context.Logger.LogLine("Get Request\n");

            var response = new APIGatewayProxyResponse
            {
                StatusCode = (int)HttpStatusCode.OK,
                Body = "Hello AWS Serverless",
                Headers = new Dictionary<string, string> { { "Content-Type", "text/plain" } }
            };

            return response;
        }
    }
}
```

You can probably guess I didn't write that code, but generated it from a template.  There is [.NET Core CLI](https://docs.aws.amazon.com/lambda/latest/dg/csharp-package-cli.html) support for creating .NET-based Lambda applications.

```bash
$ dotnet tool install -g Amazon.Lambda.Tools
$ dotnet new -i Amazon.Lambda.Templates
$ dotnet new serverless.EmptyServerless --name MyFirstCsharpLambda
``` 

Most of my Lambda functions have been JavaScript/Node.js where I am processing the fields on a loosely types `event` object, so it was nice to see the `LambdaSerializer` helps create strongly typed `APIGatewayProxyRequest` and `APIGatewayProxyResponse` objects to understand the event payload.

```csharp
public APIGatewayProxyResponse Get(APIGatewayProxyRequest request, ILambdaContext context)
```

I used to code C# using Visual Studio on Windows Desktop and run under IIS on Windows Server, and now my C# development uses Visual Studio Code on macOS and runs on AWS Lambda on Linux.