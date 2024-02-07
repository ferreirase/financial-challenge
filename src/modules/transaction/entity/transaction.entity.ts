import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { v4 } from 'uuid';
import { Account } from '../../account/entity/account.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string = v4();

  @Column()
  amount: number;

  @Column()
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date = new Date();

  @ManyToOne(() => Account)
  sender: Account;

  // Relacionamento muitos para um com Account (destinatário)
  @ManyToOne(() => Account)
  receiver: Account;
}
