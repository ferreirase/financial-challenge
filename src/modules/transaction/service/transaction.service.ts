import axios from 'axios';
import CustomError from '../../../utils/customError';
import { Account } from "../../account/entity/account.entity";
import AccountService, { AccountObservable, IAccountUpdated } from "../../account/service/account.service";
import { CreateTransactionDTO } from '../dtos/index';
import { default as TransactionImplementationRepository, default as TransactionRepository } from '../repository/transaction.implementation.repository';

// ? CHAIN OF RESPONSABILITY
interface TransactionServiceProps {
  transactionRepository: TransactionRepository;
  accountService: AccountService;
  accountObservable: AccountObservable;
}

// Interface Handler
interface Handler {
  setNext(handler: Handler): Handler;
  handle(request: CreateTransactionDTO): Promise<{error: boolean, message: string } | IAccountUpdated | boolean>;
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

  async handle(request: CreateTransactionDTO): Promise<{error: boolean, message: string } | IAccountUpdated | boolean> {
    if (this.nextHandler) {
      return await this.nextHandler.handle(request);
    }

    return true; // Se não houver próximo handler, retorna true por padrão
  }
}

class AccountsValidator extends BaseHandler {
  public accountService?: AccountService;
  private accountSender: Account | undefined;
  public transactionService?: TransactionService;

  constructor(nextHandler?: Handler, accountSender?: Account) {
    super(nextHandler);
    this.accountSender = accountSender;
  }

  async handle(request: CreateTransactionDTO) {
    if (request.status !== 'pending') return true; // Se a transação não estiver pendente, passa para o próximo handler
    // Lógica para validar saldo do remetente
    console.log('Validando saldo do remetente...');

    if (this.accountSender?.user && this.accountSender?.user?.type === 'PJ') {
      console.log('Conta PJ não pode fazer transferência!');
      throw new CustomError('Conta PJ não pode fazer transferência!', 400);
    }

    if((this.accountSender && this.accountSender.balance <= 0) || (this.accountSender && this.accountSender.balance < request.amount)){
      console.log('Saldo insuficiente na conta de saída!');
      throw new CustomError('Saldo insuficiente na conta de saída!', 400);
    }

    console.log('Saldo suficiente.');
    return await super.handle(request);
  }
}

class ExternalServiceChecker extends BaseHandler {
  public transactionService?: TransactionService;

  async handle(request: CreateTransactionDTO) {
    // Lógica para consultar serviço autorizador externo
    console.log('Consultando serviço autorizador externo...');
    try {
      const { data } = await axios.get(process.env.PAYMENT_CHECKER_URL || '');

      if (!data.approve) {
        console.log('Serviço autorizador: Transferência negada.');
        throw new CustomError('Serviço autorizador: Transferência negada.', 400);
      } 

      console.log('Serviço autorizador: Transferência autorizada.');
      return await super.handle({...request, status: 'completed'});
    } catch (error) {
      console.log('Erro ao consultar serviço autorizador:', error);
      return { error: true, message: `Erro ao consultar serviço autorizador: ${error}` };
    }
  }
}

class TransferExecutor extends BaseHandler {
  private readonly accountSender: Account;
  private readonly accountReceiver: Account;
  public transactionService?: TransactionService;
  private readonly transactionRepository: TransactionImplementationRepository;

  constructor(accountSender: Account, accountReceiver: Account, transactionRepository: TransactionImplementationRepository){
    super();
    this.accountSender = accountSender;
    this.accountReceiver = accountReceiver;
    this.transactionRepository = transactionRepository;
  }

  async handle(data: CreateTransactionDTO) {
    console.log('Executando transferência...');    

    console.log('Transferência concluída.');

    await this.transactionRepository.create(this.accountSender, this.accountReceiver, data.amount, data.status);
    // salvar transferência no banco de dados

    return { 
      sender: this.accountSender, 
      receiver: this.accountReceiver,
      amount: data.amount,
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
      throw new CustomError('Sender account not found!', 400);
    }

    if(!accountReceiver){
      throw new CustomError('Receiver account not found!', 400);
    }

    const accountsValidator = new AccountsValidator(undefined, accountSender);
    const externalServiceChecker = new ExternalServiceChecker();
    const transferExecutor = new TransferExecutor(accountSender, accountReceiver, this.transactionRepository);

    accountsValidator.setNext(externalServiceChecker).setNext(transferExecutor);

    const result = await accountsValidator.handle(transaction) as IAccountUpdated & { error: boolean, message: string };

    if(result && result.error){
      throw new CustomError(result.message, 400);
    }
    
    this.accountObservable.setBalance(result);

    return { transaction_status: 'success' };
  }

  async getAllTransactions(){
    return await this.transactionRepository.findAll();
  }
}
