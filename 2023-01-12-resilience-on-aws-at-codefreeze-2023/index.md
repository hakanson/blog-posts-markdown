---
title: Resilience on AWS at CodeFreeze 2023
slug: /2023-01-12-resilience-on-aws-at-codefreeze-2023
author: Kevin Hakanson
date: 2023-01-12
tags: ["aws","architecture","disasterrecovery","conference"]
---

I had a great time talking about [Resilience on AWS](https://cse.umn.edu/umsec/cf23/kevin-hakanson) at Code Freeze 2023 and wanted to share some links to related content.

Some [definitions](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/definitions.html) from the AWS Well Architected Framework reliability pillar:

* **Resilience** - The ability of a *workload* to recover from infrastructure or service disruptions, dynamically acquire computing resources to meet demand, and mitigate disruptions, such as misconfigurations or transient network issues
* **Reliability** - The ability of a *workload* or application to perform its intended function correctly and consistently
* **Availability** - The percentage of time that a *workload* is available for use (e.g. 99.99% available)

Some key Best Practices from the reliability pillar that are key to Resilience.

* REL05 [Design interactions in a distributed system to mitigate or withstand failures](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/design-interactions-in-a-distributed-system-to-mitigate-or-withstand-failures.html)
* REL04 [Design interactions in a distributed system to prevent failures](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/design-interactions-in-a-distributed-system-to-prevent-failures.html)

As with security and sustainability, resilience is a shared responsibility between AWS and the customer; AWS is responsible for resilience of the cloud, and our customers are responsible for resilience of their workloads in the cloud.  Some resources to help:

* [Shared Responsibility Model for Resiliency](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/shared-responsibility-model-for-resiliency.html)
* AWS Solutions Library [Solutions for Resilience](https://aws.amazon.com/solutions/resilience/)
* [The Amazon Builders' Library](https://aws.amazon.com/builders-library/)
* [AWS Fault Isolation Boundaries](https://docs.aws.amazon.com/whitepapers/latest/aws-fault-isolation-boundaries/abstract-and-introduction.html) AWS Whitepaper (Publication date: November 16, 2022)
