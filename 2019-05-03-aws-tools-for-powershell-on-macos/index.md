---
title: AWS Tools for PowerShell on macOS
slug: aws-tools-for-powershell-on-macos
author: Kevin Hakanson
date: 2019-05-03
tags: ["aws","macos","powershell"]
---
Since you can never have too many command lines and shells, today I thought about [Installing PowerShell Core on macOS](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell-core-on-macos?view=powershell-6).

```console
$ brew cask install powershell
$ pwsh
PowerShell 6.2.0
Copyright (c) Microsoft Corporation. All rights reserved.

https://aka.ms/pscore6-docs
Type 'help' to get help.

PS> Get-Date

Friday, May 3, 2019 6:49:34 PM
```

After that, it was time for [Setting up the AWS Tools for PowerShell Core on Linux or macOS X](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-getting-set-up-linux-mac.html) and making sure it worked.

```console
PS> Install-Module -Name AWSPowerShell.NetCore -AllowClobber
PS> Import-Module AWSPowerShell.NetCore
PS> Get-AWSPowerShellVersion

AWS Tools for PowerShell Core
Version 3.3.498.0
Copyright 2012-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

Amazon Web Services SDK for .NET
Core Runtime Version 3.3.101.0
Copyright 2009-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

Release notes: https://aws.amazon.com/releasenotes/PowerShell

This software includes third party software subject to the following copyrights:
- Logging from log4net, Apache License
[http://logging.apache.org/log4net/license.html]
```

Then my favorite command: AWS Security Token Service Get Caller Identity

```console
PS> $STS = Get-STSCallerIdentity -ProfileName aws-account-alias -Region us-west-2
PS> $STS.Account
123456789012
PS> $STS.UserId
AROAXXXXXXXXXXXXXXXXX:kevin.hakanson@example.com
PS> $STS.Arn
arn:aws:sts::123456789012:assumed-role/REDACTED-ReadOnly/kevin.hakanson@example.com
```