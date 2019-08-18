---
title: "Application Security Testing: SAST, DAST, and IAST"
slug: application-security-testing-sast-dast-and-iast
author: Kevin Hakanson
date: 2017-07-20
tags: ["information security"]
---
Definitions from [Magic Quadrant for Application Security Testing](https://www.utest.com/articles/magic-quadrant-for-application-security-testing) 

> Gartner defines the application security testing (AST) market as the buyers and sellers of products and services designed to analyze and test applications for security vulnerabilities. Gartner identifies three main styles of AST:
>
> * Static AST (SAST) technology analyzes an application's source, bytecode or binary code for security vulnerabilities, typically at the programming and/or testing phases of the software development life cycle (SDLC).
> * Dynamic AST (DAST) technology analyzes applications in their dynamic running state during testing or operational phases. It simulates attacks against an application (typically web-enabled applications and services) and analyzes the application's reactions to determine whether it is vulnerable.
> * Interactive AST (IAST) technology combines inside-out observation of a running application being tested with DAST simultaneously. It is typically implemented as an agent within the test runtime environment (for example, instrumenting the Java Virtual Machine \[JVM\] or .NET CLR) that observes operation or attacks from within the application and identifies vulnerabilities.

How is Veracode?

> Veracode is a well-established global AST provider with a strong presence in the North American market as well as presence in the European market. Veracode's offering includes SAST, DAST and SCA cloud services, as well as IAST (and RASP).  
> In the last 12 months, Veracode launched Greenlight, a SAST service to be used early on in the development process by integrating into the IDE to scan an individual class or file. In addition to Greenlight, Veracode provides the Developer Sandbox, which can statically scan an application or component and measure results without impacting or penalizing developer metrics. Veracode focused some of its recent efforts on extending its language and framework support, as well as SDLC integration, and most recently it announced a single instrumentation agent to provide IAST and RASP capabilities.  
> Veracode will meet the requirements of organizations looking for a broad set of AST services and that want support for their AST and SCA from a third-party expert with a comprehensive AST solution.
>
> STRENGTHS  
> Gartner clients highly rate the ease of use of the solution, as well as the vendor's support and willingness to work with customer requirements.  
> Veracode provides a comprehensive AST-as-a-cloud service. The results of all types of testing can be integrated into a single dashboard to simplify vulnerability management and remediation.  
> For integration into SDLC processes, Veracode offers built-in integration with multiple IDEs, bug-tracking systems and build servers, as well as APIs for integration, Greenlight and the Developer Sandbox.
>
> CAUTIONS  
> Veracode does not offer AST tools, only AST as a service, though it provides a virtual scan appliance that can be located on the client's network to support discovery and testing of internal applications, with scanning configured and controlled via the cloud service.  
> Veracode SAST requires byte/binary code for analysis of compiled languages, such as Java, C/C# and Objective-C. This requires the application to be compiled before being shipped to Veracode for analysis.  
> Veracode's IAST is still on early availability and needs to establish itself in the market.