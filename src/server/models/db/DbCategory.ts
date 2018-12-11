import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ICategory } from "../ICategory";
import { DbBudget } from "./DbBudget";
import { DbProfile } from "./DbProfile";

@Entity("new_category")
class DbCategory extends BaseEntity implements ICategory {

	@PrimaryGeneratedColumn("uuid")
	public id: string;

	@Column()
	public name: string;

	@Column({ default: false })
	public isMemoCategory: boolean;

	@Column({ default: false })
	public isIncomeCategory: boolean;

	@Column({ default: false })
	public isExpenseCategory: boolean;

	@Column({ default: false })
	public isAssetGrowthCategory: boolean;

	@OneToMany(
			/* istanbul ignore next */
			() => DbBudget,
			/* istanbul ignore next */
			(b) => b.category,
	)
	public budgets: DbBudget[];

	@ManyToOne(
			/* istanbul ignore next */
			() => DbProfile,
			/* istanbul ignore next */
			(p) => p.categories,
			{ eager: true },
	)
	public profile: DbProfile;

	@Column({ default: false })
	public deleted: boolean;

}

export {
	DbCategory,
};
