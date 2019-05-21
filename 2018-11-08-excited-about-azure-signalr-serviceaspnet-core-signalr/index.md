---
title: Excited about Azure SignalR Service/ASP.NET Core SignalR
slug: excited-about-azure-signalr-serviceaspnet-core-signalr
author: Kevin Hakanson
date: 2018-11-08
tags: ["azure",".net", "podcasts"]
---
I hadn't been paying much attention to SignalR lately, but recently listened to [.NET Rocks! SignalR with Anthony Chu](https://dotnetrocks.com/?show=1583) and got excited.  I had always liked the idea of SignalR, and it worked great for .NET based web applications, but I saw gaps for a distributed, multi-language, microservice model and the proprietary protocol.

However, with the re-write to .NET Core and the Microsoft Azure hosted [SignalR Service](https://azure.microsoft.com/en-us/services/signalr-service/), it is worth taking another look.  The binary protocol has been written and open sourced, the service can run independent of your ASP.NET app, and the hosted model takes care of all the scaling and integrates with either your REST endpoints or Azure Functions.

Additional Links:

* [GitHub - aspnet/SignalR: Incredibly simple real-time web for ASP.NET Core](https://github.com/aspnet/SignalR) 
* [Differences between SignalR and ASP.NET Core SignalR | Microsoft Docs](https://docs.microsoft.com/en-us/aspnet/core/signalr/version-differences?view=aspnetcore-2.1) 
* [Get started with ASP.NET Core SignalR | Microsoft Docs](https://docs.microsoft.com/en-us/aspnet/core/tutorials/signalr?view=aspnetcore-2.1&tabs=visual-studio)