import * as Sequelize from "sequelize";
import { BelongsTo, Column, DataType, IsUUID, Model, Table } from "sequelize-typescript";
import { Category } from "./Category";
import { Profile } from "./Profile";

type BudgetPeriod = "month" | "calendar year" | "tax year" | "other";

@Table({ tableName: "budget" })
class Budget extends Model<Budget> {

	@IsUUID(4)
	@Column({
		primaryKey: true,
		type: DataType.UUID,
		defaultValue: Sequelize.UUIDV4,
	})
	public id: string;

	@Column({ defaultValue: "budget" })
	public type: string;

	@Column({ type: DataType.FLOAT })
	public amount: number;

	@Column({ type: DataType.DATEONLY })
	public startDate: Date;

	@Column({ type: DataType.DATEONLY })
	public endDate: Date;

	@BelongsTo(() => Category, "categoryId")
	public category: Category;
	public categoryId: string;

	@BelongsTo(() => Profile, "profileId")
	public profile: Profile;
	public profileId: string;

	public buildClone = (): Budget => {
		return Budget.build({
			type: this.type,
			amount: this.amount,
			startDate: this.startDate,
			endDate: this.endDate,
			categoryId: this.categoryId,
			profileId: this.profileId,
		});
	}

}

export {
	Budget,
	BudgetPeriod,
};
