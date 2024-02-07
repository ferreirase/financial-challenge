import type { Routes } from '../../routes';

import { createTransaction } from '../controller/transaction.controller';

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
    ],
  }
};
