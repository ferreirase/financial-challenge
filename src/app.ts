import { diContainer, fastifyAwilixPlugin } from "@fastify/awilix";
import { AwilixContainer } from "awilix";
import dotenv from 'dotenv';
import fastify, { FastifyReply } from 'fastify';
import fastifyTypeormPlugin from "fastify-typeorm-plugin";
import { getConfig } from './infra/database/dataSource';
import { SeedsManager } from "./infra/database/seeds";
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

  app.get('/seeds/users', async (_, res: FastifyReply) => {
    try {
      await SeedsManager.executeUsers(app.orm.createQueryRunner());

      return res.send({ success: true, message: 'Users seeds created successfully' });
    } catch (error) {
      console.error(error);
      return res.code(400).send({ error: true, message: 'Users seeds error' });
    }
  });

  app.get('/seeds/accounts', async (_, res: FastifyReply) => {
    try {
      await SeedsManager.executeAccounts(app.orm.createQueryRunner());

      return res.send({ success: true, message: 'Accounts seeds created successfully' });
    } catch (error) {
      console.error(error);
      return res.code(400).send({ error: true, message: 'Accounts seeds error' });
    }
  });

  await app.ready(); 

  return app;
}
