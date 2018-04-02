import Sequelize = require("sequelize");
import { BelongsTo, Column, DataType, ForeignKey, IsUUID, Model, Table } from "sequelize-typescript";

import { Category } from "./Category";
import { Profile } from "./Profile";

@Table({ tableName: "budget" })
export class Budget extends Model<Budget> {

	@IsUUID(4)
	@Column({
		primaryKey: true,
		type: DataType.UUID,
		defaultValue: Sequelize.UUIDV4,
	})
	public id: string;

	@Column({
		defaultValue: "budget",
	})
	public type: string;

	@Column({
		type: DataType.FLOAT,
	})
	public amount: number;

	@Column({
		type: DataType.DATEONLY,
	})
	public startDate: Date;

	@Column({
		type: DataType.DATEONLY,
	})
	public endDate: Date;

	@ForeignKey(() => Category)
	@Column({ type: DataType.UUID })
	public categoryId: string;

	@BelongsTo(() => Category)
	public category: Category;

	@ForeignKey(() => Profile)
	@Column({ type: DataType.UUID })
	public profileId: string;

	@BelongsTo(() => Profile)
	public profile: Profile;

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
