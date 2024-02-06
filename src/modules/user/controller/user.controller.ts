import type { FastifyReply, FastifyRequest } from 'fastify';

export const getAllUsers = async (
  req: FastifyRequest, res: FastifyReply
) => {
  const { userService } = req.diScope.cradle;

  return res.send({ users: await userService.findAll() });
};