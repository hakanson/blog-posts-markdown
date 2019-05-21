---
title: Solution to JavaScript's 0.1 + 0.2 = 0.30000000000000004 problem?
slug: solution-to-javascripts-01-02-030000000000000004-problem
author: Kevin Hakanson
date: 2015-01-08
tags: ["javascript"]
---
Open your JavaScript console and try this:

```javascript
> 0.1 + 0.2 == 0.3

  false

> 0.1 + 0.2

  0.30000000000000004
```

You may ask yourself [Is floating point math broken?](http://stackoverflow.com/questions/588004/is-floating-point-math-broken).  The answer is that JavaScript uses floating point math based on the [IEEE 754 standard](https://en.wikipedia.org/wiki/IEEE_754#Basic_formats), the same as Java's `double`. If you want the details on what that means, either quickly read [The Floating-Point Guide - What Every Programmer Should Know About Floating-Point Arithmetic](http://floating-point-gui.de/) or fully digest [What Every Computer Scientist Should Know About Floating-Point Arithmetic](http://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html).

But if I really want `0.1 + 0.2 == 0.3` then what do I do?  The [Java BigDecimal](http://docs.oracle.com/javase/7/docs/api/java/math/BigDecimal.html) class solved this problem, and there similar solutions for JavaScript: [GWT compiled to JavaScript](https://github.com/iriscouch/bigdecimal.js) version; a [JavaScript translation](https://github.com/dtrebbien/BigDecimal.js) of the ICU4J's `com.ibm.icu.math.BigDecimal`.

There are also other JavaScript libraries like [big.js](http://mikemcl.github.io/big.js/).  Here is big.js in action from the JavaScript console:

```javascript
> Big(0.1).plus(0.2).eq(0.3)

  true

> Big(0.1).plus(0.2).toString()

  "0.3"
```

How have other teams solved this problem?  Is there a de facto JavaScript library to use that has been well tested?  Would a common library be useful?