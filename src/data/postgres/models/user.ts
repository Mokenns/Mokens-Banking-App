import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 100,
    nullable: false,
  })
  name: string;

  @Column('varchar', {
    length: 100,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column('text', {
    nullable: false,
  })
  password: string;

  @Column('varchar', {
    length: 20,
    nullable: false,
    default: generateAccountNumber(),
  })
  account_number: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    nullable: false,
    default: 0,
  })
  balance: number;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  created_at: Date;

  @Column('boolean', {
    default: false,
    nullable: false,
  })
  status: boolean;

  @Column('enum', {
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;
}

function generateAccountNumber() {
  const timestamp = Date.now().toString().slice(-8);
  const randomDigits = Math.floor(100000 + Math.random() * 900000).toString();
  return timestamp + randomDigits;
}
