const { readdirSync, statSync, writeFileSync } = require('fs')
const { join } = require('path')

let readme =  `
# Kevin Hakanson's Blog Posts in Markdown

Raw blog posts formatted in markdown for import into [kevinhakanson.com](https://kevinhakanson.com/).  ©2023 Kevin Hakanson
`;

// loop through all directories

const getdirnames = p => readdirSync(p).filter(f => statSync(join(p, f)).isDirectory());

const dirs = getdirnames('.');
let currentYear = '';
dirs.forEach(function (item, index) {
  let year = item.substring(0, 4);
  let date = item.substring(0, 10)
  if (year.startsWith('20')) {
    if (year != currentYear) {
      readme += `\n## ${year}\n\n`;
      currentYear = year;
      console.log(item, index);
    }
    // readme += `* ${item} (${date}) \`tag\`\n`;
    readme += `* [${item}](${item}/index.md) \n`;
  }

});

writeFileSync('README.md', readme);