---
title: JavaScript vs. JSON encoding
slug: javascript-vs-json-encoding
author: Kevin Hakanson
date: 2009-08-03
tags: ["javascript"]
---
In the process of converting some JavaScript code which creates an object from a JSON string from using (the evil) eval to using JSON.parse (which is native in [IE8](http://blogs.msdn.com/ie/archive/2008/09/10/native-json-in-ie8.aspx) and [Firefox 3.5](https://developer.mozilla.org/En/Using_JSON_in_Firefox)), a strange bug was encountered.  Take the following JavaScript snippet, which can be validated using [JSLint](http://www.jslint.com/).

> var x = { "name" : "Kevin\\'s Folder" };

However, if you take { "name" : "Kevin\\'s Folder" } and try and validate with [JSONLint](http://www.jsonlint.com/), it fails parsing.  Why is that?  Look at the definition for string at [JSON.org](http://www.json.org/), and you see that it's not valid to escape the single quote character.  This appears to be because only double quotes are a valid wrapper for a string in JSON, where either single quotes or double quotes are allowed for JavaScript strings.  The JavaScript escape utility used wouldn't know how the consumer would wrap the string, so it played it safe and escaped both.

The moral of this story?  JSON is a proper subset of pure JavaScript object literals.