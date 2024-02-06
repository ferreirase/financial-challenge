import type { Resolver } from 'awilix';
import { asClass, asFunction, Lifetime } from 'awilix';
import type { LoaderConfig } from 'layered-loader';
import { Loader } from 'layered-loader';

import { SINGLETON_CONFIG } from '../../infra/diConfig';
import { IUser } from './model/User';

import { CommonDependencies } from "../../infra/commonDiConfig";
import { UserDataSource } from "./dataSource/userDataSource";
import UserRepository from './respository/user.repository';
import UserService from './service/user.service';


type UsersDiConfig = Record<keyof UsersModuleDependencies, Resolver<any>>;

export type UsersModuleDependencies = {
  userRepository: UserRepository
  userService: UserService
  userLoader: Loader<IUser>
};

export type UsersInjectableDependencies = UsersModuleDependencies & CommonDependencies;

export type UsersPublicDependencies = Pick<
UsersInjectableDependencies,
  'userService' | 'userRepository'
>;

export function resolveUsersConfig(): UsersDiConfig {
  return {
    userRepository: asClass(UserRepository, SINGLETON_CONFIG),
    userService: asClass(UserService, SINGLETON_CONFIG),

    userLoader: asFunction(
      (deps: UsersInjectableDependencies) => {
        const config: LoaderConfig<IUser> = {
          dataSources: [new UserDataSource(deps)],
        };

        return new Loader(config);
      },
      {
        lifetime: Lifetime.SINGLETON,
      },
    ),
  };
};
