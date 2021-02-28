---
title: Acclaim Badges to CSV
slug: /2021-02-27-acclaim-badges-to-csv
author: Kevin Hakanson
date: 2021-02-27
tags: ["certification","javascript","monitoring"]
---

From previous blog posts like [I'm a Microsoft Azure Solutions Architect Expert](/2020-10-30-im-a-microsoft-azure-solutions-architect-expert) or [I'm a Microsoft Azure Solutions Architect Expert](/2020-10-30-im-a-microsoft-azure-solutions-architect-expert) you can see I like to celebrate when I pass another certification exam.  I also link to the specific digital badge hosted on the Credly Acclaim platform.  You can see all my badges at [Kevin Hakanson - Badges - Acclaim](https://www.youracclaim.com/users/kevin-hakanson/badges).

However, I also wanted to celebrate my co-workers and was looking for an API to monitor whey they achieved additional certifications.  I didn't find exactly what I wanted, but I appending `.json` to that badges URL gave me what I needed.

> https://www.youracclaim.com/users/kevin-hakanson/badges.json

So I did what builders do and wrote a utility script that can scrape this data and save to a `.csv` file.  Check out the [acclaim-badges-to-csv](https://github.com/hakanson/acclaim-badges-to-csv) GitHub repo to see it in action.

> A utility that calls into the JSON endpoint for a set of Acclaim user's badges and builds up a CSV file.

But please don't look to closely at my code, because I had to use a hack to get the Unicode [byte order mark (BOM)](https://en.wikipedia.org/wiki/Byte_order_mark) into the `.csv` file.  I ended up prefixing the `Name` column with the `U+FEFF` character resulting in the `\ufeffName` string below.  This shouldn't be strictly needed, except Excel wouldn't display the file correctly without it.

```javascript
const createCsvWriter = require('csv-writer').createArrayCsvWriter;
const csvWriter = createCsvWriter({
    header: ['\ufeffName', 'Issuer', 'Certification', 'Issued At', 'Expires At'],
    path: 'certifications.csv'
});
```