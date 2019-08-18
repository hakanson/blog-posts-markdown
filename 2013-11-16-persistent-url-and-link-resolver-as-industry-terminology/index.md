---
title: "\"Persistent URL\" and \"Link Resolver\" as Industry Terminology"
slug: persistent-url-and-link-resolver-as-industry-terminology
author: Kevin Hakanson
date: 2013-11-16
tags: ["web"]
---
An internal project was using the name "link resolver" so I was looking for string matches and found one in the Wikipedia [OpenURL](http://en.wikipedia.org/wiki/Openurl) description:

> **OpenURL** is a standardized format of Uniform Resource Locator (URL) intended to enable Internet users to more easily find a copy of a resource that they are allowed to access. Although OpenURL can be used with any kind of resource on the Internet, it is most heavily used by libraries to help connect patrons to subscription content.
>
> The OpenURL standard is designed to enable linking from information resources such as abstracting and indexing databases (sources) to library services (targets), such as academic journals, whether online or in printed or other formats. The linking is mediated by "link resolvers", or "link-servers", which parse the elements of an OpenURL and provide links to appropriate targets available through a library by the use of an OpenURL knowledge base.

Below are excerpts from the Wikipedia [Persistent uniform resource locator](http://en.wikipedia.org/wiki/PURL) document describe our problem well, and also use the **resolver/resolution** vocabulary.

> A persistent uniform resource locator (PURL) is a uniform resource locator (URL) (i.e. location-based uniform resource identifier or URI) that is used to redirect to the location of the requested web resource. PURLs redirect HTTP clients using HTTP status codes. PURLs are used to curate the URL resolution process, thus solving the problem of transitory URIs in location-based URI schemes like HTTP.
>
> A URL is simply an address of a resource on the World Wide Web. A Persistent URL is an address on the World Wide Web that causes a redirection to another Web resource. If a Web resource changes location (and hence URL), a PURL pointing to it can be updated. A user of a PURL always uses the same Web address, even though the resource in question may have moved. PURLs may be used by publishers to manage their own information space or by Web users to manage theirs; a PURL service is independent of the publisher of information. PURL services thus allow the management of hyperlink integrity. Hyperlink integrity is a design trade-off of the World Wide Web, but may be partially restored by allowing resource users or third parties to influence where and how a URL resolves.
>
> A simple PURL works by responding to an HTTP GET request by returning a response of type 302 (equivalent to the HTTP status code 302, meaning "Found"). The response contains an HTTP "Location" header, the value of which is a URL that the client should subsequently retrieve via a new HTTP GET request.

The [DOI® System and Internet Identifier Specifications](http://www.doi.org/factsheets/DOIIdentifierSpecs.html) Factsheet had a good section on **URI, URL, and URN** and their historical usages.

> Historically there was ambiguity and confusion in the use of these terms. RFC 3986 (2005) aimed to end this by stating that a URI can be classified as a locator, a name, or both. In this view, the term URL refers to the subset of URIs that, in addition to identifying a resource, provide a means of locating the resource; the term URN has been used historically to refer to both URIs under the "urn" scheme (RFC 2141) which are required to remain globally unique and persistent even when the resource ceases to exist or becomes unavailable, and to any other URI with the properties of a name.
>
> RFC 3986 requires that the terms URL and URN be deprecated. This brings a uniformity to the technical treatment of all URIs; however the risk of confusion remains

This project should also be aware of forward looking efforts on Linked Data, including a [URI and URL standard Proposal](https://thehub.thomsonreuters.com/docs/DOC-594460) - this doesn't affect our deliverables in that we need to support existing URLs and their formats, but may affect us in the terminology used in how we describe our project.