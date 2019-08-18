---
title: "Amazon DynamoDB Deep Dive: Advanced Design Patterns for DynamoDB (DAT401)"
slug: amazon-dynamodb-deep-dive-advanced-design-patterns-for-dynamodb-dat401
author: Kevin Hakanson
date: 2018-12-04
tags: ["aws","nosql"]
---
Notes from watching [AWS re:Invent 2018: Amazon DynamoDB Deep Dive: Advanced Design Patterns for DynamoDB (DAT401) - YouTube](https://www.youtube.com/watch?v=HaEPXoXVf2k) ([slides](https://www.slideshare.net/AmazonWebServices/amazon-dynamodb-deep-dive-advanced-design-patterns-for-dynamodb-dat401-aws-reinvent-2018pdf)).

A presentation worth watching to understand building DynamoDB solutions better.

* About 29:30 in speaker says "NoSQL is not a flexible database, it is an efficient database" as the speaker pushes on the importance of data modeling and understanding your use cases.
* Speaker's idea is SQL is built for space efficiency and easy to join when you don't know your problem, but CPU heavy - and NoSQL best when you model your data for your specific problem in the right structure, so is flexible for many problems, but not flexible to have 1 data structure for all problems.
* At some point DynamoDB Streams are mentioned, which are a feed of all data writes, and can be used by lambda to do aggregation functions and pre-compute results.
    * [DynamoDB Streams Use Cases and Design Patterns | AWS Database Blog](https://aws.amazon.com/blogs/database/dynamodb-streams-use-cases-and-design-patterns/) 
* About 43 minutes into the video as he talks transaction apis and you should almost always use just 1 table - take a look at this Schema - which I has to pause and study
    * [![](images/pastedImage_2.png)](images/pastedImage_2.png)
* Table at 56:38 is an interesting artifact for a complex data modeling scenario that started a couple minutes before
    * [![](images/pastedImage_3.png)](images/pastedImage_3.png)
* [Best Practices for DynamoDB - Amazon DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
* Conclusions Slide:
    * NoSQL does not mean non-relational
    * The ERD still matters
    * RDBMS is not deprecated by NoSQL
    * Use NoSQL for OTLP or DSS at scale.
    * Use RDBMS for OLAP or OLTP when scale is not important.

[https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)