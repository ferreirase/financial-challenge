import type { AwilixContainer, Resolver } from 'awilix';
import { Lifetime } from 'awilix';
import type { FastifyInstance } from 'fastify';

import { AccountModuleDependencies, resolveAccountConfig } from '../modules/account/diConfig';
import { UsersModuleDependencies, resolveUsersConfig } from '../modules/user/diConfig';
import { resolveCommonDiConfig } from "./commonDiConfig";

export type ExternalDependencies = {
  app?: FastifyInstance
};

export const SINGLETON_CONFIG = { lifetime: Lifetime.SINGLETON };

export type DependencyOverrides = Partial<DiConfig>;

export async function registerDependencies(
  diContainer: AwilixContainer,
  dependencies: ExternalDependencies,
  dependencyOverrides: DependencyOverrides = {},
  options: {},
): Promise<void> {

  const diConfig: DiConfig = {
    ...await resolveCommonDiConfig(dependencies, options),
    ...resolveUsersConfig(),
    ...resolveAccountConfig(),
  };

  diContainer.register(diConfig);

  for (const [dependencyKey, dependencyValue] of Object.entries(dependencyOverrides)) {
    diContainer.register(dependencyKey, dependencyValue);
  }
}

type DiConfig = Record<keyof Dependencies, Resolver<any>>;

export type Dependencies = UsersModuleDependencies & AccountModuleDependencies;

declare module '@fastify/awilix' {
  interface Cradle extends Dependencies {}

  interface RequestCradle extends Dependencies {}
};
