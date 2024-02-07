import { asFunction, type Resolver } from 'awilix';
import { MongoClient } from "mongodb";
import { Connection } from 'mongoose';
import { Repository, getRepository } from "typeorm";
import { User } from "../modules/user/entity/user.entity";
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
  const client = null;

  const mongooseConnection = false;

  return {
    mongo: asFunction(
      () => client
    ),
    mongooseConnection: asFunction(
      () => mongooseConnection
    ),
    userRepository: asFunction(() => getRepository(User))
  }
}

export type CommonDependencies = {
  mongo: MongoClient,
  mongooseConnection: Connection,
  userRepository: Repository<User>
}
