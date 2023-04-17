import { SSTConfig } from "sst";
import { NestjsServiceStack } from "./stacks/nestjs-service.stack";
import { esbuildDecorators } from "@anatine/esbuild-decorators";

export default {
  config(_input) {
    return {
      name: "project-name",
      region: "us-west-2",
      profile: 'helloWorld'
    };
  },
  stacks(app) {
    app.setDefaultFunctionProps({
      runtime: 'nodejs18.x',
      nodejs: {
        esbuild: {
          plugins: [esbuildDecorators()],
        },
        install: [
    "@anatine/esbuild-decorators",
    "@nestjs/common",
    "@nestjs/core",
    "@nestjs/mapped-types",
    "@nestjs/microservices",
    "@nestjs/platform-express",
    "@nestjs/websockets",
    "@vendia/serverless-express",
    "aws-lambda",
    "cache-manager",
    "class-transformer",
    "class-validator",
    "reflect-metadata",
    "rxjs",
        ],
      }
    });
    app.stack(NestjsServiceStack);
  }
} satisfies SSTConfig;
