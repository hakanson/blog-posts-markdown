---
title: GraphQL vs. REST APIs?
slug: graphql-vs-rest-apis
author: Kevin Hakanson
date: 2018-01-30
tags: ["web","api"]
---
I ran across [Understanding And Using REST APIs — Smashing Magazine](https://www.smashingmagazine.com/2018/01/understanding-using-rest-api/), which is an entry level article explaining REST APIs and uses the [GitHub API v3](https://developer.github.com/v3/) in its examples.

> By default, all requests to [https://api.github.com](https://api.github.com) receive the v3 version of the REST API. We encourage you to explicitly request this version via the Accept header.

What is a bit ironic (to me) is that GitHub is [Migrating from REST to GraphQL](https://developer.github.com/v4/guides/migrating-from-rest/) and the [GitHub GraphQL API v4](https://developer.github.com/v4/) only mentions REST in this comment.

> GitHub chose GraphQL for our API v4 because it offers significantly more flexibility for our integrators. The ability to define precisely the data you want—and only the data you want—is a powerful advantage over the REST API v3 endpoints. GraphQL lets you replace multiple REST requests with a single call to fetch the data you specify.

Back in April 2015, I was curious about [Facebook GraphQL/Relay and Netflix Falcor](../2015-04-01-facebook-graphqlrelay-and-netflix-falcor) and knew it was a technology to watch.  Is now the time not to assume that API doesn't always equal REST?