---
title: Facebook GraphQL/Relay and Netflix Falcor
slug: facebook-graphqlrelay-and-netflix-falcor
author: Kevin Hakanson
date: 2015-04-01
tags: ["javascript", "apis", "graphql"]
---
I have my eye on two new client-side, data-access technologies that will be open sourced "soon".  They are both trying to solve redundancy and coupling concerns between client-side code/data models and server-side code/HTTP endpoints.  How?  Both are a bit of a mystery right now so that is hard to answer.

There isn't a lot of information available for Facebook GraphQL/Relay, but here are a couple of links:

* [Introducing Relay and GraphQL | React](http://facebook.github.io/react/blog/2015/02/20/introducing-relay-and-graphql.html)
* [Building The Facebook News Feed With Relay | React](http://facebook.github.io/react/blog/2015/03/19/building-the-facebook-news-feed-with-relay.html)
* [2015-01-29 Unofficial Relay FAQ](https://gist.github.com/wincent/598fa75e22bdfa44cf47)
* [GraphQL and Relay with Nick Schrock and Joe Savona - DevChat.TV](http://devchat.tv/js-jabber/152-jsj-graphql-and-relay-with-nick-schrock-and-joe-savona-)

There is even less information about Netflix Falcor - you can follow Falcor ([@falcorjs](https://twitter.com/falcorjs)) on Twitter and watch the [Binding to the Cloud with Falcor Jafar Husain - YouTube](https://www.youtube.com/watch?v=WiO1f6h15c8) presentation from ng-conf.  This project might have been named Falkor at one point.

What to do next?  Wait for the open source versions to be released and (hopefully) some good documentation.  These might be niche solutions when you have a connected graph of data objects which you want to retrieve and display in multiple ways?  They are also are both more query-based and move in a different direction from what I would consider REST.