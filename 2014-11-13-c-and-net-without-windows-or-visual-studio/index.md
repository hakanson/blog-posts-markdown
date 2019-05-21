---
title: C# and .NET without Windows or Visual Studio
slug: c-and-net-without-windows-or-visual-studio
author: Kevin Hakanson
date: 2014-11-13
tags: ["c#", ".net", "open source"]
---
If you didn't hear about the open sourcing of .NET announced at Microsoft's Connect(); event, read [Microsoft takes .NET open source and cross-platform, adds new development capabilities with Visual Studio 2015, .NET 2015 and Visual Studio Online](http://news.microsoft.com/2014/11/12/microsoft-takes-net-open-source-and-cross-platform-adds-new-development-capabilities-with-visual-studio-2015-net-2015-and-visual-studio-online/) or [Announcing .NET 2015 - .NET as Open Source, .NET on Mac and Linux, and Visual Studio Community - Scott Hanselman](http://www.hanselman.com/blog/AnnouncingNET2015NETAsOpenSourceNETOnMacAndLinuxAndVisualStudioCommunity.aspx).

To celebrate, I did this:

> HelloMvc$ k kestrel
>
> Started

But, what is that?  It is a ASP.NET MVC application running on my Mac using the [aspnet/KestrelHttpServer](https://github.com/aspnet/KestrelHttpServer) web server.  Want to try it yourself?  Instructions for setup are at [aspnet/Home · GitHub](https://github.com/aspnet/home).

I also installed [Sublime Text 3](http://www.sublimetext.com/3) and [OmniSharp - Cross platform .NET development by OmniSharp](http://www.omnisharp.net/). (also see [Jonathan Channon Blog - Microsoft Endorsing C# as a First Class Citizen in Sublime Text](http://blog.jonathanchannon.com/2014/11/12/csharp-first-class-citizen-sublime-text/))

Those are developer focused details, but what does this mean at an enterprise level? I've extracted some quotes from the Dr. Dobb's article [C# and .NET's Sudden Ubiquity](http://www.drdobbs.com/windows/c-and-nets-sudden-ubiquity/240169282):

> * Of these platforms, Linux is clearly the most important...enterprises will be able to run the applications without having to add in the cost of Microsoft Server licenses.
> * The big winners of all this goodness are C# developers.
> * The big loser is certainly Java.
> * For years, C# has been an attractive language for developers, but blocked in wider adoption by its inability to run on more than Windows.

Not sure when it will happen at my company, but I see services written in C# and .NET running on Linux in our future.  
