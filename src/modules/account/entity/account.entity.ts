// Account.entity.ts
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { v4 } from 'uuid';
import { User } from '../../user/entity/user.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  private readonly id: string = v4();

  @Column()
  accountNumber: string;

  @Column()
  balance: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
