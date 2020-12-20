let fs = require('fs');

// https://gist.github.com/mathewbyrne/1280286
function slugify(text)
{
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

let date = "2020-10-30";
let title = "I'm a Microsoft Azure Solutions Architect Expert";
let slugTitle = slugify(title);
let dir = `${date}-${slugTitle}`;
let hasImages = true;
let tags = ["azure", "architecture", "certification"];

let slug =  `---
title: ${title}
slug: /${date}-${slugTitle}
author: Kevin Hakanson
date: ${date}
tags: ${JSON.stringify(tags)}
---
`;

fs.mkdirSync(dir);
if (hasImages) {
  fs.mkdirSync(`${dir}/images`);
}
fs.writeFileSync(`${dir}/index.md`, slug);