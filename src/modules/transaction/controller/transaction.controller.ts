import type { FastifyReply, FastifyRequest } from 'fastify';
import CustomError from "../../../utils/customError";
import { CreateTransactionDTO } from '../dtos/index';

export const createTransaction = async (
  req: FastifyRequest, res: FastifyReply
) => {
  const { transactionService } = req.diScope.cradle;
  const { senderAccountNumber, receiverAccountNumber, amount } = req.body as CreateTransactionDTO;

  try {
    return res.send({ result: await transactionService.createTransaction(
      senderAccountNumber, receiverAccountNumber, amount
    )});
  } catch (error) {
    if (error instanceof CustomError) {
      return res.code(error.code).send({ message: error.message });
    } 

    console.error(error);
    throw new Error('Erro desconhecido!');
  }
};


export const getAllTransactions = async (
  req: FastifyRequest, res: FastifyReply
) => {
  const { transactionService } = req.diScope.cradle;

  return res.send({ transactions: await transactionService.getAllTransactions() });
}