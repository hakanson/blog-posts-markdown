---
title: Cloud Custodian Code Confusion
slug: cloud-custodian-code-confusion
author: Kevin Hakanson
date: 2018-09-04
tags: ["aws","automation","information security"]
---
A coworker and I were debugging incorrect results with our `app-elb-outdated-securitypolicy.yaml` Cloud Custodian policy.  Here is the filter that gave us 3 results when we were expecting 2:

```yaml
    filters:
      - type: listener
        key: Protocol
        value: HTTPS
      - type: listener
        key: SslPolicy
        value: ['ELBSecurityPolicy-TLS-1-2-2017-01',
          'ELBSecurityPolicy-FS-2018-06',
          'ELBSecurityPolicy-TLS-1-2-Ext-2018-06']
        op: not-in
```

One of the extra items should have been excluded because of the SslPolicy `not-in` clause, but still appeared in our list.  We even changed the values in the array to garbage strings and no effect. So, we did what all good programmers do; assume it was a bug in someone else's code, and try and work around it.  This workaround did what we expected, and we got 2 results:

```yaml
    filters:
      - type: listener
        key: Protocol
        value: HTTPS
      - not:
        - type: listener
          key: SslPolicy
          value: ['ELBSecurityPolicy-TLS-1-2-2017-01',
            'ELBSecurityPolicy-FS-2018-06',
            'ELBSecurityPolicy-TLS-1-2-Ext-2018-06']
          op: in
```

However, that didn't seem right, and since Cloud Custodian is open source, we dug into the [code](https://github.com/capitalone/cloud-custodian/blob/d0687ab74bd882a017d2d780ef991d5a7444836b/c7n/resources/appelb.py#L643) and found both custom logic and this comment:

> Adding the \`matched\` flag will filter on previously matched listeners

So, per the in-code documentation, we should add `matched: true` - this worked as expected.

```yaml
    filters:
      - type: listener
        key: Protocol
        value: HTTPS
      - type: listener
        key: SslPolicy
        value: ['ELBSecurityPolicy-TLS-1-2-2017-01',
          'ELBSecurityPolicy-FS-2018-06',
          'ELBSecurityPolicy-TLS-1-2-Ext-2018-06']
        op: not-in
        matched: true
```

Some comments/frustrations:

* Why couldn't the documentation have better examples?  Going into the source code is a good way to see exactly what is going on, but time-consuming.  This is a down-side of open source.
* Why is the home-grown yaml policy language so confusing?  I like the idea of configuration over code, unless the configuration syntax requires more mental effort than reading code.
* How much harder will complex filter criteria make things.  If we are already struggling, how will this rule complexity scale?
