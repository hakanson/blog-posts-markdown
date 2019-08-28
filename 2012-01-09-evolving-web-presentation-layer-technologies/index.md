---
title: Evolving Web Presentation Layer Technologies
slug: /2012-01-09-evolving-web-presentation-layer-technologies
author: Kevin Hakanson
date: 2012-01-09
tags: ["webdev", "javascript", "architecture"]
---
Traditionally, reuse at the browser layer for a new product has been thought as "we want it just like product X, but"

- replace some images, logos, and icons
- change the color palette, some text sizes, and fonts
- use CSS to hide unwanted items

The application differentiators for a product are not images and CSS, but the content and structure (HTML), the interaction design (UI) and the business logic (JavaScript).  As these key differences increase, the opportunity for code reuse between the products decreases.  However, changes in technology options in the last few years, as well as experiences with WestlawNext (include the IE7 performance effort) are allowing us to achieve better reuse.  Also, we are seeing more "Professional JavaScript Developers," including more books, presentations, and blogs describing what this means for a more extensive codebase.

Current products are applying more software engineering principles and being prescriptive in how presentation layer technologies should be applied in the browser.   These technologies have resulted in increased velocity for new UI features and the promise of better reuse.  However, the promise of reuse doesn't guarantee reuse if the business feature looks or acts differently.

The table below lists some key categories and compares how WestlawNext was built in 2008 against how products are being built now.  The key differences are:

- "browser wars" of 2008 have significantly increased JavaScript performance
- jQuery has become the defacto JavaScript library
- MVC is being applied in the browser to separate model from the view
- micro-templates separate HTML into distinct assets, separate from JavaScript code
- establishing a base UI widget and standard way to modify business logic
- mobile considered from the start, not left as a late addition

|   | **WestlawNext (Jan 2008)** | **Current Products (Jan 2012)** |
| --- | --- | --- |
| Current Browser Versions | Internet Explorer 7.0<br>Firefox 2.0<br>Safari 3.0 | Internet Explorer 9.0<br>Firefox 9.0<br>Safari 5.1<br>Chrome 17.0 |
| HTML Standard | XHTML | HTML5 + shims |
| CSS | CSS 2.1; custom browser properties; techniques to make older browsers look the same | CSS 3; fewer custom properties, allow older browsers to gracefully degrade, leverage SCSS for variables and macros |
| Browser Support | Use BrowserHawk for browser detection; use white list | Use Modernizr for feature detection and shims/polyfills |
| Mobile | Desktop design, mobile and iPad afterthoughts | Use responsive design for desktop and tablet browsers; plan for custom small form factor views from inception |
| JavaScript Performance (SunSpider 0.9) | IE7 – 19721ms<br>IE8 – 3729ms<br>Safari 4.0.5 – 373ms<br>Firefox 3.6.24 – 770ms | IE9  – 236ms<br>Chrome 17 – 305ms<br>Safari 5.1 – 282ms<br>Firefox 9 – 232ms<br>iPhone 4 (iOS5) – 3789ms<br>Bold 9700 (OS6) – 10628ms |
| DOM | Cobalt.js; some jQuery | jQuery, Underscore |
| Pub/Sub | OpenAjax Hub | OpenAjax Hub |
| AJAX | REST, JSON, Cobalt.js | REST, JSON, jQuery |
| Browser rendering | String concatenation or DOM API (inline in JavaScript code) | Underscore micro-templates (in external files) |
| Base UI widget | Each module team had own set of standards; doesn&#39;t allow for cross module reuse | Common widget design using Backbone.js for MVC; make cross module and project reuse possible |
| Unit Testing | Post-deploy with JSUnit and Selenium | Pre-deploy with QUnit and PhantomJS |
| Code Packaging | Custom bundling based on inferred dependencies | Uses AMD proposed standard and RequireJS (explicit dependencies) |
