import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { NewBudget } from "./NewBudget";

@Entity("new_category")
class NewCategory extends BaseEntity {

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

	@OneToMany(() => NewBudget, (b) => b.profile)
	public budgets: NewBudget[];

}

export {
	NewCategory,
};
