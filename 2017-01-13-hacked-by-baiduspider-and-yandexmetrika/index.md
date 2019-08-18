---
title: "\"Hacked\" by Baiduspider and YandexMetrika"
slug: hacked-by-baiduspider-and-yandexmetrika
author: Kevin Hakanson
date: 2017-01-13
tags: ["aws","information security"]
---
Earlier this week, I was investigating the preview of [AWS X-Ray – Distributed Tracing System](https://aws.amazon.com/xray/) and got quite a scare.  After I deployed my sample app to [AWS Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/), I went into the AWS X-Ray Console to look at my trace data and saw more domain names listed than just the `dev-env.3tp23hiz9p.us-east-1.elasticbeanstalk.com` I was expecting - including at least one domain that is NSFW!

[![X-Ray Service Map](images/Screen+Shot+2017-01-13+at+7.45.41+AM.png)](images/38-631167-1038205/Screen+Shot+2017-01-13+at+7.45.41+AM.png)

I got scared we had been hacked!  I started doing a nslookup on those domain names, trying to track down the IP address so I could find the EC2 instance and kill it.  All of these domains pointed to the same set of IPs and looked to be hosted by a company named wix.com that also uses AWS.

```
www.allbione.com canonical name = www18.wixdns.net.  
www18.wixdns.net canonical name = premium.42.wix.com.  
premium.42.wix.com canonical name = dispatchers-premium-693024781.us-east-1.elb.amazonaws.com.  
Name: dispatchers-premium-693024781.us-east-1.elb.amazonaws.com  
Address: 52.21.74.6  
Name: dispatchers-premium-693024781.us-east-1.elb.amazonaws.com  
Address: 52.72.254.231  
Name: dispatchers-premium-693024781.us-east-1.elb.amazonaws.com  
Address: 107.23.215.71
```

I couldn't find the servers; I couldn't figure out what was going on; I needed some help.  Luckily, I saw my boss was also working late so I started a online conversation.  We looked at the API activity history in Cloud Trail and didn't find any evidence.  Eventually, he noticed the incoming IPs and we looked at the access logs. In addition to my Mac, we saw traffic from Baiduspider and YandexMetrika.

```
172.31.11.216 - - \[11/Jan/2017:23:51:11 +0000\] "GET / HTTP/1.1" 200 13 "-" "Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)" "180.76.15.7"  
172.31.11.216 - - \[11/Jan/2017:23:51:27 +0000\] "GET /?count=7 HTTP/1.1" 304 0 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10\_10\_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36" "198.179.137.210"  
172.31.11.216 - - \[11/Jan/2017:23:58:51 +0000\] "GET / HTTP/1.1" 200 13 "-" "Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)" "220.181.108.113"  
172.31.11.216 - - \[12/Jan/2017:00:01:45 +0000\] "GET / HTTP/1.1" 200 13 "-" "Mozilla/5.0 (compatible; YandexMetrika/2.0; +http://yandex.com/bots mtmon01i.yandex.ru)" "37.9.118.28"  
172.31.11.216 - - \[12/Jan/2017:00:06:47 +0000\] "GET / HTTP/1.1" 200 13 "-" "Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)" "123.125.71.97"
```

Mystery solved. It appears that these spiders and bots didn't have updated DNS records, and the external IP that AWS assigned my web app must have previously been used by the wix.com hosting platform.  They were just trying to reindex the web based on outdated info.  My web app was a victim of mistaken identity, not elite hackers from China and Russia.

Because this was for a simple test, I had used [The Elastic Beanstalk Command Line Interface (EB CLI)](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html) to make things easy and let it pick the defaults. This created a security group that allowed anyone to connect to port 80 - as you would expect for a public web site.  However, since this was only a test for me, I updated the incoming rule only to allow my IP range.  This stopped the extra log entries from being created.

So, why am I posting this since getting "hacked" by a web spider doesn't contribute to my "street cred" very much?

* A reminder that you can't control external traffic and as soon as something appears on the internet, it will be found.  Everything from our sandbox testing to our production systems needs to understand this and plan for it.
* A realization that at the time I was a bit unclear of what to do next if this had been hackers.  I am going to follow up internally on this topic.