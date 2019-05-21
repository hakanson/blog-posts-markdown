---
title: JavaScript Static Code Analysis?
slug: javascript-static-code-analysis
author: Kevin Hakanson
date: 2014-11-19
tags: ["javascript","information security"]
---
My company's "Application Security Testing Standard" requires assessing application code with Static Code Analysis or Dynamic Analysis.  The tools currently used for this are from [Veracode](http://www.veracode.com/products)

* Static Application Security Testing (SAST), or “white-box” testing, finds common vulnerabilities by performing a deep analysis of your applications without actually executing them.
* Dynamic Application Security Testing (DAST), or “black-box” testing, identifies architectural weaknesses and vulnerabilities in your running web applications before cyber-criminals can find and exploit them.

As we are building more complex web applications in the [Single Page Application (SPA)](http://en.wikipedia.org/wiki/Single-page_application) style, there is more JavaScript than ever before.  Also, frameworks like [AngularJS](https://angularjs.org/) put application code in the "static" HTML files.  What are the solutions for static scanning of these code artifacts?

We have been using tools like [JSLint](http://www.jslint.com/) and [JSHint](http://www.jshint.com/) and for JavaScript static code analysis for some time. More recently, [ESLint](http://eslint.org/), with its pluggable rules architecture, has become the de facto standard.  Under the covers, ESLint uses [Esprima](http://esprima.org/) to generate an abstract syntax tree that is compatible with the [Mozilla Parser AST](https://developer.mozilla.org/en/SpiderMonkey/Parser_API).  This AST is the representation of source code that is scanned for possible errors, best practices, and stylistic issues.

[JSPrime](http://dpnishant.github.io/jsprime/) is one of the tools listed at [Security/B2G/JavaScript code analysis - MozillaWiki](https://wiki.mozilla.org/Security/B2G/JavaScript_code_analysis).  It also uses Esprima to generate an AST, but instead scans for security violations by tracing execution paths between user input **sources** and code execution **sink** functions.  JSPrime has identified sources and sinks for the browser JavaScript APIs, jQuery, and YUI.  To scan other libraries like AngularJS, additional configuration would need to be added.  The code is open source and MIT licensed: [dpnishant/jsprime · GitHub](https://github.com/dpnishant/jsprime).

Burp Suite, a commercial product, includes an engine for [static analysis of JavaScript](http://blog.portswigger.net/2014/07/burp-gets-new-javascript-analysis.html) code.  This looks for items like DOM-based XSS, JavaScript injection, Client-side SQL injection, etc.  This could be an option for teams already using Burp for web application security testing.

Scanning AngularJS based HTML is another matter. I am hopeful that the recently released [Angular Hint](https://github.com/angular/angular-hint) will grow to include modules that include security analysis above the built-in [security features](https://docs.angularjs.org/guide/security) of AngularJS.

Is this a topic worth pursuing or with either Veracode or our IDEs (WebStorm, Visual Studio) start providing this tooling?