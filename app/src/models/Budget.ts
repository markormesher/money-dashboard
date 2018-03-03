import Sequelize = require('sequelize');
import { BelongsTo, Column, DataType, ForeignKey, IsUUID, Model, Table } from "sequelize-typescript";
import { Category } from "./Category";
import { Profile } from "./Profile";

@Table({ tableName: 'budget' })
export class Budget extends Model<Budget> {

	@IsUUID(4)
	@Column({
		primaryKey: true,
		type: DataType.UUID,
		defaultValue: Sequelize.UUIDV4
	})
	id: string;

	@Column({
		defaultValue: 'budget'
	})
	type: string;

	@Column({
		type: DataType.FLOAT
	})
	amount: number;

	@Column({
		type: DataType.DATEONLY
	})
	startDate: Date;

	@Column({
		type: DataType.DATEONLY
	})
	endDate: Date;

	@ForeignKey(() => Category)
	@Column({ type: DataType.UUID })
	categoryId: string;

	@BelongsTo(() => Category)
	category: Category;

	@ForeignKey(() => Profile)
	@Column({ type: DataType.UUID })
	profileId: string;

	@BelongsTo(() => Profile)
	profile: Profile;

	buildClone = (): Budget => {
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
