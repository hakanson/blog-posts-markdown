---
title: Understanding CIS Controls and Benchmarks
slug: /2020-06-11-understanding-cis-controls-and-benchmarks
author: Kevin Hakanson
date: 2020-06-11
tags: ["cloud", "security", "cis"]
---

In a conversation about cyber security or cyber defense, you might hear the terms CIS and security controls mentioned as a recommended best practice.  However, without some additional context this is just another TLA (Three Letter Acronym).

The [Center for Internet Security](https://www.cisecurity.org/), Inc. (CIS®) is an independent, non-profit organization that curates consensus-based guides using a volunteer community of security practitioners and cyber experts.  CIS is often used as shorthand for their well-known CIS Controls® and CIS Benchmarks™, which they define as:

*   **CIS Controls** - prescriptive, prioritized, and simplified set of cybersecurity best practices
*   **CIS Benchmarks** - consensus-developed secure configuration guidelines for hardening

Together, they take the most pervasive and dangerous cyber threats and pair them with specific and actionable ways to stop or mitigate a cyber-attack.

## CIS Controls

As a foundational element, CIS Controls are often mapped to regulatory and compliance frameworks, allowing them to be used as a common reference point.  CIS [Mapping and Compliance](https://www.cisecurity.org/cybersecurity-tools/mapping-compliance/) tools include PCI DSS, NIST Cybersecurity Framework (CSF), HIPPA, and ISO 27001.

Sometimes it can be informative to dig into a specific example in order to better understand how the concepts apply. For example, take a scenario where a privileged or "admin" level user account should be protected with more than just a password. This is often referred to as a second factor or multi-factor authentication (MFA).  In the **[CIS Controls V7.1](https://learn.cisecurity.org/cis-controls-download)** document from April 2019, this scenario is part of **CIS Control 4: Controlled Use of Administrative Privileges**.  Included in this **Control** are specific actions that organizations should implement, which are known as **Sub-Controls**.  Related to this example, **Sub-Control 4.5** is **Use Multi-Factor Authentication for All Administrative Access**.

## CIS Benchmarks

There are more than 140 CIS Benchmarks covering different technologies.  The individual recommendations from these benchmarks usually map to the most applicable CIS Control.  Each of the hyperscale public cloud providers have worked with CIS to publish a CIS Benchmark related to their cloud computing services. 

In the **CIS Microsoft Azure Foundations Benchmark v1.1.0** from February 2019, there is a recommendation relating to our “admin” use case:  **1.1 Ensure that multi-factor authentication is enabled for all privileged users**.  The 1.1 numbering is specific to this CIS Benchmark, but there is a reference back to the **4.5 Use Multifactor Authentication For All Administrative Access** Sub-Control. 

The **CIS Amazon Web Services Foundations v1.2.0** from May 2018 also includes this “admin” use case (**1.13 Ensure MFA is enabled for the "root" account)** and references **Sub-Control 4.5** in the recommendation.

The **CIS Google Cloud Platform Foundation Benchmark v1.1.0** from March 2020 includes **1.3 Ensure that Security Key Enforcement is enabled for all admin accounts,** but it references a different CIS Control and Sub-Control related to MFA.  **CIS Control 16** is **Account Monitoring and Control** which includes Sub-Control **16.3 Require Multi-factor Authentication** – an action that targets “all user accounts” and not just “privileged” users.  This isn’t wrong per se, but illustrates that even specific guidance can be subject to interpretation.

The **CIS Microsoft 365 Foundations Benchmark v1.1.0** from December 2019 takes the same approach when **1.1.1 (L1) Ensure multifactor authentication is enabled for all users in administrative roles** (also references Sub-Control 16.3).

## Cybersecurity Tools

The [CIS Cybersecurity Tools](https://www.cisecurity.org/cybersecurity-tools/) page groups CIS Controls and CIS Benchmarks in the ‘Do it yourself’ category. For those on a multi-cloud journey, the single scenario being discussed above involved four separate CIS Benchmark recommendations and not one, but two, CIS Controls.

---

*Original version appears on the [OpsCompass blog](https://discover.opscompass.com/blog/cis-controls-and-benchmarks)*