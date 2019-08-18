---
title: .NET Zipkin Investigation (Medidata.ZipkinTracerModule)
slug: net-zipkin-investigation-medidatazipkintracermodule
author: Kevin Hakanson
date: 2016-07-29
tags: ["api", "dotnet"]
---
[Medidata.ZipkinTracerModule](https://github.com/mdsol/Medidata.ZipkinTracerModule) is a "A .NET implementation of the Zipkin Tracer client."  I built a simple Web Api 2 service, similar to the code from the [Zipkin JS Investigation](../2016-06-10-zipkin-js-investigation).  The service recursively calls itself base on the count parameter:  (e.g., `http://localhost:52399/api/hello?count=3`).

```
Hello World! (x3)
Hello World! (x2)
Hello World!
```

`ZipkinTracerModule` is implemented as a OWIN Middleware and required an `OwinStartup` class to configure `Zipkin`.

```csharp
public class OwinStartup  
{  
    public static ZipkinConfig _zipkinConfig;  
    public void Configuration(IAppBuilder app)  
    {  
        var zipkinConfig = new ZipkinConfig  
        {  
            Domain = request => new Uri("http://localhost"),  
            ZipkinBaseUri = new Uri("http://10.194.52.207:9411"),  
            SpanProcessorBatchSize = 1,  
            SampleRate = 1  
        };  
        // TODO: how can I register this with Unity and inject into Controller?  
        _zipkinConfig = zipkinConfig;  
        app.UseZipkin(zipkinConfig);  
    }  
}
```

The `HelloController` uses the `ZipkinConfig` and the `OwinContext` to configure a `ZipkinClient` which plugs into the .NET provided `HttpClient`.  This is what propagates the trace, parent, and span ID values.

```csharp
public class HelloController : ApiController  
{  
    private IZipkinConfig _zipkinConfig = OwinStartup._zipkinConfig;  
    // TODO: how can I inject _zipkinConfig using Unity?  

    public async System.Threading.Tasks.Task<HttpResponseMessage> Get(int count = 1)  
    {  
        string msg = "Hello World!\n";  
        if (count > 1)  
        {  
            var context = System.Web.HttpContext.Current.GetOwinContext();  
            var client = new ZipkinClient(_zipkinConfig, context);  

            using (var httpClient = new HttpClient(new ZipkinMessageHandler(client)))  
            {  
                httpClient.BaseAddress = new Uri(Request.RequestUri, RequestContext.VirtualPathRoot);  
                HttpResponseMessage httpClientResponse = await httpClient.GetAsync($"api/hello?count={count - 1}");  
                if (httpClientResponse.IsSuccessStatusCode)  
                {  
                    var text = await httpClientResponse.Content.ReadAsStringAsync();  
                    msg = $"Hello World! (x{count})\n" + text;  
                }  
            }  
        }  

        HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, "value");  
        response.Content = new StringContent(msg, Encoding.UTF8, "text/plain");  

        return response;  
    }  
}  
```

There was a bug with the NuGet version, so needed to compile from source and make a fix (see [Pull Request #91](https://github.com/mdsol/Medidata.ZipkinTracerModule/pull/91)).  Also, C# code may look a bit ugly, and wasn't able to get Unity working to dependency inject the `ZipkinConfig` data.

The final result from `http://10.194.52.207:9411/traces/4e3c247d68677a1e?serviceName=localhost`.

```json
[  
  {  
    "traceId": "4e3c247d68677a1e",  
    "name": "get",  
    "id": "4e3c247d68677a1e",  
    "timestamp": 1469831966269543,  
    "duration": 210907,  
    "annotations": [  
      {  
        "endpoint": {  
          "serviceName": "localhost",  
          "ipv4": "10.211.55.8",  
          "port": 52399  
        },  
        "timestamp": 1469831966269543,  
        "value": "sr"  
      },  
      {  
        "endpoint": {  
          "serviceName": "localhost",  
          "ipv4": "10.211.55.8",  
          "port": 52399  
        },  
        "timestamp": 1469831966480450,  
        "value": "ss"  
      }  
    ],  
    "binaryAnnotations": [  
      {  
        "key": "http.path",  
        "value": "/api/hello",  
        "endpoint": {  
          "serviceName": "localhost",  
          "ipv4": "10.211.55.8",  
          "port": 52399  
        }  
      }  
    ]  
  },  
  {  
    "traceId": "4e3c247d68677a1e",  
    "name": "get",  
    "id": "4c3c03caf1337298",  
    "parentId": "4e3c247d68677a1e",  
    "timestamp": 1469831966361425,  
    "duration": 100997,  
    "annotations": [  
      {  
        "endpoint": {  
          "serviceName": "localhost",  
          "ipv4": "10.211.55.8",  
          "port": 52399  
        },  
        "timestamp": 1469831966361425,  
        "value": "cs"  
      },  
      {  
        "endpoint": {  
          "serviceName": "localhost",  
          "ipv4": "10.211.55.8",  
          "port": 52399  
        },  
        "timestamp": 1469831966383550,  
        "value": "sr"  
      },  
      {  
        "endpoint": {  
          "serviceName": "localhost",  
          "ipv4": "10.211.55.8",  
          "port": 52399  
        },  
        "timestamp": 1469831966449422,  
        "value": "cr"  
      },  
      {  
        "endpoint": {  
          "serviceName": "localhost",  
          "ipv4": "10.211.55.8",  
          "port": 52399  
        },  
        "timestamp": 1469831966462422,  
        "value": "ss"  
      }  
    ],  
    "binaryAnnotations": [  
      {  
        "key": "http.path",  
        "value": "/api/hello",  
        "endpoint": {  
          "serviceName": "localhost",  
          "ipv4": "10.211.55.8",  
          "port": 52399  
        }  
      },  
      {  
        "key": "http.status",  
        "value": "200",  
        "endpoint": {  
          "serviceName": "localhost",  
          "ipv4": "10.211.55.8",  
          "port": 52399  
        }  
      },  
      {  
        "key": "sa",  
        "value": "1",  
        "endpoint": {  
          "serviceName": "localhost",  
          "ipv4": "127.0.0.1",  
          "port": 52399  
        }  
      }  
    ]  
  },  
  {  
    "traceId": "4e3c247d68677a1e",  
    "name": "get",  
    "id": "4f18dc0c1c6745e0",  
    "parentId": "4c3c03caf1337298",  
    "timestamp": 1469831966398553,  
    "duration": 63869,  
    "annotations": [  
      {  
        "endpoint": {  
          "serviceName": "localhost",  
          "ipv4": "10.211.55.8",  
          "port": 52399  
        },  
        "timestamp": 1469831966398553,  
        "value": "cs"  
      },  
      {  
        "endpoint": {  
          "serviceName": "localhost",  
          "ipv4": "10.211.55.8",  
          "port": 52399  
        },  
        "timestamp": 1469831966417424,  
        "value": "sr"  
      },  
      {  
        "endpoint": {  
          "serviceName": "localhost",  
          "ipv4": "10.211.55.8",  
          "port": 52399  
        },  
        "timestamp": 1469831966445425,  
        "value": "cr"  
      },  
      {  
        "endpoint": {  
          "serviceName": "localhost",  
          "ipv4": "10.211.55.8",  
          "port": 52399  
        },  
        "timestamp": 1469831966462422,  
        "value": "ss"  
      }  
    ],  
    "binaryAnnotations": [  
      {  
        "key": "http.path",  
        "value": "/api/hello",  
        "endpoint": {  
          "serviceName": "localhost",  
          "ipv4": "10.211.55.8",  
          "port": 52399  
        }  
      },  
      {  
        "key": "http.status",  
        "value": "200",  
        "endpoint": {  
          "serviceName": "localhost",  
          "ipv4": "10.211.55.8",  
          "port": 52399  
        }  
      },  
      {  
        "key": "sa",  
        "value": "1",  
        "endpoint": {  
          "serviceName": "localhost",  
          "ipv4": "127.0.0.1",  
          "port": 52399  
        }  
      }  
    ]  
  }  
]
```