---
title: Architecture Decision Records (ADRs)
slug: architecture-decision-records-adrs
author: Kevin Hakanson
date: 2018-12-18
tags: ["architecture","agile"]
---
Recently, I was asked to do an architecture review on a couple of projects - one was just getting started, and the other was a PoC demoed at a user conference.  Unfortunately, as with too many "agile" projects, existing architecture documentation could fit on a post-it note.

This situation was explainable, but something I wanted to change going forward.  Given these were cloud-native projects looking at newer PaaS services, I concede that it is hard to know the entire architecture up front.  However, creating a simple Lucidchart diagram with ~10 icons doesn't take long, so I took my best guess and made one for them.  I am OK with emergent design distributed amongst the team, but there needs to be a way for architecture documentation to happen.

I remembered something from a ThoughtWorks blip called [Lightweight Architecture Decision Records](https://www.thoughtworks.com/radar/techniques/lightweight-architecture-decision-records) and did some google searching.  [Distribute Design Authority with Architecture Decision Records | Agile Alliance](https://www.agilealliance.org/resources/experience-reports/distribute-design-authority-with-architecture-decision-records/) is a good article on the topic with a good set of references (for which I added links):

> * Architecture Decision Record (ADR). (n.d.). Retrieved July 2, 2018, from [https://github.com/joelparkerhenderson/architecture\_decision\_record](https://github.com/joelparkerhenderson/architecture_decision_record) 
> * Keeling, M. (2017). [Design It! From Programmer to Software Architect.](https://learning.oreilly.com/library/view/design-it/9781680502923/) Raleigh, NC: Pragmatic Programmers.
> * Keeling, M., & Runde, J. (2017). [Architecture Decision Records in Action.](https://saturn2017.sched.com/event/9k2y/architecture-decision-records-in-action) SATURN. Denver.
> * Nygard, M. (2011, November 15). Documenting Architecture Decisions. Retrieved July 2, 2018, from [http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions](http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions) 
> * Runde, J., Gala, C., & Keeling, M. (2018). [Architectural Hoisting: Or How I Learned to Stop Writing Breaking Code and Love the Architecture.](https://saturn2018.sched.com/event/Ds0M/architectural-hoisting-or-how-i-learned-to-stop-writing-breaking-code-and-love-the-architecture) SATURN. Plano.
> * Tyree, J., & Akerman, A. (2005). [Architecture Decisions: Demystifying Architecture.](https://www.utdallas.edu/~chung/SA/zz-Impreso-architecture_decisions-tyree-05.pdf) IEEE Software , 22 (2), 19-27.

Anyone using Architecture Decision Records?  If so, are you storing them on a wiki, or alongside your source code?  What about diagrams - Lucidchart (easy to access/collaborate) or something like [https://www.draw.io/](https://www.draw.io/) where you can check in the .xml into your repository?