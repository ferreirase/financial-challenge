type TransactionStatus = 'pending' | 'completed' | 'failed';

export class CreateTransactionDTO {
  public senderAccountNumber: string;
  public receiverAccountNumber: string;
  public amount: number;
  public status: TransactionStatus;

  constructor(senderAccountNumber: string, receiverAccountNumber: string, amount: number, status: TransactionStatus) {
    this.senderAccountNumber = senderAccountNumber;
    this.receiverAccountNumber = receiverAccountNumber;
    this.amount = amount;
    this.status = status;
  }
}
