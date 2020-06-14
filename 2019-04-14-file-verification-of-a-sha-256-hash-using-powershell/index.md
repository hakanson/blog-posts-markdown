---
title: File Verification of a SHA-256 Hash using PowerShell
slug: /2019-04-14-file-verification-of-a-sha-256-hash-using-powershell
author: Kevin Hakanson
date: 2019-04-14
tags: ["powershell", "security"]
---

I was researching photo apps when I came across the open source [digiKam](https://www.digikam.org/).  Since I was going to download `digiKam-6.0.0-Win64.exe` from a mirror site, I wanted to perform some [file verification](https://en.wikipedia.org/wiki/File_verification) using one of the hash values. 

> File information
> * Filename: Mirrors for digiKam-6.0.0-Win64.exe
> * Filename: digiKam-6.0.0-Win64.exe
> * Path: /stable/digikam/6.0.0/digiKam-6.0.0-Win64.exe
> * Size: 307M (321802858 bytes)
> * Last modified: Sun, 10 Feb 2019 08:31:33 GMT (Unix time: 1549787493)
> * SHA-256 Hash: 3a39d14bf98641dbce2072c9a68099e15acece4f94897113611e16fa4fcb58e8
> * SHA-1 Hash: 7895d692e39e4c90b7c319e85e28b3634b586568
> * MD5 Hash: d61404944f63fdf5c2dac3773d056978

I normally use [shasum](https://linux.die.net/man/1/shasum) for this task since it is available on Linux, macOS, and Windows using Git Bash.

```console
$ shasum -a 256 digiKam-6.0.0-Win64.exe
3a39d14bf98641dbce2072c9a68099e15acece4f94897113611e16fa4fcb58e8 *digiKam-6.0.0-Win64.exe
```
Because I was going to suggest this program to a non-developer Windows 10 user, I wanted to find another way for them to verify.  Since Windows PowerShell is installed by default, I decided to use PowerShell [Get-FileHash](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/get-filehash?view=powershell-5.1).  

```powershell
PS D:\kevin\downloads> Get-FileHash .\digiKam-6.0.0-Win64.exe | Format-List

Algorithm : SHA256
Hash      : 3A39D14BF98641DBCE2072C9A68099E15ACECE4F94897113611E16FA4FCB58E8
Path      : D:\kevin\downloads\digiKam-6.0.0-Win64.exe
```

From that output, I can compare the values by copying the value and doing a "find" on the download page.  But now that I was playing around with PowerShell, I wanted to explore better ways and did some exploration.

```powershell
PS D:\kevin\downloads> $hash = Get-FileHash .\digiKam-6.0.0-Win64.exe
PS D:\kevin\downloads> $hash.hash
3A39D14BF98641DBCE2072C9A68099E15ACECE4F94897113611E16FA4FCB58E8
PS D:\kevin\downloads> $hash.hash -eq "3a39d14bf98641dbce2072c9a68099e15acece4f94897113611e16fa4fcb58e8"
True
```

I wasn't expecting the case insensitive compare to work, but [About Comparison Operators](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_comparison_operators?view=powershell-5.1) verified this was the default as well as the other options.

> By default, all comparison operators are case-insensitive. To make a comparison operator case-sensitive, precede the operator name with a *c*. For example, the case-sensitive version of *-eq* is *-ceq*. To make the case-insensitivity explicit, precede the operator with an *i*. For example, the explicitly case-insensitive version of *-eq* is *-ieq*.

Putting everything together, I can use this 1-liner as future reference.

```powershell
PS D:\kevin\downloads> (Get-FileHash .\digiKam-6.0.0-Win64.exe).hash -eq "3a39d14bf98641dbce2072c9a68099e15acece4f94897113611e16fa4fcb58e8"
True
```
