---
title: WebSequenceDiagrams Notation
slug: websequencediagrams-notation
author: Kevin Hakanson
date: 2016-03-01
tags: ["uml", "documentation"]
---
[https://www.websequencediagrams.com/](https://www.websequencediagrams.com/) supports notation for synchronous calls, asynchronous calls, return calls and activations.  These features are useful for documenting complex interactions with some of the operations happening in the background.  The example below illustrates these interactions (see [https://www.websequencediagrams.com/examples.html](https://www.websequencediagrams.com/examples.html) for full documentation).

**Image:**

[![call flows](  images/call+flows.png)](  images/call+flows.png)

**Source:**

```
title call flows  
  
a->+b: sync call  
b->b: in process call  
b->>+c: async call  
c-->b: 202 Accepted  
b-->-a: return value  
c->d: background process  
d->d:  
d-->-c:  
```