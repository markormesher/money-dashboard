import * as Moment from "moment";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MomentDateTransformer } from "../helpers/MomentDateTransformer";
import { IBudget } from "../IBudget";
import { BaseModel } from "./BaseModel";
import { DbCategory } from "./DbCategory";
import { DbProfile } from "./DbProfile";

@Entity("new_budget")
class DbBudget extends BaseModel implements IBudget {

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
		type: "integer",
		transformer: new MomentDateTransformer(),
	})
	public startDate: Moment.Moment;

	@Column({
		type: "integer",
		transformer: new MomentDateTransformer(),
	})
	public endDate: Moment.Moment;

	@ManyToOne(() => DbCategory, (c) => c.budgets, { eager: true })
	public category: DbCategory;

	@ManyToOne(() => DbProfile, (p) => p.budgets, { eager: true })
	public profile: DbProfile;

	public clone(): DbBudget {
		const output = new DbBudget();
		output.type = this.type;
		output.amount = this.amount;
		output.startDate = this.startDate;
		output.endDate = this.endDate;
		output.category = this.category;
		output.profile = this.profile;
		return output;
	}

}

export {
	DbBudget,
};
