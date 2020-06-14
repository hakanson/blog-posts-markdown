---
title: Playing with Terraform inside Azure Cloud Shell
slug: /2020-05-29-playing-with-terraform-inside-azure-cloud-shell
author: Kevin Hakanson
date: 2020-05-29
tags: ["azure", "cli", "terraform", "cloudshell"]
---

I noticed that [terraform](https://www.terraform.io/) was one of the [tools pre-configured in Azure Cloud Shell](https://docs.microsoft.com/en-us/azure/cloud-shell/features#tools), so I decided to play around with it based on the Terraform [Getting Started - Azure](https://learn.hashicorp.com/terraform/azure/intro_az) learning track.

I created a `azuredeploy.tf` file which would just create an Azure Resource Group named `myResourceGroupT` and Storage Account named `terraformlabkjh20200529`
```console
kevin@Azure:~$ cat azuredeploy.tf
provider "azurerm" {
  version         = ">= 2.0"
  features {}
}

resource "azurerm_resource_group" "example" {
  name     = "myResourceGroupT"
  location = "Central US"
}

resource "azurerm_storage_account" "example" {
  name                     = "terraformlabkjh20200529"
  resource_group_name      = azurerm_resource_group.example.name
  location                 = azurerm_resource_group.example.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  tags = {
    environment = "staging"
  }
}
```

Then after executing a `terraform init` and `terraform apply`, I could see the `id` values of the created resources in the partial output below.
```console
azurerm_resource_group.example: Creation complete after 1s [id=/subscriptions/11111111-1111-4000-11111111111111111/resourceGroups/myResourceGroupT]
azurerm_storage_account.example: Creating...
azurerm_storage_account.example: Still creating... [10s elapsed]
azurerm_storage_account.example: Creation complete after 20s [id=/subscriptions/11111111-1111-4000-11111111111111111/resourceGroups/myResourceGroupT/providers/Microsoft.Storage/storageAccounts/terraformlabkjh20200529]

Apply complete! Resources: 2 added, 0 changed, 0 destroyed.
```

I also could find these `id` values from inspecting the `terraform.tfstate` file using a [jq](https://stedolan.github.io/jq/) query of `".resources[].instances[].attributes.id"`
```console
kevin@Azure:~$ cat terraform.tfstate | jq ".resources[].instances[].attributes.id"
"/subscriptions/11111111-1111-4000-11111111111111111/resourceGroups/myResourceGroupT"
"/subscriptions/11111111-1111-4000-11111111111111111/resourceGroups/myResourceGroupT/providers/Microsoft.Storage/storageAccounts/terraformlabkjh20200529"
```

I did notice the `terraform` version was out of date inside Azure Cloud Shell.
```console
kevin@Azure:~$ terraform --version
Terraform v0.12.25
+ provider.azurerm v2.12.0

Your version of Terraform is out of date! The latest version
is 0.12.26. You can update by downloading from https://www.terraform.io/downloads.html
```

But, then again, so is the version of the Azure CLI.
```console
kevin@Azure:~$ az --version
azure-cli                          2.5.1 *

command-modules-nspkg              2.0.3
core                               2.5.1 *
nspkg                              3.0.4
telemetry                          1.0.4

Python location '/opt/az/bin/python3'
Extensions directory '/home/kevin/.azure/cliextensions'

Python (Linux) 3.6.5 (default, Apr 30 2020, 06:22:39)
[GCC 5.4.0 20160609]

Legal docs and information: aka.ms/AzureCliLegal


You have 2 updates available. Consider updating your CLI installation with 'sudo apt-get update && sudo apt-get install --only-upgrade -y azure-cli'. Detailed instructions can be found at https://aka.ms/doc/UpdateAzureCliApt
```

A simple example, but now I can add Terraform experience to my resume. :) 