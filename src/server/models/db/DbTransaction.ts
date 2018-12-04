import * as Moment from "moment";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MomentDateTransformer } from "../helpers/MomentDateTransformer";
import { ITransaction } from "../ITransaction";
import { DbAccount } from "./DbAccount";
import { DbCategory } from "./DbCategory";
import { DbProfile } from "./DbProfile";

@Entity("new_transaction")
class DbTransaction extends BaseEntity implements ITransaction {

	@PrimaryGeneratedColumn("uuid")
	public id: string;

	@Column({
		type: "integer",
		transformer: new MomentDateTransformer(),
	})
	public transactionDate: Moment.Moment;

	@Column({
		type: "integer",
		transformer: new MomentDateTransformer(),
	})
	public effectiveDate: Moment.Moment;

	@Column({
		type: "float",
	})
	public amount: number;

	@Column()
	public payee: string;

	@Column({ nullable: true })
	public note: string;

	@ManyToOne(() => DbAccount, (a) => a.transactions, { eager: true })
	public account: DbAccount;

	@ManyToOne(() => DbCategory, (c) => c.budgets, { eager: true })
	public category: DbCategory;

	@ManyToOne(() => DbProfile, (p) => p.budgets, { eager: true })
	public profile: DbProfile;

}

export {
	DbTransaction,
};
