---
title: Vitest File Snapshots
slug: /2023-09-29-vitest-file-snapshots
author: Kevin Hakanson
date: 2023-09-29
tags: ["javascript","codequality","cedar"]
---

I recently added tests for both [prism-cedar](https://github.com/cedar-policy/prism-cedar) and [highlightjs-cedar](https://github.com/cedar-policy/highlightjs-cedar) using the [File Snapshots](https://vitest.dev/guide/snapshot.html#file-snapshots) feature of [vitest](https://vitest.dev/).

Each of these syntax highlight libraries uses a lot of regular expressions, and I immediately think of the joke about regex.

> Some people, when confronted with a problem, think "I know, I'll use regular expressions." Now they have two problems.

I created a set of `.cedar` files which included all the language keywords.  Below is the contents of [decimal.cedar](https://github.com/cedar-policy/prism-cedar/blob/main/test/data/decimal.cedar)...

```cedar
// decimal(), lessThan, lessThanOrEqual, greaterThan, greaterThanOrEqual
// see https://docs.cedarpolicy.com/policies/syntax-operators.html#decimal-parse-string-and-convert-to-decimal
permit (principal, action, resource)
when
{
  (decimal("1.23").lessThan(decimal("1.24")) &&
   decimal("1.23").lessThanOrEqual(decimal("1.24"))) ||
  (decimal("1.24").greaterThan(decimal("1.23")) &&
   decimal("1.24").greaterThanOrEqual(decimal("1.23")))
};
```

...and [decimal.html](https://github.com/cedar-policy/prism-cedar/blob/main/test/data/decimal.html) is what the File Snapshot of the syntax highlight output looks like.

```html
<span class="token comment">// decimal(), lessThan, lessThanOrEqual, greaterThan, greaterThanOrEqual</span>
<span class="token comment">// see https://docs.cedarpolicy.com/policies/syntax-operators.html#decimal-parse-string-and-convert-to-decimal</span>
<span class="token keyword">permit</span> (<span class="token variable">principal</span>, <span class="token variable">action</span>, <span class="token variable">resource</span>)
<span class="token keyword">when</span>
{
  (<span class="token builtin">decimal</span>(<span class="token string">"1.23"</span>).<span class="token function">lessThan</span>(<span class="token builtin">decimal</span>(<span class="token string">"1.24"</span>)) <span class="token operator">&amp;&amp;</span>
   <span class="token builtin">decimal</span>(<span class="token string">"1.23"</span>).<span class="token function">lessThanOrEqual</span>(<span class="token builtin">decimal</span>(<span class="token string">"1.24"</span>))) <span class="token operator">||</span>
  (<span class="token builtin">decimal</span>(<span class="token string">"1.24"</span>).<span class="token function">greaterThan</span>(<span class="token builtin">decimal</span>(<span class="token string">"1.23"</span>)) <span class="token operator">&amp;&amp;</span>
   <span class="token builtin">decimal</span>(<span class="token string">"1.24"</span>).<span class="token function">greaterThanOrEqual</span>(<span class="token builtin">decimal</span>(<span class="token string">"1.23"</span>)))
};
```

The [prism-cedar.test.js](https://github.com/cedar-policy/prism-cedar/blob/main/test/prism-cedar.test.js) code is a nice iterator over the set of `test/data/*.cedar` files.

```javascript
describe('data/*.cedar files', () => {
  const files = fs
    .readdirSync(path.join(__dirname, 'data'))
    .filter((f) => f.endsWith('.cedar'));
  files.forEach((file) => {
    it(file, () => {
      const code = fs.readFileSync(path.join(__dirname, 'data', file), 'utf8');
      const result = Prism.highlight(code, Prism.languages.cedar, 'cedar');

      expect(result).toMatchFileSnapshot(
        path.join(__dirname, 'data', file.replace('.cedar', '.html')),
      );
    });
  });
});
```

