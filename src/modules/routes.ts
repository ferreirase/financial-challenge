import type http from 'node:http';

import type { RouteOptions } from 'fastify';

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

  return {
    routes: [...userRoutes],
  }
};
