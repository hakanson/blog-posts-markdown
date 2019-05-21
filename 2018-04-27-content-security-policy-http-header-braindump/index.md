---
title: Content-Security-Policy HTTP Header Braindump
slug: content-security-policy-http-header-braindump
author: Kevin Hakanson
date: 2018-04-27
tags: ["http","web","information security"]
---
From [Content Security Policy (CSP) - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

> **Content Security Policy** ([CSP](https://developer.mozilla.org/en-US/docs/Glossary/CSP)) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting ([XSS](https://developer.mozilla.org/en-US/docs/Glossary/XSS)) and data injection attacks

From [Content Security Policy  |  Web Fundamentals  |  Google Developers](https://developers.google.com/web/fundamentals/security/csp/)

> This overview highlights a defense that can significantly reduce the risk and impact of XSS attacks in modern browsers: Content Security Policy (CSP).

From [Dev guide - Content Security Policy - Microsoft Edge Development | Microsoft Docs](https://docs.microsoft.com/en-us/microsoft-edge/dev-guide/security/content-security-policy)

> The CSP security standard enables web developers to control the resources (script, CSS, plugins, images, etc.) which a particular page can fetch or execute with the aim of preventing cross-site scripting (XSS), clickjacking, and other code injection attacks seeking to execute malicious content in the context of a trusted web page.

From [OWASP Top 10 - 2017](https://www.owasp.org/images/7/72/OWASP_Top_10-2017_%28en%29.pdf.pdf) A7 Cross-Site Scripting (XSS)

> Enabling a Content Security Policy (CSP) is a defense-in-depth mitigating control against XSS.

This can be controlled via the [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) HTTP Header.  The [CSP Cheat Sheet](https://scotthelme.co.uk/csp-cheat-sheet/) "is a concise overview of all supported features and directives" and "can be used as a quick reference guide" because of the many examples and external links.  CSP is supported at various levels in all major browsers (see [https://caniuse.com/#search=Content%20Security%20Policy](https://caniuse.com/#search=Content%20Security%20Policy)).  Twitter even sends different policies to different browsers (see [secureheaders/policy\_management.rb at master · twitter/secureheaders · GitHub](https://github.com/twitter/secureheaders/blob/master/lib/secure_headers/headers/policy_management.rb) ), but they could do even better (see [Optimising Twitter's CSP header](https://scotthelme.co.uk/optimising-twitters-csp-header/)).

Some articles for getting started:

* [Google Online Security Blog: Reshaping web defenses with strict Content Security Policy](https://security.googleblog.com/2016/09/reshaping-web-defenses-with-strict.html) 
* [Introduction - Content Security Policy](https://csp.withgoogle.com/docs/index.html) 
* [My Blog Now Has a Content Security Policy - Here's How I've Done It](https://www.troyhunt.com/my-blog-now-has-a-content-security-policy-heres-how-ive-done-it/) 
* [A proper Content Security Policy Generator | 4ARMED](https://www.4armed.com/blog/how-to-create-content-security-policy/) 
* [How to Get Started with a Content Security Policy](https://blog.codeship.com/how-to-get-started-with-a-content-security-policy/)
* [Building a Content Security Policy configuration with CSP Auditor](http://gosecure.net/2017/07/20/building-a-content-security-policy-configuration-with-csp-auditor/)
* [GitHub’s post-CSP journey | GitHub Engineering](https://githubengineering.com/githubs-post-csp-journey/) 
* [Making CSP great again! - Michele Spagnuolo and Lukas Weichselbaum // Speaker Deck](https://speakerdeck.com/mikispag/making-csp-great-again-michele-spagnuolo-and-lukas-weichselbaum)
* [Learning Path: Modern Web Pillars—Security \[Learning Path\]](https://www.safaribooksonline.com/learning-paths/learning-path-modern/9781492035817/9781491985298-video311488) (Safari Online Video)

The HTTP [Content-Security-Policy-Report-Only](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy-Report-Only) response header allows web developers to experiment with policies by monitoring (but not enforcing) their effects.  Several tools leverage this browser reporting to help developers create policies:

* Fiddler:  [GitHub - david-risney/CSP-Fiddler-Extension: Content Security Policy rule collector extension for Fiddler](https://github.com/david-risney/CSP-Fiddler-Extension)
* OWASP ZAP:  [GitHub - GoSecure/csp-auditor: Burp and ZAP plugin to analyse Content-Security-Policy headers or generate template CSP c…](https://github.com/GoSecure/csp-auditor)
* Chrome: [GitHub - 4ARMED/csp-generator-extension: Google Chrome Extension for interacting with 4ARMED's Content Security Policy G…](https://github.com/4ARMED/csp-generator-extension)  along with [GitHub - 4ARMED/csp-backend: Sinatra app that accepts CSP violation reports and generates policies based on them.](https://github.com/4ARMED/csp-backend)
* Report URI CSP Wizard:  [https://scotthelme.co.uk/report-uri-csp-wizard/](https://scotthelme.co.uk/report-uri-csp-wizard/)  

Other tools:

* Report URI: [https://report-uri.com/home/tools](https://report-uri.com/home/tools)
* Firefox: [Display security and privacy policies - Firefox Developer Tools | MDN](https://developer.mozilla.org/en-US/docs/Tools/GCLI/Display_security_and_privacy_policies)
* Google: [CSP Evaluator](https://csp-evaluator.withgoogle.com/) 
* [GitHub - nico3333fr/CSP-useful: Collection of scripts, thoughts about CSP (Content Security Policy)](https://github.com/nico3333fr/CSP-useful)

Since an invalid or incorrect policy will break the web applications, testing is important.  A good strategy is to start with a basic policy (like this one which forces all content to use HTTPS) and build it out to be even more secure.

    Content-Security-Policy: default-src https:; form-action https:; connect-src https: wss:; upgrade-insecure-requests

[How to implement Content Security Policy? | DareBoost Blog](https://blog.dareboost.com/en/2016/08/how-to-implement-content-security-policy/)  comments "that it is possible to use both Content-Security-Policy and Content-Security-Policy-Report-Only headers" which would allow for a basic policy to be in place and an experimental policy to be reported on, either in a lower environment or as part of a testing suite.