import { diContainer, fastifyAwilixPlugin } from "@fastify/awilix";
import { AwilixContainer } from "awilix";
import dotenv from 'dotenv';
import fastify from 'fastify';
import fastifyTypeormPlugin from "fastify-typeorm-plugin";
import { getConfig } from './infra/database/dataSource';
import { DependencyOverrides, registerDependencies } from "./infra/diConfig";
import { getRoutes } from "./modules/routes";

dotenv.config();

export type ConfigOverrides = {
  diContainer?: AwilixContainer
};

export async function getApp(
  configOverrides: ConfigOverrides = {},
  dependencyOverrides: DependencyOverrides = {},
){
  const app = fastify();

  await app.register(fastifyAwilixPlugin, {
    disposeOnClose: true,
    asyncDispose: true,
    asyncInit: true,
    eagerInject: true,
    disposeOnResponse: false,
  });

  await app.register(fastifyTypeormPlugin, getConfig());

  await registerDependencies(
    configOverrides.diContainer ?? diContainer, 
    { app }, 
    dependencyOverrides,
    {}
  );

  app.after(()=> {
    const { routes } = getRoutes();

    routes.forEach(route => app.withTypeProvider().route(route));
  });

  await app.ready(); 

  return app;
}
