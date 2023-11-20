import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';

export class CdkSecStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) 
  {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "vpc", {
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
      subnetConfiguration: [
        {
          name: "isolated",
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED
        }
      ]
    })
    // ECS用
    vpc.addInterfaceEndpoint("ecr-endpoint", {
      service: ec2.InterfaceVpcEndpointAwsService.ECR
    })
    vpc.addInterfaceEndpoint("ecr-dkr-endpoint", {
      service: ec2.InterfaceVpcEndpointAwsService.ECR_DOCKER
    })
    vpc.addInterfaceEndpoint("logs-endpoint", {
      service: ec2.InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS
    })
    vpc.addGatewayEndpoint("s3-endpoint", {
      service: ec2.GatewayVpcEndpointAwsService.S3,
      subnets: [
        {
          subnets: vpc.isolatedSubnets
        }
      ]
    })


    const repo = ecr.Repository.fromRepositoryName(this, "repo", "watanabe-new")

    const cluster = new ecs.Cluster(this, "cluster", { vpc })
    const taskDefinition = new ecs.TaskDefinition(this, "taskdef", {
      compatibility: ecs.Compatibility.FARGATE,
      cpu: "256",
      memoryMiB: "512",
    })
    taskDefinition.addContainer("laravel", {
      // docker側できたら差し替える
      image: ecs.ContainerImage.fromEcrRepository(repo),
      // image: ecs.ContainerImage.fromRegisstry("/amazon-ecs-sample"),
      logging: ecs.LogDriver.awsLogs({ streamPrefix: 'test-on-fargate' }),
      // プロトコルtcp 9000で設定
      portMappings: [{containerPort: 9000, protocol: ecs.Protocol.TCP}],
      // readonlyRootFilesystem: false
    })
    new ecs.FargateService(this, "service", {
      cluster,
      taskDefinition,
      enableExecuteCommand: true,
    })
  }
}