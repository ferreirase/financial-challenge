import type { FastifyReply, FastifyRequest } from 'fastify';

export const getAccount = async (
  req: FastifyRequest, res: FastifyReply
) => {
  const { accountService  } = req.diScope.cradle;
  const { account_number } = req.params as { account_number: string };

  if(!account_number) return res.status(400).send({ message: 'Tá maluco? Manda a porra do CPF aí, bb!' });

  const account = await accountService.findByAccountNumber(account_number); 

  if(!account) return res.status(400).send({ message: 'Não achei não, hein!' });

  return res.send({ account });
};
