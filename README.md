

## Recreate from Scratch

```
mkdir assistant
npm init
echo '{"extends": "@tsconfig/recommended/tsconfig.json"}' >tsconfig.json
npm install typescript @tsconfig/recommended @types/node --save-dev
npm install dotenv @azure/openai-assistants

wget -P ./src raw.githubusercontent.com/Azure/azure-sdk-for-js/main/sdk/openai/openai-assistants/samples/v1-beta/typescript/src/codeAssistant.ts
```

## Run
```
npx tsc && node src/codeAssistant.js
```

