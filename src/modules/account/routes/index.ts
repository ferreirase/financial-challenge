import type { Routes } from '../../routes';

import { getAccount } from '../controller/account.controller';

export const getAccountRoutes = (): {
  routes: Routes
} => {
  return {
    routes: [
      {
        method: 'GET',
        url: `/accounts/:account_number`,
        handler: getAccount,
      },
    ],
  }
};
