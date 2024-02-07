import bcrypt from 'bcryptjs';
import { BeforeInsert, Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { v4 } from 'uuid';
import { Account } from "../../account/entity/account.entity";

export type UserType = 'PF' | 'PJ';

@Entity({ name: 'user'})
export class User {
  @PrimaryGeneratedColumn('uuid')
  private readonly id: string = v4();

  @Column()
  type: UserType;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  register_number: string;

  @Column()
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date = new Date();
  
  @OneToOne(() => Account, (account) => account.user)
  account: Account;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
