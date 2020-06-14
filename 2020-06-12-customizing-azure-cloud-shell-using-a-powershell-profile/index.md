---
title: Customizing Azure Cloud Shell using a PowerShell Profile
slug: /2020-06-12-customizing-azure-cloud-shell-using-a-powershell-profile
author: Kevin Hakanson
date: 2020-06-12
tags: ["azure", "powershell", "cloudshell"]
---

After creating resources in the wrong subscription during some Azure training, I wrote [Setting Subscription used inside Azure Cloud Shell](/2020-01-08-setting-subscription-used-inside-azure-cloud-shell).  There I had used the PowerShell [Get-AzContext](https://docs.microsoft.com/en-us/powershell/module/az.accounts/get-azcontext?view=azps-4.2.0) cmdlet to determine my active Azure subscription.

```powershell
PS /home/kevin> Get-AzContext | Select-Object -Property Name, Subscription, Tenant | Format-List

Name         : Windows Azure  MSDN - Visual Studio Premium (11111111-1111-4000-11111111111111111) - MSI@50342
Subscription : 1111111-1111-4000-11111111111111111
Tenant       : 00000000-0000-4000-00000000000000000
```

I was recently reminded [about PowerShell profiles](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_profiles?view=powershell-7) and found I could [use a custom profile](https://docs.microsoft.com/en-us/azure/cloud-shell/quickstart-powershell#use-custom-profile) inside Azure Cloud Shell.  If you create a script and save it under `$profile.CurrentUserAllHosts`, it will be loaded during every PowerShell based Azure Cloud Shell session.

```powershell
PS /home/kevin> Write-Output $profile.CurrentUserAllHosts
/home/kevin/.config/PowerShell/profile.ps1
```

Outputting the `Name` property from `Get-AzContext` seemed like and easy way to remind myself of both the Azure subscription name and GUID as soon as I clicked on [shell.azure.com](https://shell.azure.com/) 

```powershell
PS /home/kevin> Get-Content $profile.CurrentUserAllHosts
Microsoft.PowerShell.Utility\Write-Verbose -Verbose -Message "Active Azure Subscription = $((Get-AzContext).Name)"
```

Now, when starting a new Azure Cloud Shell session using PowerShell, I am greeted with a reminder of my active Azure subscription:

```powershell
Requesting a Cloud Shell.Succeeded.
Connecting terminal...


MOTD: Scripts installed with 'Install-Script' can be run from the shell

VERBOSE: Authenticating to Azure ...
VERBOSE: Loading AllHosts profile ...
VERBOSE: Active Azure Subscription = Windows Azure  MSDN - Visual Studio Premium (1111111-1111-4000-11111111111111111) - MSI@50342
VERBOSE: Building your Azure drive ...
PS /home/kevin>
```

Notice that I decided to output using [Write-Verbose](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/write-verbose?view=powershell-7) with the `-Verbose` option to match the style of the other startup messages, instead of using [Write-Output](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/write-output?view=powershell-7) or [Write-Host](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/write-host?view=powershell-7).  Here is how they each behave.


```powershell
PS /home/kevin> Write-Output "test output"
test output

PS /home/kevin> Write-Host "test host"
test host

PS /home/kevin> Write-Verbose "test verbose"
PS /home/kevin> Write-Verbose -Verbose "test verbose"
VERBOSE: test verbose
PS /home/kevin> $VerbosePreference
SilentlyContinue
PS /home/kevin> $VerbosePreference = "Continue"
PS /home/kevin> Write-Verbose "test verbose"
VERBOSE: test verbose
```