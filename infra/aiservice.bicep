param uniqueName string
param location string = 'eastus2'

//--------- Azure AI Services ---------
// Resource used to access multiple Azure AI services with a single setup (provides API endpoints, and common Keys for all services)
// Provides 'Cost Analysis'
// https://learn.microsoft.com/en-us/azure/templates/microsoft.machinelearningservices/workspaces?pivots=deployment-language-bicep
resource aiservices 'Microsoft.CognitiveServices/accounts@2023-10-01-preview' = {
  name: 'aiser-${uniqueName}-${location}'
  location: location
  kind: 'AIServices'
  sku: {
    name: 'S0'
  }

  properties: {
    customSubDomainName: 'aiser-${uniqueName}-${location}'
    publicNetworkAccess: 'Enabled'
  }
}

output aiservicesName string = aiservices.name
output aiservicesOpenAIEndpoint string = aiservices.properties.endpoints['OpenAI Language Model Instance API']
output deploymentName string = gpts.name

param model string = 'gpt-4o'
param modelVersion string = '2024-05-13'

resource gpts 'Microsoft.CognitiveServices/accounts/deployments@2023-10-01-preview' = {
  parent:  aiservices
  name: '${model}-${location}'
  properties: {
    model: {
      name: model
      format: 'OpenAI'
      version: modelVersion 
    }
  }
  sku: {
    name: 'Standard'
    capacity: 50
  }
}
