import * as Moment from "moment";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MomentDateTransformer } from "./helpers/MomentDateTransformer";
import { NewCategory } from "./NewCategory";
import { NewProfile } from "./NewProfile";

@Entity("new_budget")
class NewBudget extends BaseEntity {

	@PrimaryGeneratedColumn("uuid")
	public id: string;

	@Column({
		type: String,
		default: "budget",
	})
	public type: "budget" | "bill";

	@Column({
		type: "float",
	})
	public amount: number;

	@Column({
		type: String,
		transformer: new MomentDateTransformer(),
	})
	public startDate: Moment.Moment;

	@Column({
		type: String,
		transformer: new MomentDateTransformer(),
	})
	public endDate: Moment.Moment;

	@ManyToOne(() => NewCategory, (c) => c.budgets)
	public category: NewCategory;

	@ManyToOne(() => NewProfile, (p) => p.budgets)
	public profile: NewProfile;

}

export {
	NewBudget,
};
