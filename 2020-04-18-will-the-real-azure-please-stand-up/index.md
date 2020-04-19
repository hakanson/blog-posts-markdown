---
title: Will the real Azure please stand up?
slug: /2020-04-18-will-the-real-azure-please-stand-up
author: Kevin Hakanson
date: 2020-04-18
tags: ["azure", "random"]
---

Naming things is hard.  Each of these "Azure" names appear somewhere (or at some time) in the documentation:

* Azure
* Microsoft Azure
* Azure Cloud
* Microsoft Cloud
* Windows Azure

At the time of this post, Azure has 58 regions worldwide and available in 140 countries.  Some of the Azure definitions include:

* A **region** is a set of datacenters deployed within a latency-defined perimeter and connected through a dedicated regional low-latency network.
* A **geography** is a discrete market, typically containing two or more regions, that preserves data residency and compliance boundaries.
* **Availability Zones** are physically separate locations within an Azure region. Each Availability Zone is made up of one or more datacenters equipped with independent power, cooling, and networking

There are also references to "Sovereign regions" or "[National cloud deployments](https://docs.microsoft.com/en-us/graph/deployments)":

> In addition to our global network of datacenters, Microsoft cloud services are available in three separate national clouds. These national cloud versions are physical and logical network-isolated instances of Microsoft enterprise cloud services that are confined within the geographic borders of specific countries and operated by local personnel.
> 
> Current national clouds include:
> 
> * Microsoft Cloud for US Government
> * Microsoft Cloud Germany
> * Azure and Office 365 operated by 21Vianet in China


Microsoft Cloud for US Government (a.k.a. "[Azure Government](https://azure.microsoft.com/en-us/global-infrastructure/government/)") is only for US government agencies and their partners. It uses physically isolated datacenters and networks (located in U.S. only) but has the same underlying technologies as global Azure.

[Microsoft Azure China](https://azure.microsoft.com/en-us/global-infrastructure/china/) is a physically isolated instance of Azure operated by 21Vianet and requires an account separate from an Azure global account.

Microsoft Cloud Germany (a.k.a. "Microsoft Cloud Germany (Sovereign)") is a physically isolated instance of Microsoft Azure operated by a data trustee.  However, [Microsoft Azure Germany](https://azure.microsoft.com/en-us/global-infrastructure/germany/) are the Frankfurt and Berlin datacenter regions of global Azure. Confused?  [Welcome to Azure Germany](https://docs.microsoft.com/en-us/azure/germany/germany-welcome) explains it as:

> Since August 2018, we have not been accepting new customers or deploying any new features and services into the original Microsoft Cloud Germany locations.
>
> Based on the evolution in customers' needs, we recently launched two new datacenter regions in Germany, offering customer data residency, full connectivity to Microsoft's global cloud network, as well as market competitive pricing.

If you prefer code to documentation, [Get-AzEnvironment](https://docs.microsoft.com/en-us/powershell/module/az.accounts/get-azenvironment?view=azps-3.7.0) "gets endpoints and metadata for an instance of Azure services," and 
[az cloud list](https://docs.microsoft.com/en-us/cli/azure/cloud?view=azure-cli-latest#az-cloud-list) can "list registered clouds," giving you programmatic ways to uncover even different names.

```console
PS /home/kevin> Get-AzEnvironment | Select-Object -Property Name, ActiveDirectoryAuthority, ResourceManagerUrl | Format-Table

Name              ActiveDirectoryAuthority           ResourceManagerUrl
----              ------------------------           ------------------
AzureCloud        https://login.microsoftonline.com/ https://management.azure.com/
AzureUSGovernment https://login.microsoftonline.us/  https://management.usgovcloudapi.net/
AzureGermanCloud  https://login.microsoftonline.de/  https://management.microsoftazure.de/
AzureChinaCloud   https://login.chinacloudapi.cn/    https://management.chinacloudapi.cn/

PS /home/kevin> az cloud list --query "[].{Name:name,ActiveDirectoryAuthority:endpoints.activeDirectory,ResourceManagerUrl:endpoints.resourceManager}" --output table
Name               ActiveDirectoryAuthority           ResourceManagerUrl
-----------------  ---------------------------------  -------------------------------------
AzureCloud         https://login.microsoftonline.com  https://management.azure.com/
AzureChinaCloud    https://login.chinacloudapi.cn     https://management.chinacloudapi.cn
AzureUSGovernment  https://login.microsoftonline.us   https://management.usgovcloudapi.net/
AzureGermanCloud   https://login.microsoftonline.de   https://management.microsoftazure.de
```

But wait, there's more. If you have an "Azure Stack" (a.k.a "[Azure Stack Hub](https://docs.microsoft.com/en-us/azure-stack/user/?view=azs-2002)") and make a call to [Set-AzEnvironment](https://docs.microsoft.com/en-us/powershell/module/az.accounts/set-azenvironment?view=azps-3.7.0) or [az cloud register](https://docs.microsoft.com/en-us/cli/azure/cloud?view=azure-cli-latest#az-cloud-register), you can name it whatver your want. I call dibs on `AzureKevinHakansonCloud`.

