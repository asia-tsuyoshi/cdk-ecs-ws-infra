# 注意点
ECRはデプロイ時点で空ですが、ECSのコンテナがそちらに格納されているイメージを元にデプロイされます。
よって、本環境のデプロイ後にECRへイメージをプッシュしてください。
何度かリトライするため、コンテナが問題なくデプロイされるはずです。

# ポイント
- プライベートサブネットに配置
- 可能な限りNATではなくVPCエンドポイントを使用
- パブリックIPを付与しない
- Fargateの利用
- イミュータブルなタグを使用する

# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
