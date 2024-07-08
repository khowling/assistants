#

[dependency](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/models#assistants-preview)
For Assistants you need a combination of a supported model, and a supported region. Certain tools and capabilities require the latest models. The following models are available in the Assistants API

## Recreate from Scratch

```
mkdir assistant
npm init
echo '{"extends": "@tsconfig/recommended/tsconfig.json"}' >tsconfig.json
npm install typescript @tsconfig/recommended @types/node --save-dev
npm install dotenv @azure/openai-assistants @azure/logger

wget -P ./src raw.githubusercontent.com/Azure/azure-sdk-for-js/main/sdk/openai/openai-assistants/samples/v1-beta/typescript/src/codeAssistant.ts
```

## Run

### Infra
```
RG=khassistant
UNIQUE_NAME=khass01
az group create -n $RG -l westeurope
CMD=$(az deployment group create -g $RG -n $UNIQUE_NAME --template-file ./infra/aiservice.bicep --parameters uniqueName=$UNIQUE_NAME --query [properties.outputs.aiservicesName.value,properties.outputs.aiservicesOpenAIEndpoint.value,properties.outputs.deploymentName.value] -o tsv)

KEY=$(az cognitiveservices account keys list -g $RG -n $(echo $CMD | cut -f 1 -d ' ') -o tsv --query key1)
echo -e "AZURE_AI_API_KEY=${KEY}\nAZURE_AI_ENDPOINT=$(echo $CMD | cut -f 2 -d ' ')\nAZURE_AI_DEPLOYMENT=$(echo $CMD | cut -f 3 -d ' ')" >.env
```

### Run local
```
npx tsc && node src/codeAssistant.js
```

