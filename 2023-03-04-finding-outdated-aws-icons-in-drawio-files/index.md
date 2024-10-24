---
title: Finding outdated AWS icons in draw.io files
slug: /2023-03-04-finding-outdated-aws-icons-in-drawio-files
author: Kevin Hakanson
date: 2023-03-04
tags: ["aws"]
---

I admit to being an AWS service icon snob - when I see outdated icons being used, I look down on the diagram.  For example, this image with multiple versions of old AWS Lambda icons:

![Lambda icons from AWS17, AWS18, and AWS19](images/LambdaLambdaLambda.drawio.png)

However, these are a pain to update by hand.  Last month I created GitHub issue #3337: [Feature to "upgrade" AWS Icons from old icons sets (e.g. AWS 17, AWS 18)](https://github.com/jgraph/drawio/issues/3337)

Today I wrote a quick and dirty TypeScript CLI that checks `.drawio` files for outdated AWS icons.

```shell
$ npx ts-node drawiolint LambdaLambdaLambda.drawio 
Processing file LambdaLambdaLambda.drawio (modified 2023-02-04T19:04:48.267Z)

Checking tab Page-1 

❌ id=-sQPLy2-axNeOzcSWdUq-1
  AWS17 Lambda
  mxgraph.aws3.lambda 


❌ id=-sQPLy2-axNeOzcSWdUq-3
  AWS18 Lambda
  mxgraph.aws4.productIcon mxgraph.aws4.lambda
```

Here are the relevant parts of the draw.io XML for those three icons:

```xml
<mxCell id="-sQPLy2-axNeOzcSWdUq-1" value="AWS17 Lambda" style="outlineConnect=0;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;shape=mxgraph.aws3.lambda;fillColor=#F58534;gradientColor=none;" parent="1" vertex="1">
  <mxGeometry x="80" y="163" width="76.5" height="93" as="geometry" />
</mxCell>
<mxCell id="-sQPLy2-axNeOzcSWdUq-2" value="AWS Lambda" style="sketch=0;points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;gradientColor=#F78E04;gradientDirection=north;fillColor=#D05C17;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.lambda;" parent="1" vertex="1">
  <mxGeometry x="330" y="170.5" width="78" height="78" as="geometry" />
</mxCell>
<mxCell id="-sQPLy2-axNeOzcSWdUq-3" value="AWS18 Lambda" style="sketch=0;outlineConnect=0;fontColor=#232F3E;gradientColor=none;strokeColor=#ffffff;fillColor=#232F3E;dashed=0;verticalLabelPosition=middle;verticalAlign=bottom;align=center;html=1;whiteSpace=wrap;fontSize=10;fontStyle=1;spacing=3;shape=mxgraph.aws4.productIcon;prIcon=mxgraph.aws4.lambda;" parent="1" vertex="1">
  <mxGeometry x="200" y="159.5" width="80" height="100" as="geometry" />
</mxCell>
```

After a bunch of XML parsing code to pull out the `id`, `label` and `style` from the `<mxCell>`, the `verifyShape` function gets called and looks for `mxgraph.aws3` or `mxgraph.aws4.productIcon`.

```typescript
const verifyShape = (
  id: string,
  label: string,
  styles: Record<string, string>
) => {
  const shape = styles['shape'] || '';
  const prIcon = styles['prIcon'] || '';
  const resIcon = styles['resIcon'] || '';

  if (
    shape.includes('mxgraph.aws3.') ||
    shape.includes('mxgraph.aws4.productIcon')
  ) {
    console.log(`\n❌ id=${id}\n  ${label}\n  ${shape} ${prIcon}\n`);
  }
};
```

Maybe once day I'll clean up the code, add update capabilities, and publish it somewhere.