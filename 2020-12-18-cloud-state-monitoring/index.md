---
title: Cloud State Monitoring
slug: /2020-12-18-cloud-state-monitoring
author: Kevin Hakanson
date: 2020-12-18
tags: ["cloud","monitoring","azure","aws","devops"]
---

Last week I gave a presentation about a concept I decided to call **Cloud State Monitoring**.  The premise was that much of cloud configuration monitoring is point-in-time evaluations, but there is additional value in monitoring the change in state of these resource configurations.

For a definition of **state**, I leveraged language from the [State (Computer Science)](https://en.wikipedia.org/wiki/State_(computer_science) ) entry on Wikipedia.

* A specialized definition of state is used for computer programs that operate sequentially on streams of data.
* Information about previous data received is stored and used to affect the processing of the current data.
* This is called a stateful protocol and the data carried over from the previous processing cycle is called the state.

I then proposed this for the definition of **Cloud State Monitoring**.

> Treats cloud resource changes as a stream of data and intelligently monitors both the current data as well as changes from the previous data (state).

A few of the examples I highlighted were:
* Monitor current data for security misconfigurations
* Monitor changes in data for configuration drift

When I think about who is making changes, it is both you (as the customer)...
* Workload teams releasing software
* Platform teams enhancing automation
* Security teams updating policies

...and the cloud provider themselves.
* Adding new cloud-native service features
* Updating versions of hosted open-source software


I recorded and edited the presentation, including adding a full transcript for closed caption viewing.  Check out my [presentations](/presentations) page for full details, include the links to both the [slide deck](https://www.slideshare.net/kevinhakanson/whos-in-your-cloud-cloud-state-monitoring) and [video](https://youtu.be/a4CNQsaRPts).