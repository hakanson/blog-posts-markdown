---
title: Azure "Search-as-a-Service"
slug: azure-search-as-a-service
author: Kevin Hakanson
date: 2015-06-03
tags: ["azure","search"]
---
Microsoft [Azure Search](http://azure.microsoft.com/en-us/services/search/) became generally available in March.  To learn more, I watched some of the [videos](https://azure.microsoft.com/en-us/documentation/videos/index/?services=search), including:

* Azure Search 101 - Getting started with Azure Search with Liam Cavanagh
* Azure Search 102 - Searching and Mapping Spatial Data with Liam Cavanagh
* Azure Search 103 - Azure Search Suggestions with Liam Cavanagh
* Azure Search 104 - Multilingual Azure Search with Liam Cavanagh

Azure Search is a fully-managed search-as-a-service implementation, running in the Azure cloud, leveraging Microsoft’s deep knowledge of natural language processing and adds geospatial search.  It uses familiar REST API calls and offers a .NET SDK.  The marketing says this:

> This release offers enhanced support for more than 50 languages. It uses the same technology that is used by Microsoft Office and Bing, and is built on our many years of experience with natural language processing.

However, a question from the Azure Forum asks:  [Azure Search Service = Hosted Elastic Search?](https://social.msdn.microsoft.com/Forums/azure/en-US/cc86f15f-4e39-44a1-9e81-1bdcb63c8801/azure-search-service-hosted-elastic-search?forum=azuresearch)  With snippets from the answer including "Azure Search uses Elasticsearch as an underlying full-text search engine" and "ElasticSearch is great but we see it as an implementation detail."

It turns out that the years of natural language processing resulted in switching out the Lucene analyzers: e.g.  `"analyzer" : "en-lucene"` vs `"analyzer" : "en-microsoft"`

The goals of this research were to understand what search-as-a-service means: What are the key features and what implementation details to watch out for?  The documentation reinforced the same message I have been hearing about Elastic:  Don't just drop in JSON - you need to understand your data and structure your indexes.  Also, don't use as a primary data store because you will need to make changes and re-index (which may require a reload).  On the topic of document level security, the Access and Control session of the [Azure Search Overview](https://msdn.microsoft.com/library/azure/dn798933.aspx) states "There is no per-user authentication or authorization model. However, you can use `$filter` to restrict access by user identity" which is consistent with other sources on Elastic.