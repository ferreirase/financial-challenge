import type http from 'node:http';

import type { RouteOptions } from 'fastify';

import { getAccountRoutes } from './account/routes';
import { getTransactionRoutes } from './transaction/routes';
import { getUserRoutes } from './user/routes';

export type Routes = Array<
  RouteOptions<
    http.Server,
    http.IncomingMessage,
    http.ServerResponse
  >
>

export function getRoutes(): {
  routes: Routes
} {
  const { routes: userRoutes } = getUserRoutes();
  const { routes: accountRoutes } = getAccountRoutes();
  const { routes: transactionRoutes } = getTransactionRoutes();

  return {
    routes: [...userRoutes, ...accountRoutes, ...transactionRoutes],
  }
};
