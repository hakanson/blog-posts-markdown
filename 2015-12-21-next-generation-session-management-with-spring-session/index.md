---
title: Next Generation Session Management with Spring Session
slug: next-generation-session-management-with-spring-session
author: Kevin Hakanson
date: 2015-12-21
tags: ["java","spring"]
---
I read [Next Generation Session Management with Spring Session](http://www.infoq.com/articles/Next-Generation-Session-Management-with-Spring-Session) wondering if there was overlap.  However, it looks more like a cloud native drop-in for your existing Java session aware code with easier ways to hook into "non web requests" like JMS or WebSockets.  It maybe useful for those microservices that still need a key/value session that isn't tied to a service instance.

* * *

> **Conclusion**
>
>Spring Session brings innovation back to the enterprise Java session management space making it easy to:
>
> * Write horizontally scalable cloud native applications.
> * Offload the storage of the session state into specialized external session stores, such as Redis or Apache Geode, that provide high quality clustering in an application server independent way.
> * Keep the HttpSession alive when users are making requests over WebSocket.
> * Access session data from non web request processing code such as JMS message processing code.
> * Support multiple sessions per browser making it easy to build a richer end-user experience.
> * Control how session ids are exchanged between the client and server making it easy to write Restful API’s that can extract the session id from an HTTP header rather than relying on cookies.
>
> If you are looking to move off a traditional heavyweight application server but are held back because you are using the session clustering features of the app server then Spring Session is a great step on the road to lighter weight containers such as Tomcat, Jetty or Undertow.