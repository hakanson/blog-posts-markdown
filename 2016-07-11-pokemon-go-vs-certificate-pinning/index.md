---
title: Pokemon Go vs. Certificate Pinning
slug: pokemon-go-vs-certificate-pinning
author: Kevin Hakanson
date: 2016-07-11
tags: ["http","information security","pokemon"]
---
Saw this Tweet from [@notdan](https://twitter.com/notdan) about the [Pokémon Go](http://www.pokemon.com/us/pokemon-video-games/pokemon-go/) video game and their lack of certificate pinning:

[![@notdan Pokemon Go Tweet](images/pastedImage_9.png)](images/pastedImage_9.png)

At first, I thought "duh, of course, they should have" but then I realized that I need to understand [Certificate and Public Key Pinning](https://www.owasp.org/index.php/Certificate_and_Public_Key_Pinning) better.  I've known about [RFC 7469 - Public Key Pinning Extension for HTTP](https://tools.ietf.org/html/rfc7469) and the HPKP header for a while, but never implemented it for any web applications (where the browser does the check) nor for any mobile/desktop applications (where you need to code the check yourself).

I read though [HPKP: HTTP Public Key Pinning](https://scotthelme.co.uk/hpkp-http-public-key-pinning/) to see how these pins work.  I grabbed the `Public-Key-Pins` header from that blog post using a curl command:

```console
$ curl -sI "https://scotthelme.co.uk/hpkp-http-public-key-pinning/" | grep -Fi public-key-pins

Public-Key-Pins: pin-sha256="X3pGTSOuJeEVw989IJ/cEtXUEmy52zs1TZQrU06KUKg="; pin-sha256="MHJYVThihUrJcxW6wcqyOISTXIsInsdj3xK8QrZbHec="; pin-sha256="isi41AizREkLvvft0IRW4u3XMFR2Yg7bvrF7padyCJg="; pin-sha256="I/bAACUzdYEFNw2ZKRaypOyYvvOtqBzg21g9a5WVClg="; pin-sha256="Y4/Gxyck5JLLnC/zWHtSHfNljuMbOJi6dRQuRJTgYdo="; pin-sha256="/oCVQg3nP3DroGpFdAbaiYzenycUftqrH3LAyaIal2g="; pin-sha256="0PiItvsnLZy1slbsVPGky8YnDsJavMNtxD0TPwsCdC8="; pin-sha256="t3EPvqF+7XoKypCPHyN1b5uey7zTfIGDHn4oBWz2pds="; pin-sha256="zqbcEslrpiH0bA9uhNyl2ovpLEfGJQM/QvZSVumMFJ8="; pin-sha256="V+J+7lHvE6X0pqGKVqLtxuvk+0f+xowyr3obtq8tbSw="; pin-sha256="Myokb3mG16eRkVBE+ZmFSKSpYQzWHKMY1MZbXgA8BkQ="; pin-sha256="WSg/oQliyMYyP6yZ0CzDdQ8PHmtUkoUsOsa5svxxXxo="; pin-sha256="9lBW+k9EF6yyG9413/fPiHhQy5Ok4UI5sBpBTuOaa/U="; pin-sha256="ipMu2Xu72A086/35thucbjLfrPaSjuw4HIjSWsxqkb8="; pin-sha256="6OnjvIKf0SxyerXzg9N0RvQ2sgaL6niV+MLn9wBrh+s="; pin-sha256="9dNiZZueNZmyaf3pTkXxDgOzLkjKvI+Nza0ACF5IDwg="; max-age=2592000; includeSubDomains; report-uri="https://scotthelme.report-uri.io/r/default/hpkp/enforce"
```

I generated the same value as one of the pins (thanks to the example from [Public Key Pinning - Web security | MDN](https://developer.mozilla.org/en-US/docs/Web/Security/Public_Key_Pinning) ):

```console
$ openssl s_client -servername scotthelme.co.uk -connect scotthelme.co.uk:443 \
| openssl x509 -pubkey -noout \
| openssl rsa -pubin -outform der \
| openssl dgst -sha256 -binary \
| openssl enc -base64
depth=1 /C=US/O=Let's Encrypt/CN=Let's Encrypt Authority X3
verify error:num=20:unable to get local issuer certificate
verify return:0
writing RSA key
X3pGTSOuJeEVw989IJ/cEtXUEmy52zs1TZQrU06KUKg=
```

Now that I've leveled up my InfoSec skills, maybe I should go learn more about Pokemon?

**Update**: I was a little scared to login with my Google Account and give the app "Full Account Access" (see [iOS version of Pokémon Go is a possible privacy trainwreck | Ars Technica](http://arstechnica.com/gaming/2016/07/pokemon-go-on-ios-gets-full-access-to-your-google-account/) ) but after reading 
[Have you given Pokémon Go full access to everything in your Google account? | Technology | The Guardian](https://www.theguardian.com/technology/2016/jul/11/pokemon-go-privacy-security-full-access-google-account)  things might not be that bad.
