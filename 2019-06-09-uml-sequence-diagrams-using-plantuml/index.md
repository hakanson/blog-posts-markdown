---
title: UML Sequence Diagrams using PlantUML
slug: uml-sequence-diagrams-using-plantuml
author: Kevin Hakanson
date: 2019-06-09
tags: ["uml","documentation"]
---
I've blogged before about text notation for UML Sequence Diagrams in [WebSequenceDiagrams notation](../2016-03-01-websequencediagrams-notation), but since we standardize on Lucidchart for diagrams, I found they have [UML Sequence Markup](https://lucidchart.zendesk.com/hc/en-us/articles/208029986) support as well.  However, Lucidchart's dialect looks to be based on [PlantUML](http://plantuml.com/index).  For a better summary that I can provide, take please read [Markdown native diagrams with PlantUML](https://blog.anoff.io/2018-07-31-diagrams-with-plantuml/).  I decided to spin up the PlantUML docker image and take a look:

    docker run -d -p 8080:8080 plantuml/plantuml-server:jetty

Because I love serverless, I used my "[google-fu](https://en.wiktionary.org/wiki/Google-fu)" and found [plantuml-render](https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:293246570391:applications~plantuml-render) in the AWS Serverless Application Repository.  You can also try this interactively at [https://plantuml.nitorio.us/](https://plantuml.nitorio.us/).

Even more exciting to me was that since I have Visual Studio Code support for both Markdown and [PlantUML](https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml), this fenced code block rendered an image as expected.

    ```plantuml
    title call flows  

    participant a as "Aa"
    participant b as "Bb"
    participant c as "Cc"
    participant d as "Dd"

    a->b: sync call  
    activate b
    b->b: in process call
    b->>c: async call  
    activate c  
    c-->b: 202 Accepted  
    a<--b: return value  
    deactivate b
    c->d: background process  
    d->d:
    c<--d:
    deactivate c
    ```

[![UML Sequence Diagram](images/callflows.svg "call flows")](images/callflows.svg)

Later, I am going to think about the best way to check in this text-based UML next to our source code.  I haven't figured out if the rendered images should be checked in as well, generated as part of a build, or just viewed as part of a markdown preview.
