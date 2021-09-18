---
title: My first jQuery ticket
slug: /2009-05-20-my-first-jquery-ticket
author: Kevin Hakanson
date: 2009-05-20
tags: ["javascript","jquery","opensource"]
---

Back in May 2009, I created my first jQuery ticket: [Use native JSON.parse if available inside ajax.httpData](https://bugs.jquery.com/ticket/4429)

> In jQuery.ajax.httpData, would you consider using the native JSON support (​http://www.json.org/js.html) if available? Below is some untested sample code. Maybe the (JSON && JSON.parse) check is better located under jQuery.support.JSON and could be expanded to check if JSON.parse is a function?
>  
> ```javascript
> // Get the JavaScript object, if JSON is used.
> 
> if ( type == "json" )
>	if (JSON && JSON.parse)
>		data = JSON.parse(data);
>	else 	
>		data = window["eval"]("(" + data + ")");
> ```

Today, it was fixed and closed by John himself.