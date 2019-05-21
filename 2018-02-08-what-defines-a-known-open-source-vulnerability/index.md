---
title: What defines a known open source vulnerability?
slug: what-defines-a-known-open-source-vulnerability
author: Kevin Hakanson
date: 2018-02-08
tags: ["information security"]
---
[What defines a known open source vulnerability?](https://www.oreilly.com/ideas/what-defines-a-known-open-source-vulnerability) is an excerpt from [Securing Open Source Libraries by Guy Podjarny](https://thehub.thomsonreuters.com/people/0038137/blog/2018/01/16/securing-open-source-libraries-by-guy-podjarny) that contains some interesting points I would like to highlight:

A "known vulnerability" seems obvious...

> At the most basic level, a vulnerability is deemed known as soon as it’s publicly posted in a reasonably easy to find location.

They get CVE ID...

> The most well-known body of vulnerability information is Common Vulnerability and Exposures (CVE). CVE is a free dictionary of vulnerabilities...CVEs are used globally as a classification system.

And appear in the NVD...

> It’s important to note that CVE is not itself a database, but rather a dictionary of IDs....the National Vulnerability Database (NVD) is a database, and exposes the vulnerability information

Unless they don't get a ID...

> Receiving a CVE number requires the author or reporter to know about it in the first place, and then go through a certain amount of paperwork and filing effort.
>
> CVEs are in especially bad shape when it comes to known vulnerabilities in OSS packages. Based on a Snyk’s database as of October, 2017...a meager 11% of npm package vulnerabilities have such an ID.

Or don't get into the database...

> Yet another lag takes place between the assignment of a CVE and posting it to NVD
>
> Known vulnerabilities that are not on NVD are still known, but harder to detect. Library vulnerabilities are likely to either have no CVE, not be listed on NVD

As a summary:

> Known vulnerabilities are not as simple as they initially appear. The definition of what’s considered known and the management of the vulnerability metadata are very hard to do well.
>
> CVE and NVD work well for curating vulnerabilities in commercial products, but do not scale to the volume and ownership model of open source projects. Over time, these standards may evolve to meet this demand, but right now their coverage and detail level are not enough to protect your libraries.
