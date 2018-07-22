import Sequelize = require("sequelize");
import { BelongsTo, Column, DataType, ForeignKey, IsUUID, Model, Table } from "sequelize-typescript";

import { Profile } from "./Profile";

@Table({ tableName: "category" })
export class Category extends Model<Category> {

	@IsUUID(4)
	@Column({
		primaryKey: true,
		type: DataType.UUID,
		defaultValue: Sequelize.UUIDV4,
	})
	public id: string;

	@Column
	public name: string;

	@Column({ defaultValue: false })
	public isMemoCategory: boolean;

	@Column({ defaultValue: false })
	public isIncomeCategory: boolean;

	@Column({ defaultValue: false })
	public isExpenseCategory: boolean;

	@Column({ defaultValue: false })
	public isAssetGrowthCategory: boolean;

	@ForeignKey(() => Profile)
	@Column({ type: DataType.UUID })
	public profileId: string;

	@BelongsTo(() => Profile)
	public profile: Profile;

}
