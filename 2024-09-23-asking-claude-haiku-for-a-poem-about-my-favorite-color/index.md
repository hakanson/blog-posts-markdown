---
title: Asking Claude Haiku for a poem about my favorite color
slug: /2024-09-23-asking-claude-haiku-for-a-poem-about-my-favorite-color
author: Kevin Hakanson
date: 2024-09-23
tags: ["genai", "aws", "javascript"]
---
Recently, I was working on a TypeScript code sample using [@aws-sdk/client-bedrock-runtime](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-bedrock-runtime/).  Since I like to have fun with my examples, I [gave Claude a role with a system prompt](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/system-prompts) along with my user prompt.

- **System Prompt:**  You must always respond in rhymes.
- **User Message:**  Tell me about Kevin's favorite color.

Claude 3 [Haiku](https://www.anthropic.com/claude/haiku) gave me a decent response for not knowing the answer.

> Alas, I do not know Kevin's favorite hue,  
> For his color preference, I have no clue.  
> If you could provide more details, it would be grand,  
> Then I could attempt to understand.  

How could Claude know Kevin's favorite color is blue, and generate a poem like this?

> The color that Kevin adores,  
> Is a lovely shade of blue, nothing more.  
> This tranquil tone, so serene and true,  
> Brings him joy, through and through.  

Claude can integrate with external tools through [tool use (function calling)](https://docs.anthropic.com/en/docs/build-with-claude/tool-use).  The JSON below defines a `get_favorite_color` tool that indicates it can "Get a person's favorite color" given the `person`'s name.

```json
{
  name: "get_favorite_color",
  description: "Get a person's favorite color",
  inputSchema: {
    json: {
      type: "object",
      properties: {
        person: {
          type: "string",
          description: "The person's name",
        },
      },
      required: ["person"],
    },
  },
}
```

Now that same prompt will cause Claude to request `toolUse` of `get_favorite_color` for `person` **Kevin**.

```json
{
  "toolUse": {
    "input": {
      "person": "Kevin"
    },
    "name": "get_favorite_color",
    "toolUseId": "tooluse_Yg0aXKPfQv6ypSmtdJF8pw"
  }
}
```

My favorite color is **blue**, and odds are that yours is as well (see [Why is blue the world's favorite color?](https://today.yougov.com/international/articles/12335-why-blue-worlds-favorite-color)).  Therefore, let's hard code the response.

```typescript
command.input.messages.push({
  role: "user",
  content: [
    {
      toolResult: {
        toolUseId: toolUse.toolUseId,
        content: [{ json: {favorite_color: "blue"} }],
      },
    },
  ],
});
```

The sample-quality code is below - filled with `console.log`, always assumes this `toolUse`, and doesn't know how to find everyone's favorite color.

```typescript
import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "us-west-2" });
const modelId = "anthropic.claude-3-haiku-20240307-v1:0";
const systemPrompt = [{ text: "You must always respond in rhymes." }];
const userMessage = "Tell me about Kevin's favorite color.";
const conversation = [
  {
    role: "user",
    content: [{ text: userMessage }],
  },
];
const toolSpec = {
  name: "get_favorite_color",
  description: "Get a person's favorite color",
  inputSchema: {
    json: {
      type: "object",
      properties: {
        person: {
          type: "string",
          description: "The person's name",
        },
      },
      required: ["person"],
    },
  },
};

const command = new ConverseCommand({
  modelId,
  messages: conversation,
  system: systemPrompt,
  toolConfig: {
    tools: [
      {
        toolSpec: toolSpec,
      },
    ],
  },
  inferenceConfig: { maxTokens: 512, temperature: 0.5, topP: 0.9 },
});

try {
  let response = await client.send(command);
  let responseText = response.output.message.content[0].text;
  console.log(responseText);

  command.input.messages.push(response.output.message);

  const toolUse = response.output.message.content[1].toolUse;
  console.log(toolUse);

  command.input.messages.push({
    role: "user",
    content: [
      {
        toolResult: {
          toolUseId: toolUse.toolUseId,
          content: [{ json: {favorite_color: "blue"} }],
        },
      },
    ],
  });
  response = await client.send(command);
  responseText = response.output.message.content[0].text;
  console.log(responseText);
} catch (err) {
  console.log(`ERROR: Can't invoke '${modelId}'. Reason: ${err}`);
  process.exit(1);
}
```
