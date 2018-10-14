import * as Sequelize from "sequelize";
import { BelongsTo, Column, DataType, ForeignKey, IsUUID, Model, Table } from "sequelize-typescript";

import { Profile } from "./Profile";

@Table({ tableName: "account" })
export class Account extends Model<Account> {

	@IsUUID(4)
	@Column({
		primaryKey: true,
		type: DataType.UUID,
		defaultValue: Sequelize.UUIDV4,
	})
	public id: string;

	@Column
	public name: string;

	@Column({
		defaultValue: "current",
	})
	public type: string;

	@Column({
		defaultValue: true,
	})
	public active: boolean;

	@ForeignKey(() => Profile)
	@Column({ type: DataType.UUID })
	public profileId: string;

	@BelongsTo(() => Profile)
	public profile: Profile;

}
