import Sequelize = require('sequelize');
import { BelongsTo, Column, DataType, ForeignKey, IsUUID, Model, Table } from "sequelize-typescript";
import { Profile } from "./Profile";

@Table({ tableName: 'category' })
export class Category extends Model<Category> {

	@IsUUID(4)
	@Column({
		primaryKey: true,
		type: DataType.UUID,
		defaultValue: Sequelize.UUIDV4
	})
	id: string;

	@Column
	name: string;

	@Column({ defaultValue: false })
	isMemoCategory: boolean;

	@Column({ defaultValue: false })
	isIncomeCategory: boolean;

	@Column({ defaultValue: false })
	isExpenseCategory: boolean;

	@Column({ defaultValue: false })
	isAssetGrowthCategory: boolean;

	@ForeignKey(() => Profile)
	@Column({ type: DataType.UUID })
	profileId: string;

	@BelongsTo(() => Profile)
	profile: Profile;

}
