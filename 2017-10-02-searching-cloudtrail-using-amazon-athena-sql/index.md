---
title: Searching CloudTrail using Amazon Athena SQL
slug: searching-cloudtrail-using-amazon-athena-sql
author: Kevin Hakanson
date: 2017-10-02
tags: ["aws","sql"]
---
I was querying CloudTrail event history for a specific user, `projectID-AppUser`, and it only listed two events when I knew there were more. The AWS Console had a message explaining why:

> Your event history contains the create, modify, and delete activities for supported services taken by people, groups, or AWS services in your AWS account. To view a complete log of your CloudTrail events, create a trail and then go to your Amazon S3 bucket or CloudWatch Logs.

How do I find all the events?  I know the exact day and time (if I can convert to UTC), but didn't want to download 300 .gz files from an S3 bucket and search through them.  Then I remembered Amazon Athena (serverless, interactive query service) and found exactly the blog post that could help me:  [Analyze Security, Compliance, and Operational Activity Using AWS CloudTrail and Amazon Athena | AWS Big Data Blog](https://aws.amazon.com/blogs/big-data/aws-cloudtrail-and-amazon-athena-dive-deep-to-analyze-security-compliance-and-operational-activity/).  I followed the instructions, but because I only cared about a specific day of CloudTrail logs for a specific region, I created a smaller table using that restriction.  The lines from the "create table" SQL I changed were:

```sql
CREATE EXTERNAL TABLE cloudtrail_logs_useast1_20170928

LOCATION 's3://123456789012-cloudtrail-acct-logs/localadmin/AWSLogs/123456789012/CloudTrail/us-east-1/2017/09/28/';
```

Now, my "User name" of "projectID-AppUser" query would find 15 events (Run time: 6.15 seconds, Data scanned: 28.85MB).

```sql
select useridentity.username, eventid, eventtime, eventname 
from sampledb.cloudtrail_logs_useast1_20170928
where useridentity.username = 'projectID-AppUser'
order by eventtime;
```

I could even get the full details on the two `eventid` entries I saw from the AWS Console CloudTrail Event history.

```sql
select *
from sampledb.cloudtrail_logs_useast1_20170928
where eventid = 'bbc83507-e7a0-4464-8684-51d32757d3c8' 
   or eventid = '5a602970-f337-4441-be78-0470e827b28f';
```

If I wanted everything related to `projectID-AppUser`, my query would find 40 events (Run time: 20.94 seconds, Data scanned: 28.87MB)

```sql
select eventid, eventtime, eventname, requestparameters
from sampledb.cloudtrail_logs_useast1_20170928
where requestparameters like '%projectID-AppUser%'
order by eventtime;
```

I used the web console for my interactive queries, but [Accessing Amazon Athena with JDBC](http://docs.aws.amazon.com/athena/latest/ug/connect-with-jdbc.html) is also possible.

This seems like we should "turn on" for the whole account — more work to add to the backlog.