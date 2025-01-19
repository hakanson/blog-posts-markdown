---
title: Fun with Cypress Fixture Files
slug: /2025-01-18-fun-with-cypress-fixture-files
author: Kevin Hakanson
date: 2025-01-18
tags: ["javascript", "codequality", "webdev"]
---
[aws-jwt-verify](https://github.com/awslabs/aws-jwt-verify) uses [Conditional exports](https://nodejs.org/api/packages.html#conditional-exports) to support both Node.js and browser environments.

```json
{
  "imports": {
    "#node-web-compat": {
      "browser": "./node-web-compat-web.js",
      "default": "./node-web-compat-node.js"
    }
  }
}
```

The primary unit tests use [Jest](https://jestjs.io/) and run under Node.js, which means the browser imports are not used.  This is addressed by also testing with a [Vite](https://vite.dev/)-based web application using [Cypress](https://www.cypress.io/).

In 2022, when first using Cypress, I was smart enough to use [fixture files](https://docs.cypress.io/app/core-concepts/writing-and-organizing-tests#Fixture-Files).  There is a `tests/vite-app/util/generateExampleTokens.ts` that generates JWT tokens and the corresponding [JSON Web Key Set](https://datatracker.ietf.org/doc/html/rfc7517) (JWKS), then saves into the web application and as fixtures for the Cypress tests.

```typescript
const JWKSFILE = "example-JWKS.json";

saveFile("public", JWKSFILE, jwks);
saveFile(join("cypress", "fixtures"), JWKSFILE, jwks);

saveFile(join("cypress", "fixtures"), "example-token-data.json", tokendata);
```

However, I was not smart enough to read the docs about using `cy.fixture()`.  I instead abused TypeScript Resolve JSON Module ([resolveJsonModule](https://www.typescriptlang.org/tsconfig/#resolveJsonModule)).

```typescript
import { JWKSURI } from "../fixtures/example-token-data.json";
```

I used the `JWKSURI` value in [`cy.intercept()`](https://docs.cypress.io/api/commands/intercept) below:

```typescript
  beforeEach(() => {
    cy.intercept("GET", JWKSURI, { fixture: "example-JWKS" });
  });
```

Recently, I wanted to add another test for our `SimpleFetcher`. Instead of spying and stubbing the network request and response, I wanted to actually fetch over http and compare against `fixtures/example-JWKS.json` data.  I built up a shell of the test, then wasn't sure what I to do next, so I asked [Amazon Q Developer](https://aws.amazon.com/q/developer/).

> in the selected cypress test, how do I compare the result of the fetcher to the JSON data from the fixture file

I got a nice explanation, and the full test code.  Below are the important lines:

```typescript
    cy.fixture("example-JWKS.json").then((jwksData) => {
      const fetcher = new SimpleFetcher();

      fetcher.fetch(JWKSURI).then((jwks) => {
        expect(jwks).to.deep.equal(jwksData);
      });
    });
```

Then I wondered if there was a better way to reference `JWKSURI` and asked Q Developer this followup question.

> is there a more semantic way to get the JWKSURI value than using an import in the selected code? should I use cy.fixture instead?

Of course there was.  Below is the final code for `tests/vite-app/cypress/e2e/fetcher.cy.ts`:

```typescript
/// <reference types="cypress" />
import { SimpleFetcher } from "aws-jwt-verify/https";

describe("Fetcher", () => {
  let tokenData;

  beforeEach(() => {
    cy.fixture("example-token-data.json").then((data) => {
      tokenData = data;
    });
  });

  it("Simple JSON fetcher works", () => {
    cy.visit("/");

    cy.fixture("example-JWKS.json").then((jwksData) => {
      const fetcher = new SimpleFetcher();

      fetcher.fetch(tokenData.JWKSURI).then((jwks) => {
        expect(jwks).to.deep.equal(jwksData);
      });
    });
  });
});
```
