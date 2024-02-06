import type { Routes } from '../../routes';

import { getAllUsers, getByRegisterNumber } from '../controller/user.controller';

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
      {
        method: 'GET',
        url: `/users/:register_number`,
        handler: getByRegisterNumber,
      },
    ],
  }
};
