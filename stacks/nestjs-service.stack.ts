import { Api, StackContext } from "sst/constructs";

export function NestjsServiceStack({ stack }: StackContext) {
  const api = new Api(stack, "api", {
    routes: {
      "ANY /": "packages/nestjs-service/src/serverless.handler",
      "ANY /{proxy+}": "packages/nestjs-service/src/serverless.handler",
    },
  });
  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
