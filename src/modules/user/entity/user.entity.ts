import bcrypt from 'bcryptjs';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { v4 } from 'uuid';

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
  
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
