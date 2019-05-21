---
title: Goodbye Oracle Java 8; Hello Amazon Corretto 8
slug: goodbye-oracle-java-8-hello-amazon-corretto-8
author: Kevin Hakanson
date: 2019-04-22
tags: ["java","macos","open source"]
---
Got the Oracle Java auto-update message on my Mac today, reminding me to "Remove" if installed for "commercial" use.

[![](images/pastedImage_3.png)](images/pastedImage_3.png)

So, I clicked remove and visited [https://docs.aws.amazon.com/corretto/latest/corretto-8-ug/macos-install.html](https://docs.aws.amazon.com/corretto/latest/corretto-8-ug/macos-install.html) to install Amazon Corretto.

[![](images/pastedImage_2.png)](images/pastedImage_2.png)

After this, I still had some JVMs to clean up:

```console
$ /usr/libexec/java_home --verbose
Matching Java Virtual Machines (5):
    1.8.0_212, x86_64:     "Amazon Corretto 8"     /Library/Java/JavaVirtualMachines/amazon-corretto-8.jdk/Contents/Home
    1.8.0_65, x86_64:     "Java SE 8"     /Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home
    1.8.0_45, x86_64:     "Java SE 8"     /Library/Java/JavaVirtualMachines/jdk1.8.0_45.jdk/Contents/Home
    1.8.0_31, x86_64:     "Java SE 8"     /Library/Java/JavaVirtualMachines/jdk1.8.0_31.jdk/Contents/Home
    1.7.0_71, x86_64:     "Java SE 7"     /Library/Java/JavaVirtualMachines/jdk1.7.0_71.jdk/Contents/Home

$ cd /Library/Java/JavaVirtualMachines/
$ sudo rm -rf jdk1.7.0_71.jdk
$ sudo rm -rf jdk1.8.0_31.jdk
$ sudo rm -rf jdk1.8.0_45.jdk
$ sudo rm -rf jdk1.8.0_65.jdk
```

I am now free of Oracle Java,

```console
$ /usr/libexec/java_home --verbose
Matching Java Virtual Machines (1):
    1.8.0_212, x86_64: "Amazon Corretto 8" /Library/Java/JavaVirtualMachines/amazon-corretto-8.jdk/Contents/Home

$ java -version
openjdk version "1.8.0_212"
OpenJDK Runtime Environment Corretto-8.212.04.2 (build 1.8.0_212-b04)
OpenJDK 64-Bit Server VM Corretto-8.212.04.2 (build 25.212-b04, mixed mode)
```