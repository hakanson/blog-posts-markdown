---
title: AWS CloudFormation Linter Custom Rules
slug: /2021-06-30-aws-cloudformation-linter-custom-rules
author: Kevin Hakanson
date: 2021-06-30
tags: ["aws","cloudformation"]
---

While diving deep on [AWS CloudFormation Linter](https://github.com/aws-cloudformation/cfn-lint) (cfn-lint), I discovered [Custom Rules](https://github.com/aws-cloudformation/cfn-lint/blob/main/docs/custom_rules.md) support.

> The linter supports the creation of custom one-line rules which compare any resource with a property using pre-defined operators.

To give it a try, I created a simple rule that enforced a naming standard for my Python Lambda functions by creating `cfn_custom_rules.txt` containing my custom rule.

```
AWS::Lambda::Function Handler EQUALS "app.lambda_handler" WARN "Lambda function handler should be app.lambda_handler"
```

Then when I run `cfn-lint`, I can include evaluation of this custom rule file.

```bash
$ cfn-lint template.yaml --custom-rules cfn_custom_rules.txt
```

Of course, I need this in my `buildspec.yml` so AWS CodePipeline and AWS CodeBuild would enforce this.

```yaml
  pre_build:
    commands:
      - cfn-lint template.yaml --custom-rules cfn_custom_rules.txt
      - status=$?
      - |
        if [ $status -ne 0 ]; then 
          exit 1;
        fi
```

An alternative to the `--custom-rules` CLI option is to add a section to my `.cfnlintrc.yaml` to automatically enable this option and allows for easy integration with the Visual Studio Code [vscode-cfn-lint](https://marketplace.visualstudio.com/items?itemName=kddejong.vscode-cfn-lint) extension.

```yaml
# https://github.com/aws-cloudformation/cfn-lint#configuration
custom_rules: cfn_custom_rules.txt