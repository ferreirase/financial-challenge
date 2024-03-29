import type { Resolver } from 'awilix';
import { asClass, asFunction, Lifetime } from 'awilix';
import type { LoaderConfig } from 'layered-loader';
import { Loader } from 'layered-loader';

import { SINGLETON_CONFIG } from '../../infra/diConfig';
import { Transaction } from './entity/transaction.entity';

import { CommonDependencies } from "../../infra/commonDiConfig";
import { AccountObservable } from "../account/service/account.service";
import { TransactionDataSource } from "./dataSource/transactionDataSource";
import TransactionRepository from './repository/transaction.implementation.repository';
import TransactionService from './service/transaction.service';


type TransactionDiConfig = Record<keyof TransactionModuleDependencies, Resolver<any>>;

export type TransactionModuleDependencies = {
  transactionRepository: TransactionRepository
  transactionService: TransactionService
  accountObservable: AccountObservable
  transactionLoader: Loader<Transaction>
};

export type TransactionInjectableDependencies = TransactionModuleDependencies & CommonDependencies;

export type TransactionPublicDependencies = Pick<
TransactionInjectableDependencies,
  'transactionService' | 'transactionRepository'
>;

export function resolveTransactionConfig(): TransactionDiConfig {
  return {
    transactionRepository: asClass(TransactionRepository, SINGLETON_CONFIG),
    transactionService: asClass(TransactionService, SINGLETON_CONFIG),
    accountObservable: asClass(AccountObservable, SINGLETON_CONFIG),

    transactionLoader: asFunction(
      (deps: TransactionInjectableDependencies) => {
        const config: LoaderConfig<Transaction> = {
          dataSources: [new TransactionDataSource(deps)],
        };

        return new Loader(config);
      },
      {
        lifetime: Lifetime.SINGLETON,
      },
    ),
  };
};
