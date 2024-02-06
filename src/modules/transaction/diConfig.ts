import type { Resolver } from 'awilix';
import { asClass, asFunction, Lifetime } from 'awilix';
import type { LoaderConfig } from 'layered-loader';
import { Loader } from 'layered-loader';

import { SINGLETON_CONFIG } from '../../infra/diConfig';
import { ITransaction } from './model/Transaction';

import { CommonDependencies } from "../../infra/commonDiConfig";
import { TransactionDataSource } from "./dataSource/transactionDataSource";
import TransactionRepository from './repository/transaction.mongo.repository';
import TransactionService from './service/transaction.service';


type TransactionDiConfig = Record<keyof TransactionModuleDependencies, Resolver<any>>;

export type TransactionModuleDependencies = {
  transactionRepository: TransactionRepository
  transactionService: TransactionService
  transactionLoader: Loader<ITransaction>
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

    transactionLoader: asFunction(
      (deps: TransactionInjectableDependencies) => {
        const config: LoaderConfig<ITransaction> = {
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
