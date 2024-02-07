import axios from 'axios';
import CustomError from '../../../utils/customError';
import { IAccount } from '../../account/model/Account';
import AccountService, { AccountObservable, IAccountUpdated } from "../../account/service/account.service";
import { CreateTransactionDTO } from '../dtos/index';
import TransactionRepository from '../repository/transaction.mongo.repository';

// ? CHAIN OF RESPONSABILITY
interface TransactionServiceProps {
  transactionRepository: TransactionRepository;
  accountService: AccountService;
  accountObservable: AccountObservable;
}

// Interface Handler
interface Handler {
  setNext(handler: Handler): Handler;
  handle(request: CreateTransactionDTO): Promise<boolean | IAccountUpdated>;
}

abstract class BaseHandler implements Handler {
  private nextHandler?: Handler;

  constructor(nextHandler?: Handler){
    this.nextHandler = nextHandler;
  }

  setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  async handle(request: CreateTransactionDTO): Promise<boolean | IAccountUpdated> {
    if (this.nextHandler) {
      return await this.nextHandler.handle(request) as boolean;
    }

    return true; // Se não houver próximo handler, retorna true por padrão
  }
}

class AccountsValidator extends BaseHandler {
  public accountService?: AccountService;
  private readonly accountSender: IAccount | undefined;
  private readonly receiverAccount: IAccount | undefined;

  constructor(nextHandler?: Handler, accountSender?: IAccount, receiverAccount?: IAccount) {
    super(nextHandler);
    this.accountSender = accountSender;
    this.receiverAccount = receiverAccount;
  }

  async handle(request: CreateTransactionDTO) {
    if (request.status !== 'pending') return true; // Se a transação não estiver pendente, passa para o próximo handler
    // Lógica para validar saldo do remetente
    console.log('Validando saldo do remetente...');

    // !todo - verificação do tipo de usuário
    // if (accountSender.user && accountSender.user) {
    //   console.log('Conta de entrada não encontrada!');
    //   return false;
    // }

    if((this.accountSender && this.accountSender.balance <= 0) || (this.accountSender && this.accountSender.balance < request.amount)){
      console.log('Saldo insuficiente na conta de saída!');
      throw new CustomError('Saldo insuficiente na conta de saída', 400);
    }

    console.log('Saldo suficiente.');
    return await super.handle(request);
  }
}

class ExternalServiceChecker extends BaseHandler {
  async handle(request: CreateTransactionDTO) {
    // Lógica para consultar serviço autorizador externo
    console.log('Consultando serviço autorizador externo...');
    try {
      const { data } = await axios.get(process.env.PAYMENT_CHECKER_URL || '');

      if (!data.approve) {
        console.log('Serviço autorizador: Transferência negada.');
        return false;
      } 

      console.log('Serviço autorizador: Transferência autorizada.');
      return await super.handle(request);
    } catch (error) {
      console.log('Erro ao consultar serviço autorizador:', error);
      return false;
    }
  }
}

class TransferExecutor extends BaseHandler {
  private readonly accountSender: IAccount;
  private readonly accountReceiver: IAccount;

  constructor(accountSender: IAccount, accountReceiver: IAccount){
    super();
    this.accountSender = accountSender;
    this.accountReceiver = accountReceiver;
  }

  async handle({ amount }: CreateTransactionDTO) {
    console.log('Executando transferência...');    

    console.log('Transferência concluída.');

    return { 
      sender: {
        account_number: this.accountSender.account_number,
        balance: this.accountSender.balance - amount
      }, 
      receiver:  {
        account_number: this.accountReceiver.account_number,
        balance: this.accountReceiver.balance + amount
      },
    };
  };
}

export default class TransactionService {
  private transactionRepository: TransactionRepository;
  private readonly accountService: AccountService;
  private readonly accountObservable: AccountObservable;

  constructor({ transactionRepository, accountService, accountObservable }: TransactionServiceProps) {
    this.transactionRepository = transactionRepository;
    this.accountService = accountService;
    this.accountObservable = accountObservable;
  }

  async findByTransactionId(transaction_id: string) {
    return await this.transactionRepository.findOneById(transaction_id);
  }

  async createTransaction(senderAccountNumber: string, receiverAccountNumber: string, amount: number){
    this.accountObservable.bind(this.accountService);
    
    const transaction = new CreateTransactionDTO(senderAccountNumber, receiverAccountNumber, amount, 'pending'); 
    
    const accountSender = await this.accountService?.findByAccountNumber(senderAccountNumber);
    const accountReceiver = await this.accountService?.findByAccountNumber(receiverAccountNumber);

    if(!accountSender){
      throw new Error('Sender account not found!');
    }

    if(!accountReceiver){
      throw new Error('Receiver account not found!');
    }

    const accountsValidator = new AccountsValidator(undefined, accountSender, accountReceiver);
    const externalServiceChecker = new ExternalServiceChecker();
    const transferExecutor = new TransferExecutor(accountSender, accountReceiver);

    accountsValidator.setNext(externalServiceChecker).setNext(transferExecutor);

    const result = await accountsValidator.handle(transaction) as unknown as IAccountUpdated;
    
    this.accountObservable.setBalance(result);

    return { transaction_status: 'success'};
  }
}
