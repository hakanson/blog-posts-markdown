---
title: Azure Managed Identity Resources
slug: /2020-10-10-azure-managed-identity-resources
author: Kevin Hakanson
date: 2020-10-10
tags: ["azure","security","iam","cli"]
---

As part of studying for the Azure Architect exams using [Microsoft Learn](https://docs.microsoft.com/en-us/learn/), I was experimenting with Managed Identities.  Here is the definition from the [What are managed identities for Azure resources?](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview) page of the Azure docs:

> There are two types of managed identities:
>
> * **System-assigned** Some Azure services allow you to enable a managed identity directly on a service instance. When you enable a system-assigned managed identity an identity is created in Azure AD that is tied to the lifecycle of that service instance. So when the resource is deleted, Azure automatically deletes the identity for you. By design, only that Azure resource can use this identity to request tokens from Azure AD.
> * **User-assigned** You may also create a managed identity as a standalone Azure resource. You can [create a user-assigned managed identity](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal) and assign it to one or more instances of an Azure service. In the case of user-assigned managed identities, the identity is managed separately from the resources that use it.

Using the Azure CLI, I can show the `kjh-mi` managed identity which I created as an Azure resource.

```console
kevin@Azure:~$ az identity show --name "kjh-mi" --resource-group "kjh-microsoft-learn"
{
  "clientId": "a72223ed-0a1e-4683-9b4b-44bed448bccc",
  "clientSecretUrl": "https://control-northcentralus.identity.azure.net/subscriptions/1b877039-42c8-467f-a80b-950b770fa4ff/resourcegroups/kjh-microsoft-learn/providers/Microsoft.ManagedIdentity/userAssignedIdentities/kjh-mi/credentials?tid=01177861-2ff6-4b20-b546-49fd6cada0ec&oid=8097154c-b14f-4898-928c-16ca80e12dfd&aid=a72223ed-0a1e-4683-9b4b-44bed448bccc",
  "id": "/subscriptions/1b877039-42c8-467f-a80b-950b770fa4ff/resourcegroups/kjh-microsoft-learn/providers/Microsoft.ManagedIdentity/userAssignedIdentities/kjh-mi",
  "location": "northcentralus",
  "name": "kjh-mi",
  "principalId": "8097154c-b14f-4898-928c-16ca80e12dfd",
  "resourceGroup": "kjh-microsoft-learn",
  "tags": {},
  "tenantId": "01177861-2ff6-4b20-b546-49fd6cada0ec",
  "type": "Microsoft.ManagedIdentity/userAssignedIdentities"
}
```

Similar to a User or Group, a managed identity is a security principal object in Azure AD.

![security principals](images/rbac-security-principal.png)

Using the `principalId` value of `8097154c-b14f-4898-928c-16ca80e12dfd`, I can call into the `directoryObjects` Microsoft Graph API to get the corresponding object from Azure AD.

```console
kevin@Azure:~$ az rest --url "https://graph.microsoft.com/v1.0/directoryObjects/8097154c-b14f-4898-928c-16ca80e12dfd?\$select=id,alternativeNames,appId,displayName,servicePrincipalType,servicePrincipalNames"
{
  "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#directoryObjects(id,alternativeNames,appId,displayName,servicePrincipalType,servicePrincipalNames)/$entity",
  "@odata.type": "#microsoft.graph.servicePrincipal",
  "alternativeNames": [
    "isExplicit=True",
    "/subscriptions/1b877039-42c8-467f-a80b-950b770fa4ff/resourcegroups/kjh-microsoft-learn/providers/Microsoft.ManagedIdentity/userAssignedIdentities/kjh-mi"
  ],
  "appId": "a72223ed-0a1e-4683-9b4b-44bed448bccc",
  "displayName": "kjh-mi",
  "id": "8097154c-b14f-4898-928c-16ca80e12dfd",
  "servicePrincipalNames": [
    "a72223ed-0a1e-4683-9b4b-44bed448bccc",
    "https://identity.azure.net/ClNzn4fxz/63fEHulvQtfB7agLtUDIkCJSx4OFAC3Tw="
  ],
  "servicePrincipalType": "ManagedIdentity"
}
```
Notice that the `@odata.type` is `microsoft.graph.servicePrincipal` and the `servicePrincipalType` has a `ManagedIdentity` value.

The Azure `Microsoft.ManagedIdentity/userAssignedIdentities` resource `principalId` value of `8097154c-b14f-4898-928c-16ca80e12dfd` appears as `id`, the `clientId` value of `a72223ed-0a1e-4683-9b4b-44bed448bccc` appears as `appId`, and the `name` of `kjh-mi` maps to the `displayName` property.  The `alternativeNames` and `servicePrincipalNames` also have interesting corresponding values.
