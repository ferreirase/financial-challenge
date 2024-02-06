import type { Routes } from '../../routes';

import { getAllUsers } from '../controller/user.controller';

export const getUserRoutes = (): {
  routes: Routes
} => {
  return {
    routes: [
      {
        method: 'GET',
        url: `/users`,
        handler: getAllUsers,
      },
    ],
  }
};
