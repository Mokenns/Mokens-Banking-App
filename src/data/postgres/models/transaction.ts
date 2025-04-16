import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column('uuid', {
		nullable: false,
	})
	sender_id: string;

	@Column('uuid', {
		nullable: false,
	})
	receiver_id: string;

	@Column('decimal', {
		precision: 10,
		scale: 2,
		nullable: false,
		default: 0,
	})
	amount: number;

	@Column('timestamp', {
		default: () => 'CURRENT_TIMESTAMP',
		nullable: false,
	})
	transaction_date: Date;
}
