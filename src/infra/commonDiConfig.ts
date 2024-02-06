import { asFunction, type Resolver } from 'awilix';
import { MongoClient } from "mongodb";
import type { ExternalDependencies } from './diConfig';

export type CommonDiConfig = Record<keyof CommonDependencies, Resolver<any>>;

export type DIOptions = {
  jobsEnabled?: boolean
  queuesEnabled?: boolean
};

export async function resolveCommonDiConfig(
  dependencies: ExternalDependencies = {},
  options: DIOptions = {},
): Promise<CommonDiConfig> {
  const client = await MongoClient.connect(process.env.MONGO_URL || '');

  return {
    mongo: asFunction(
      () => client
    )
  }
}

export type CommonDependencies = {
  mongo: MongoClient
}
