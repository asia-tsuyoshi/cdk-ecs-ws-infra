#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkSecStack } from '../lib/cdk-sec-stack';

const app = new cdk.App();
new CdkSecStack(app, 'CdkSecStack');