import type { Resolver } from 'awilix';
import { asClass, asFunction, Lifetime } from 'awilix';
import type { LoaderConfig } from 'layered-loader';
import { Loader } from 'layered-loader';

import { SINGLETON_CONFIG } from '../../infra/diConfig';
import { IAccount } from './model/Account';

import { CommonDependencies } from "../../infra/commonDiConfig";
import { AccountDataSource } from "./dataSource/accountDataSource";
import AccountRepository from './repository/account.mongo.repository';
import AccountService from './service/account.service';


type AccountDiConfig = Record<keyof AccountModuleDependencies, Resolver<any>>;

export type AccountModuleDependencies = {
  accountRepository: AccountRepository
  accountService: AccountService
  accountLoader: Loader<IAccount>
};

export type AccountInjectableDependencies = AccountModuleDependencies & CommonDependencies;

export type AccountPublicDependencies = Pick<
AccountInjectableDependencies,
  'accountService' | 'accountRepository'
>;

export function resolveAccountConfig(): AccountDiConfig {
  return {
    accountRepository: asClass(AccountRepository, SINGLETON_CONFIG),
    accountService: asClass(AccountService, SINGLETON_CONFIG),

    accountLoader: asFunction(
      (deps: AccountInjectableDependencies) => {
        const config: LoaderConfig<IAccount> = {
          dataSources: [new AccountDataSource(deps)],
        };

        return new Loader(config);
      },
      {
        lifetime: Lifetime.SINGLETON,
      },
    ),
  };
};
