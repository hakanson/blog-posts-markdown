---
title: Secrets Management
slug: secrets-management
author: Kevin Hakanson
date: 2018-04-10
tags: ["podcasts","information security"]
---
I recently listened to Software Engineering Radio [Episode 311: Armon Dadgar on Secrets Management](http://www.se-radio.net/2017/12/se-radio-episode-311-armon-dadgar-on-secrets-management/) from December 5, 2017

> The show covers: what a secret is; the difference between secrets and sensitive data; what is secrets management; the different types of secrets; key management; auditing of secrets; implementing secrets management.

It answered simple questions like, "what is a secret?"

> anything that can be used to authenticate or authorize / grants access or elevates access to a system
>
> * username/password
> * api token
> * TLS/SSL certificate

Later they posed questions about secrets management:

> * How are we distributing that secret to application?
> * How do I update that secret?
> * In case of a breach, how do we revoke, update, react?

An interesting discussion was the "sharing of secrets over space and time."  In many systems, each server gets a copy of the same secret, which isn't rotated often (or ever).  This makes it much harder to track down the source of a breach.  However, if each server got a unique, short-lived secret, then auditing becomes easier.  HashiCorp Vault even has the concept of [Dynamic Secrets](https://www.vaultproject.io/intro/getting-started/dynamic-secrets.html), which are generated when they are accessed.

Toward the end, some additional questions were asked regarding implementing a secrets management system.

> * What are all of our secrets and where are they?
> * Which applications and people should have access to secrets?
> * What is the simplest path of getting all secrets to one place?
