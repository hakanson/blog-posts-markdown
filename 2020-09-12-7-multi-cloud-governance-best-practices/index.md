---
title: 7 Multi-Cloud Governance Best Practices
slug: /2020-09-12-7-multi-cloud-governance-best-practices
author: Kevin Hakanson
date: 2020-09-12
tags: ["cloud","security","architecture"]
canonical: https://opscompass.com/resources/blog/7-multi-cloud-governance-best-practices/
---

I recently authored a [presentation on adopting multi-cloud](https://www.brighttalk.com/webcast/14725/430858), and pulled together this list of 7 multi-cloud best practices as a quick summary of the session. While I don’t claim this is an exhaustive list, it is a good starting point for those on a multi-cloud adoption journey.

**#1 - Know why you are multi-cloud**

Organizations use multiple clouds for a variety of reasons. But it is not always right for every company or every situation. When I read [Multi-Cloud is the Worst Practice](https://www.lastweekinaws.com/blog/multi-cloud-is-the-worst-practice/), I was drawn to this comment:

> In practice, every “we’re multi-cloud” story I’ve ever seen in the wild means “we’re over 80% on our primary provider, then have a smattering of workloads on others.”

Sometimes multi-cloud is just a fact of doing business, whether you have a strategic initiative to migrate between clouds, or the result of a merger or acquisition has left you with a multi-cloud footprint. It is critical to understand your reason for being multi-cloud.

**#2 – Write down “your” definitions**

“Common” terminology like **cloud-native** and **cloud-agnostic** seem to have different meanings, depending on the situation and whom you ask. Document your contextual meaning and provide examples. Take the case of Amazon DocumentDB (with _MongoDB_ compatibility) or Azure Cosmos DB’s API for _MongoDB_ – are these cloud-native because they are a PaaS service, cloud-agnostic because they support the _MongoDB_ protocol, or is the only “approved” implementation hosting your own _MongoDB_ instance on IaaS?

**#3 – Review multiple Shared Responsibility Models**

When it comes to shared responsibility for cloud security, a common theme emerges of separating the cloud provider’s responsibility and your responsibility as the cloud customer[\[1\]](#_ftn1). These models have differences in their layers, but the top level of each highlights protecting customer data.

*   [AWS - Shared Responsibility Model](https://aws.amazon.com/compliance/shared-responsibility-model/)
*   [Google Cloud - Shared Responsibility Model](https://cloud.google.com/blog/products/containers-kubernetes/exploring-container-security-the-shared-responsibility-model-in-gke-container-security-shared-responsibility-model-gke)
*   [Microsoft Azure - Shared Responsibility Model](https://docs.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility)

**#4 – Evaluate multiple Cloud Adoption Frameworks**

Each framework has a different approach and adds value to the ongoing conversation about multi-cloud adoption. There is a common understanding that alignment between Business and IT is needed for a successful cloud adoption and that security plays a central and ongoing role.

*   [AWS Cloud Adoption Framework](https://aws.amazon.com/professional-services/CAF/)
*   [The Google Cloud Adoption Framework](https://cloud.google.com/adoption-framework/)
*   [Microsoft Cloud Adoption Framework for Azure](https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/overview)

**#5 – Consult multiple Well-Architected Frameworks**

This set of documents has more cloud-native than cloud-agnostic advice, but each cloud provider has (basically) aligned on a common set of pillars: Operational Excellence, Security, Reliability, Performance Efficiency, and Cost Optimization.

*   [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
*   [Google Cloud’s Architecture Framework](https://cloud.google.com/architecture/framework)
*   [Microsoft Azure Well-Architected Framework](https://docs.microsoft.com/en-us/azure/architecture/framework/)

**#6 – Know your proper names**

Each hyperscale cloud provider has similar core concepts, but often use different names. An **Account** in AWS is like a **Project** in GCP and is like a **Subscription** in Microsoft Azure. Each of these terms describe the core container of cloud resources and can be organized into a hierarchy with policies applied at different levels. Another common element, a “load balancer” might be at the application level (e.g. OSI Layer 4 or HTTP), or at the network level (e.g. OSI Layer 4 or TCP), or allow for either. Watch out when trying to make your terminology cloud-agnostic when you really need to be using the cloud-native service names.

**#7 – Plan for the impact on your Cloud Center of Excellence**

Hopefully your [Cloud Center of Excellence (CCoE)](/blog/cloud-center-of-excellence-drives-success) team members are already experts at the cloud adoption functions of governance, security, and automation. But, people and skills are often an organization’s limiting factor, and you need to focus on workloads and business outcomes. A CCoE team needs to have multi-cloud insight into the security and governance across all your workloads and their corresponding dependencies whether IaaS, PaaS, or SaaS. My recommendation is to find an independent, trusted partner (specialty consultant or software vendor) who focuses all their time thinking about multi-cloud to help.

[\[1\]](#_ftnref1) [CIS: _Shared Responsibility for Cloud Security: What You Need to Know_](https://www.cisecurity.org/blog/shared-responsibility-cloud-security-what-you-need-to-know/)

---

*Original version appears on the [OpsCompass blog](https://discover.opscompass.com/blog/7-multi-cloud-governance-best-practices)*