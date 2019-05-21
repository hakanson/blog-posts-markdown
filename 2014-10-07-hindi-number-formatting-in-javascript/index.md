---
title: Hindi Number Formatting in JavaScript
slug: hindi-number-formatting-in-javascript
author: Kevin Hakanson
date: 2014-10-07
tags: ["javascript","i18n"]
---
For a project I am consulting on, we were looking at globalization topics in the browser, including support for Hindi.  I have mostly worked with Latin based character sets in my internationalization efforts, so I wanted to dig into the topic a bit.  I started with my favorite date for test cases and thought I would see how various JavaScript libraries/frameworks handled the formatting.  Testing was done in Chrome 37.

```javascript
var then = new Date (2013,0,1,13,1,1);
```

### AngularJS

```javascript
$filter('date')(then, 'EEEE, d MMMM y h:mm:ss a');
```

> मंगलवार, 1 जनवरी 2013 1:01:01 pm

### Twitter CLDR

```javascript
var fmt = new TwitterCldr.DateTimeFormatter();

fmt.format(then, {"type": 'full'});
```

>मंगलवार, 1 जनवरी 2013 1:01:01 अपराह्न UTC-06:00

### ECMA 402

```javascript
var options = {
  weekday: "long",
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
  hour12: true
};

var dtf = new Intl.DateTimeFormat('hi', options);

dtf.format(then);
```

>मंगलवार, १ जनवरी २०१३ १:०१:०१ अपराह्न

### jQuery Globalize

```javascript
Globalize.format( then , 'F', 'hi' );
```

>01 जनवरी 2013 13:01:01

### MomentJS

```javascript
moment(then).format('LLLL');
```

>मंगलवार, १ जनवरी २०१३, दोपहर १:०१ बजे

Now, these aren't exactly the same format options across the libraries, but they are close.  You can see similar string values across the libraries, but you may notice that AngularJS and MomentJS use Devanagari numerals instead of our familiar 0-9 (see [Indian numerals](http://en.wikipedia.org/wiki/Indian_numerals)).

| Modern Devanagari | Hindu–Arabic | Hindi word for the cardinal numeral |
|---|---|---|
| ० | 0 | śūnya (शून्य) |
| १ | 1 | ék (एक) |
| २ | 2 | do (दो) |
| ३ | 3 | tīn (तीन) |
| ४ | 4 | cār (चार) |
| ५ | 5 | pān̄c (पाँच) |
| ६ | 6 | chaḥ (छः) |
| ७ | 7 | sāt (सात) |
| ८ | 8 | āṭh (आठ) |
| ९ | 9 | nau (नौ) |

I looked in the ECMA 402 specification and found Devanagari referenced as deva (U+0966 to U+096F) in [Table 2 – Numbering systems with simple digit mappings](http://www.ecma-international.org/ecma-402/1.0/#table-2). The "Date and time formatting options" section of [ECMAScript Internationalization API](http://generatedcontent.org/post/59403168016/esintlapi) gave me a clue on the next steps.

_As with NumberFormat, the numberingSystem property can only be set with the Unicode u extension to the language tag, using the nu keyword._

I decided to reduce my test case to some simpler number formatting to continue my experiment.  Chrome, Firefox and IE 11 all supported both "hi-u-nu-latn" and "hi-u-nu-deva" as extensions.

```javascript
num = 1234567890

1234567890

num.toLocaleString("hi-u-nu-latn")

"1,23,45,67,890"

num.toLocaleString("hi-u-nu-deva")

"१,२३,४५,६७,८९०"
```

However, Chrome 37 was alone in selecting "deva" as the default numbering system.  Firefox, IE 11, and even Chrome 40 canary selected "latn" instead.

```javascript
(new Intl.NumberFormat("hi")).resolvedOptions()

Object {locale: "hi", numberingSystem: "deva", style: "decimal", useGrouping: true, minimumIntegerDigits: 1…}

(new Intl.NumberFormat("hi")).format(num)

"१,२३,४५,६७,८९०"
```

The formatting mystery has been solved.  If I continued, I would look at how to parse these same formatted numbers and dates in JavaScript.  I am less confident about that.