# SST Nestjs POC

## Instructions

### Root project
Create root project
```bash
npx create-sst@latest my-sst-app
```

install lerna
```bash
cd my-sst-app
yarn add lerna -W
```

init lerna
```bash
yarn lerna init
```

remove dir
```bash
rm -rf core
rm -rf functions
```

### Add nestjs service

create Nestjs
```bash
cd packages
nest new nestjs-service -g
```

***test***
```bash
yarn lerna run test
yarn lerna run build
```

install dependencies
```bash
yarn add -D @types/aws-lambda 
yarn add aws-lambda @vendia/serverless-express @anatine/esbuild-decorators
```

create src/serverless.ts
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { APIGatewayEvent, Callback, Context, Handler} from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';

let server: Handler

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.init()

    const expressApp = app.getHttpAdapter().getInstance()
    return serverlessExpress({app: expressApp})
  }

const handler: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
  server = server ?? (await bootstrap())
  return server(event, context, callback)
  }

export const main = handler;
```

modify tsconfig.json in nestjs-service
```json
...
"declaration": false,
...
"esModuleInterop": true
```

create stacks/nestjs-service.stack.ts
```typescript
import { StackContext, Api } from "sst/constructs";

export function NestjsServiceStack({ stack }: StackContext) {
  const api = new Api(stack, "api", {
    routes: {
      "ANY /": "packages/nestjs-service/src/serverless.main",
      "ANY /{proxy+}": "packages/nestjs-service/src/serverless.main",
    },
  });
  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
```


install dependencies
```bash
yarn add @nestjs/microservices @nestjs/websockets cache-manager class-transformer class-validator
```

modify sst.config.ts
```typescript
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
```

replace tsconfig.json in root with the tsconfig.json from nestjs-service

add core nestjs packages from nestjs-service to root package.json

yarn install -W

***test***
```bash
cd my-sst-app
export AWS_PROFILE=app
yarn build
yarn dev 
```
call endpoint

