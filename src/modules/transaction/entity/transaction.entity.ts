import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { v4 } from 'uuid';
import { Account } from '../../account/entity/account.entity';

@Entity('transactions', { synchronize: false })
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string = v4();

  @Column()
  amount: number;

  @Column()
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date = new Date();

  @ManyToOne(() => Account, (account) => account.transactions)
  senderAccount: Account;

  // Relacionamento muitos para um com Account (destinatário)
  @ManyToOne(() => Account, (account) => account.transactions)
  receiverAccount: Account;
}
