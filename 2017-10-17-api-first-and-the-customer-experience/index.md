---
title: API-First and the Customer Experience
slug: api-first-and-the-customer-experience
author: Kevin Hakanson
date: 2017-10-17
tags: ["api"]
---
[Enabling distributed digital business with API-first architecture (Google Cloud Next '17)](https://www.youtube.com/watch?v=9SmXhbgYmbU) was a good, high-level overview of API strategies, and reminds me of our internal Customer Experience Model and Customer Experience Principles goals.

The "Inside-out" vs. "Outside-in" perspective is analogous to how developers used to build UIs, but we now utilize a Central UX: Experience Design & Research team to focus on the user (vs. the feature).

[!["Inside-out" - service provider view](images/pastedImage_2.png)](images/pastedImage_2.png)

[!["Outside-in" - digital consumer view](images/pastedImage_3.png)](imagespastedImage_3.png)

APIs serve different purposes, and your internal APIs might not be the SDKs or “experience APIs” the external developer needs.

* APIs as services (e.g. Web)
* APIs as interactions (e.g. Mobile or Partners)
* APIs as products (e.g. Devices)

[![API layers](images/pastedImage_6.png)](images/pastedImage_6.png)

The "mediation layer" above is where an API Gateway fits in, and where many of the non-functional requirements can be addressed.