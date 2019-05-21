---
title: Replacement strategy for Google Search Appliance?
slug: replacement-strategy-for-google-search-appliance
author: Kevin Hakanson
date: 2015-09-28
tags: ["web","search"]
---
During the introductions of an internal Search Experience Community meeting, a product was mentioned that uses the Google Search Appliance (GSA) and was looking to move off of that platform onto Elastic.

Some of our products also use a GSA for searching HTML based "Help" content.  The Technical Communications team authors this content and it is deployed as static content to a web server that is indexed by GSA.  This is technology I haven't used before, but my understanding is that custom tags are used to control content indexing (see [7.0 - Preparing for a Crawl](http://www.google.com/support/enterprise/static/gsa/docs/admin/70/gsa_doc_set/admin_crawl/preparing.html) ):

```html
<!--googleoff: all-->

<!--googleon: all-->
```

Searching the internet indicates using a web crawler (e.g., [Apache Nutch](http://nutch.apache.org/)) and applying a filter that respects the GSA custom tags could prepare the documents to be inserted into Elastic.

This seems like a topic where a common solution or platform service could be useful.  We are thinking that Help might just be included in the single UI search box experience - possibly part of federated results, and keyed by detecting "How do I..." style questions.  This is a longer-term goal, but it seems like a relevant topic for an overall search experience audience.