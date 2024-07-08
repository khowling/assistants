// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Demonstrates how to use the AOAI assistants API.
 * 
 *
 * @summary assistants code.
 */

import 'dotenv/config'
import { AssistantsClient, AzureKeyCredential, CreateRunOptions, OpenAIKeyCredential } from "@azure/openai-assistants";

import { AzureLogger, setLogLevel } from '@azure/logger';
setLogLevel('verbose');

AzureLogger.log = (...args) => {
  console.log(...args);
};

const azureEndpoint: string = process.env["AZURE_AI_ENDPOINT"] || "<YOUR_ENDPOINT>";
const azureKey: string = process.env["AZURE_AI_API_KEY"] || "<YOUR_API_KEY>";
const deployName: string = process.env["AZURE_AI_DEPLOYMENT"] || "<YOUR_DEPLOYMENT_NAME>";

export async function main() {

  console.log (`connecting to Azure endpoint: ${azureEndpoint}, deployment: ${deployName}`)
  const assistantsClient = new AssistantsClient(azureEndpoint, new AzureKeyCredential(azureKey));

  const assistantResponse = await assistantsClient.createAssistant({
    model: deployName,
    name: "JS Math Tutor",
    instructions: "You are a personal math tutor. Write and run code to answer math questions.",
    tools: [{ type: "code_interpreter" }],
  });
  console.log(assistantResponse);
  const assistantThread = await assistantsClient.createThread({});
  console.log(assistantThread);

  const question = "I need to solve the equation '3x + 11 = 14'. Can you help me?";
  const threadResponse = await assistantsClient.createMessage(assistantThread.id, "user", question);
  console.log(threadResponse);
  let createRunOptions: CreateRunOptions = {
    assistantId: assistantResponse.id,
    instructions: "Please solve the equation '3x + 11 = 14'."
  };
  let runResponse = await assistantsClient.createRun(assistantThread.id, createRunOptions);
  console.log(runResponse);

  do {
    await new Promise((r) => setTimeout(r, 500));
    runResponse = await assistantsClient.getRun(assistantThread.id, runResponse.id);
    const runSteps = await assistantsClient.listRunSteps(assistantThread.id, runResponse.id, {
      requestOptions: {},
      limit: 1,
    });
    console.log(runSteps);
  } while (runResponse.status === "queued" || runResponse.status === "in_progress");

  const runMessages = await assistantsClient.listMessages(assistantThread.id);
  for (const runMessageDatum of runMessages.data) {
    for (const item of runMessageDatum.content) {
      if (item.type === "text") {
        console.log(item.text?.value);
      } else if (item.type === "image_file") {
        console.log(item.imageFile?.fileId);
      }
    }
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});
