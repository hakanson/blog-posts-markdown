---
title: cf.Objective() 2014
slug: cfobjective-2014
author: Kevin Hakanson
date: 2014-05-20
tags: ["conference"]
---
Last week I was a [speaker](http://www.cfobjective.com/speakers/kevin-hakanson/) at [cf.Objective() 2014: The World's Only Enterprise ColdFusion Conference](http://www.cfobjective.com/), giving my [Developer's Guide to JavaScript and Web Cryptography](http://www.cfobjective.com/sessions/developers-guide-to-javascript-and-web-cryptography/) presentation.  It took place May 13-16, 2014 at the Radisson Blu - Mall of America, Bloomington, MN.  Session organizers were looking for more Front-End / Mobile / CSS sessions including **js.Objective()**, a full track dedicated to JavaScript topics.

When I was there, I caught a couple interesting (and relevant) sessions.

* [\*\*Keynote Address\*\* Redesigning the Interface: Making Software Development Make Sense to Everyone](http://www.cfobjective.com/sessions/keynote-address-redesigning-the-interface-making-software-development-make-sense-to-everyone/) -
Jen Myers ([@antiheroine](https://twitter.com/antiheroine)) -
[slides](https://speakerdeck.com/jenmyers/redesigning-the-interface)
Jen is a web designer/developer, teacher and speaker from Chicago.  She gave a good presentation on diversity in software development, an especially relevant topic in today's environment.

* [Security Headers - cf.Objective()](http://www.cfobjective.com/sessions/security-headers/) -
Pete Freitag ([@pfreitag](https://twitter.com/pfreitag)) -
[slides](http://slides.com/petefreitag/security-headers) Pete shared some good info on Content-Security-Policy at [Content Security Policy Reference & Examples](http://content-security-policy.com/)

Also, by viewing HTTP headers coming from Google Fonts, I learned about the Timing-Allow-Origin Response header from the [Resource Timing](http://www.w3.org/TR/2014/CR-resource-timing-20140325/) spec:

> The PerformanceResourceTiming interface exposes timing information for a resource to any web page that has included that resource. To limit the access to the PerformanceResourceTiming interface, the same origin policy is enforced by default and certain attributes are set to zero, as described in Section 4.5 Cross-origin Resources. Resource providers can explicitly allow all timing information to be collected for a resource by adding the Timing-Allow-Origin HTTP response header, which specifies the domains that are allowed to access the timing information.

* [Using OWASP ZAP to find vulnerabilities in your web apps](http://www.cfobjective.com/sessions/using-owasp-zap-to-find-vulnerabilities-in-your-web-apps/) -
David Epler ([@dcepler](https://twitter.com/dcepler)) -
To get good at writing secure software, you really should try and hack your own code - ZAP is a tool that can help you do that.

* [Web Components are Awesome (and Polymer too)](http://www.cfobjective.com/sessions/web-components-are-awesome-and-polymer-too/) -
Elliott Sprehn ([@ElliottZ](https://twitter.com/ElliottZ)) -
[slides](http://elliottsprehn.com/preso/webcomponents/) -
Elliott is the tech lead for the web components effort at Google, so he seemed qualified to speak on this topic.  His HTML5 based slide deck was written using Web Components (you can view source and look for `<sd-deck>` and `<sd-slide>` elements).  He also helped me make progress on an open Chromium bug I submitted last fall:  [Issue 304722 -  chromium -  Intl NumberFormat minimumFractionDigits options property not honored](https://code.google.com/p/chromium/issues/detail?id=304722)

* [Leveling Up at Javascript: Understanding the Confusing bits - cf.Objective()](http://www.cfobjective.com/sessions/leveling-up-at-javascript-understanding-the-confusing-bits/)
Jason Dean(12Robots) ([@JasonPDean](https://twitter.com/JasonPDean)) -
Jason is also from MN and the person who shared the call for speakers with the [JavaScriptMN Meetup](http://www.meetup.com/JavaScriptMN/) group last fall.  His presentation was more intro level, but he had great examples of JavaScript variable [hoisting](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var#var_hoisting) which validated his session title by confusing the audience.

* [Panel Discussion: Why Client-Side?](http://www.cfobjective.com/sessions/panel-discussion-why-client-side/) -
Nothing really new in this moderator led panel discussion on client-side vs. server side development, but it did validate that this is a common issue faced by many web developers.  The answer almost always was that "it depends."

* [FutureJS: An Introduction to ECMAScript 6 “Harmony”](http://www.cfobjective.com/sessions/futurejs-an-introduction-to-ecmascript-6-e2809charmonye2809d/) -
Marcin Szczepanski ([@MarcinS](https://twitter.com/MarcinS)) -
Marcin traveled from Australia where he works at [Atlassian](https://www.atlassian.com/).  ECMAScript 6 is adding new language features and syntactic sugar to JavaScript.  Marcin even updated Jason's var hoisting examples, by converting them to [let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let), which gives JavaScript block scope local variables.  It will be a bit before the browsers catch up (took about 4 years for ECMAScript 5), but until then you always have transpilers:  [google/traceur-compiler · GitHub](https://github.com/google/traceur-compiler)

The full [schedule](http://www.cfobjective.com/schedule/) has many more topics with the final slide decks to be available on [slideshare](http://www.slideshare.net/ColdFusionConference) soon.