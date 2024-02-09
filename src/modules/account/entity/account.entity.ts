// Account.entity.ts
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { v4 } from 'uuid';
import { Transaction } from "../../transaction/entity/transaction.entity";
import { User } from '../../user/entity/user.entity';

@Entity('accounts', { synchronize: false })
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string = v4();

  @Column()
  accountNumber: string;

  @Column()
  balance: number;

  @Column({ type: 'uuid' })
  userId: string;

  @OneToOne(() => User, (user) => user.account)
  @JoinColumn()
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.senderAccount)
  sentTransactions: typeof Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.receiverAccount)
  receivedTransactions: typeof Transaction[];
}
