---
title: Veracode API HMAC Authentication in Python
slug: /2019-09-06-veracode-api-hmac-authentication-in-python
author: Kevin Hakanson
date: 2019-09-06
tags: ["security", "codequality", "python"]
---
  Back on 26 August 2019, I created a [GitHub issue](https://github.com/ctcampbell/veracode-python-hmac-example/issues/1) on [veracode-python-hmac-example](https://github.com/ctcampbell/veracode-python-hmac-example) since it didn't work with Python 3.7.  I also reached out to Veracode Support who replied right away with a compatible `.whl` file.  Today I learned that the [Veracode API Signing](https://pypi.org/project/veracode-api-signing/) Library is now available on PyPI for HMAC authentication.

As a test, I wanted to write some Python code for [getapplist.do](https://help.veracode.com/reader/LMv_dtSHyb7iIxAQznC~9w/b94PkyMxvs8cz9nxt4rwVA) to mimic this usage of the Java based CLI.

```console
$ java -jar ~/.veracode/VeracodeJavaAPI.jar \
  -vid [redacted] \
  -vkey [redacted \
  -action getapplist
```

I was able to run this code and get the same result from the [Veracode XML API](https://help.veracode.com/reader/LMv_dtSHyb7iIxAQznC~9w/pd_p6JjB9PcDNH3GzWF5Ag).

```python
import sys
import requests
from veracode_api_signing.plugin_requests import RequestsAuthPluginVeracodeHMAC

VERACODE_API_URL = 'https://analysiscenter.veracode.com/api/5.0/'

if __name__ == "__main__":

    result = requests.post(VERACODE_API_URL + "getapplist.do", 
                           auth = RequestsAuthPluginVeracodeHMAC(), 
                           data={"include_user_info" : "true"})

    print(result.text)
```

This works because the Veracode API Key and Key Secret are located in my `~/.veracode/credentials` file.

```console
$ cat ~/.veracode/credentials 
[default]
veracode_api_key_id = [redacted]
veracode_api_key_secret = [redacted]
```

If you prefer the newer JSON based [Veracode REST APIs](https://help.veracode.com/reader/LMv_dtSHyb7iIxAQznC~9w/gvZeRo~jgxY0DDN~~KfRkw), the same HMAC authentication works.

```python
import json
import sys
import requests
from veracode_api_signing.plugin_requests import RequestsAuthPluginVeracodeHMAC

api_base = "https://api.veracode.com/appsec/v1"

if __name__ == "__main__":

    try:
        response = requests.get(api_base + "/applications",
                                auth=RequestsAuthPluginVeracodeHMAC(),
                                params={"size": "500"})
    except requests.RequestException as e:
        print(e)
        sys.exit(1)

    if response.ok:
        print(json.dumps(response.json(), indent=2))
    else:
        print(response.status_code)
```

Now it's time to explore some more Veracode APIs and add some security automation to my pipelines.
