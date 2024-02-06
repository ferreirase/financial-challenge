import type { FastifyReply, FastifyRequest } from 'fastify';

export const getAllUsers = async (
  req: FastifyRequest, res: FastifyReply
) => {
  const { userService } = req.diScope.cradle;

  return res.send({ users: await userService.findAll() });
};

export const getByRegisterNumber = async (
  req: FastifyRequest, res: FastifyReply
) => {
  const { userService } = req.diScope.cradle;
  const { register_number } = req.params as { register_number: string };

  if(!register_number) return res.status(400).send({ message: 'Tá maluco? Manda a porra do CPF aí, bb!' });

  const user = await userService.findUserByRegisterNumber(register_number); 

  if(!user) return res.status(400).send({ message: 'Não achei não, hein!' });

  return res.send({ user });
};