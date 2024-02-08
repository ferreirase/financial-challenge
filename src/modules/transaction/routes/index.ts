import type { Routes } from '../../routes';

import { createTransaction, getAllTransactions } from '../controller/transaction.controller';

export const getTransactionRoutes = (): {
  routes: Routes
} => {
  return {
    routes: [
      {
        method: 'POST',
        url: `/transactions`,
        handler: createTransaction,
      },
      {
        method: 'GET',
        url: `/transactions`,
        handler: getAllTransactions,
      },
    ],
  }
};
