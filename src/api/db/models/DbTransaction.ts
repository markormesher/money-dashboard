import * as Moment from "moment";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ITransaction } from "../../../commons/models/ITransaction";
import { MomentDateTransformer } from "../MomentDateTransformer";
import { DbAccount } from "./DbAccount";
import { DbCategory } from "./DbCategory";
import { DbProfile } from "./DbProfile";

@Entity("transaction")
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

	@Column({ type: "float" })
	public amount: number;

	@Column()
	public payee: string;

	@Column({ nullable: true })
	public note: string;

	@Column({ default: false })
	public deleted: boolean;

	@ManyToOne(
			/* istanbul ignore next */
			() => DbAccount,
			/* istanbul ignore next */
			(a) => a.transactions,
	)
	public account: DbAccount;

	@ManyToOne(
			/* istanbul ignore next */
			() => DbCategory,
			/* istanbul ignore next */
			(c) => c.budgets,
	)
	public category: DbCategory;

	@ManyToOne(
			/* istanbul ignore next */
			() => DbProfile,
			/* istanbul ignore next */
			(p) => p.transactions,
	)
	public profile: DbProfile;

}

export {
	DbTransaction,
};
