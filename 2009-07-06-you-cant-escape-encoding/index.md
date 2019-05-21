---
title: You can’t escape encoding
slug: you-cant-escape-encoding
author: Kevin Hakanson
date: 2009-07-06
---
Recently I have run across several items where the solution to the problem was a proper understanding of encoding and escaping.  One issue was with the [YUICompressor](http://developer.yahoo.com/yui/compressor/) having problems with some of our JavaScript files.  The core issue was that it couldn't handle files saved in UTF-8 with the Byte Order Mark (which is the Visual Studio 2008 default).  Lucky for someone, I was able to answer a [Stack Overflow question](http://stackoverflow.com/questions/1036201/errors-using-yuicompressor/1047143#1047143) with my new found knowledge.

A short while later, I saw a bug where the subject line of delivery emails looked like:

> \=?ANSI\_X3.4-1968?Q?=3F=3F\_1.\_Title\_and\_Divisions\_of\_Code?= 

I referred the developer to the three parameter version of the encodeText function of Java's [MimeUtility](http://java.sun.com/j2ee/sdk_1.3/techdocs/api/javax/mail/internet/MimeUtility.html).  This has a "set of methods to encode and decode MIME headers as per [RFC 2047](http://www.ietf.org/rfc/rfc2047.txt)."  In this case, by using the one parameter version, the code was subject to some OS specific setting which worked on the developer's computer running Windows but not when deployed to Linux.

To help my fellow developers, here's a link to [The Absolute Minimum Every Software Developer Absolutely, Positively Must Know About Unicode and Character Sets (No Excuses!)](http://www.joelonsoftware.com/articles/Unicode.html) by Joel Spolsky.  He does a great job of walking through the subject.  Also, I recently found this nifty link to an online [Text Escaping and Unescaping in JavaScript](http://0xcc.net/jsescape/) utility.  Try pasting ¶§ into the plain text field and look at the results.  The "MIME + Quoted-printable" section is the same as Encoded Word from RFC 2047.

For me, to fully understand UTF-8 encoding, I had to walk myself through an example, which I include here:

When a Unicode (ISO 10646) character in the range of 0x80 - 0x799 is encoded using UTF-8, it takes up 2 bytes of space. Since printable ISO-8859-1 characters (aka Latin 1 or upper ASCII) are in the range of 0xA0 - 0xFF - they fall into this category.

> BYTE 1 = 1100 0000 | (0001 1111 & b)  
> BTYE 2 = 1000 0000 | (0011 1111 & b)

So for a character like é (Latin Small Letter E with Acute)

> é = 233 = 0xE9 = 1110 1011

when it's UTF-8 encoded

> 1100 0011 1010 1001 = 0xC3 0xA9 = Ã©

Notice that when encoding ISO-8859-1 with UTF-8 and you happen to view the output as ISO-8859-1, the first character of the two is always a capital A with some variation. The following table can help describe why.

> range byte 1 display char  
> 0x80 - 0x9F (128-159) 0xC0 À  
> 0xA0 - 0xBF (160-191) 0xC1 Á  
> 0xC0 - 0xDF (192-223) 0xC2 Â  
> 0xE0 - 0xFF (224-255) 0xC3 Ã

Another "odd" situation exists when the Copyright Sign or Pound Sign value from unicode

> © = 169 = 0xA9 = 1010 1001  
> £ = 163 = 0xA3 = 1010 0011

is UTF-8 encoded, and become the Â character followed by themselves.

> 1100 0010 1010 1001 = 0xC3 0xA9 = Â©  
> 1100 0010 1010 0011 = 0XC3 0xA3 = Â£