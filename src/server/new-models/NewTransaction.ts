import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MomentDateTransformer } from "./helpers/MomentDateTransformer";
import { NewAccount } from "./NewAccount";
import { NewCategory } from "./NewCategory";
import { NewProfile } from "./NewProfile";

@Entity("new_transaction")
class NewTransaction extends BaseEntity {

	@PrimaryGeneratedColumn("uuid")
	public id: string;

	@Column({
		type: String,
		transformer: new MomentDateTransformer(),
	})
	public transactionDate: Date;

	@Column({
		type: String,
		transformer: new MomentDateTransformer(),
	})
	public effectiveDate: Date;

	@Column({
		type: "float",
	})
	public amount: number;

	@Column()
	public payee: string;

	@Column()
	public note: string;

	@ManyToOne(() => NewAccount, (a) => a.transactions)
	public account: NewAccount;

	@ManyToOne(() => NewCategory, (c) => c.budgets)
	public category: NewCategory;

	@ManyToOne(() => NewProfile, (p) => p.budgets)
	public profile: NewProfile;

}

export {
	NewTransaction,
};
