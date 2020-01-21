---
title: Setting Subscription used inside Azure Cloud Shell
slug: /2020-01-08-setting-subscription-used-inside-azure-cloud-shell
author: Kevin Hakanson
date: 2020-01-08
tags: ["azure", "cli", "powershell"]
---
This week I am attending some Azure Architect training, listening to some lectures, and doing some labs.  The course includes Azure credits provided as an Azure Sponsorships subscription, which meant I don't need to use any of my monthly MSDN credits - unless I do something wrong - which I did.

When I first set up [Azure Cloud Shell](https://shell.azure.com/) it used my oldest subscription - so old that it includes "Windows Azure" in the name and was activated in 2014.

> Windows Azure  MSDN - Visual Studio Premium

My `cloud-shell-storage-eastus` is in that subscription, and when I log into the Azure Cloud Shell, it is the default subscription for any resource groups I create.  I realized this after creating some things, but not before too long.  I learned is you can set the active subscription from inside the Azure Cloud Shell using both the Azure CLI and PowerShell.

[Get-AzContext](https://docs.microsoft.com/en-us/powershell/module/az.accounts/get-azcontext?view=azps-3.3.0) and [Get-AzSubscription](https://docs.microsoft.com/en-us/powershell/module/az.accounts/get-azsubscription?view=azps-3.3.0) give us some useful information, including the subscription identifiers.

```powershell
Azure:/
PS Azure:\> Get-AzContext | Select-Object -Property Name, Subscription, Tenant | Format-List

Name               : Windows Azure  MSDN - Visual Studio Premium (11111111-1111-4000-11111111111111111) - MSI@00000
Subscription       : 11111111-1111-4000-11111111111111111
Tenant             : 00000000-0000-4000-00000000000000000

Azure:/
PS Azure:\> Get-AzSubscription | Select-Object -Property Id, Name, TenantId | Format-List

Id                        : 11111111-1111-4000-11111111111111111
Name                      : Windows Azure  MSDN - Visual Studio Premium
TenantId                  : 00000000-0000-4000-00000000000000000

Id                        : 22222222-2222-4000-22222222222222222
Name                      : Azure Pass - Sponsorship
TenantId                  : 00000000-0000-4000-00000000000000000
```
[Set-AzContext](https://docs.microsoft.com/en-us/powershell/module/az.accounts/set-azcontext?view=azps-3.3.0) lets me set `22222222-2222-4000-22222222222222222` as the default.

```powershell
Azure:/
PS Azure:\> Set-AzContext -SubscriptionId 22222222-2222-4000-22222222222222222
```

However, that only affects PowerShell cmdlets and not the Azure CLI commands.  Running [az account list](https://docs.microsoft.com/en-us/cli/azure/account?view=azure-cli-latest#az-account-list) shows the default subscription for the Azure CLI is still `11111111-1111-4000-11111111111111111`.

```powershell
Azure:/
PS Azure:\> az account list --query "[].{Id:id,IsDefault:isDefault,Name:name,TenantId:tenantId}"
[
  {
    "Id": "11111111-1111-4000-11111111111111111",
    "IsDefault": true,
    "Name": "Windows Azure  MSDN - Visual Studio Premium",
    "TenantId": "00000000-0000-4000-00000000000000000"
  },
  {
    "Id": "22222222-2222-4000-22222222222222222",
    "IsDefault": false,
    "Name": "Azure Pass - Sponsorship",
    "TenantId": "00000000-0000-4000-00000000000000000"
  }
]
```

I would need to use [az account set](https://docs.microsoft.com/en-us/cli/azure/account?view=azure-cli-latest#az-account-set) with the `--subscription` parameter to use my "Azure Pass - Sponsorship" subscription.

```powershell
Azure:/
PS Azure:\> az account set --subscription 22222222-2222-4000-22222222222222222
```

Now I need to remember to do these steps every time I start an Azure Cloud Shell.