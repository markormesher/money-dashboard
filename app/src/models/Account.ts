import Sequelize = require('sequelize');
import { BelongsTo, Column, DataType, ForeignKey, IsUUID, Model, Table } from "sequelize-typescript";
import { Profile } from "./Profile";

@Table({ tableName: 'account' })
export class Account extends Model<Account> {

	@IsUUID(4)
	@Column({
		primaryKey: true,
		type: DataType.UUID,
		defaultValue: Sequelize.UUIDV4
	})
	id: string;

	@Column
	name: string;

	@Column({
		defaultValue: 'current'
	})
	type: string;

	@Column({
		defaultValue: true
	})
	active: boolean;

	@ForeignKey(() => Profile)
	@Column({ type: DataType.UUID })
	profileId: string;

	@BelongsTo(() => Profile)
	profile: Profile;

}
