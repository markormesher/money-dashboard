import Sequelize = require('sequelize');
import {Column, DataType, HasMany, IsUUID, Model, Table} from "sequelize-typescript";
import {Profile} from "./Profile";

@Table
export class User extends Model<User> {

	@IsUUID(4)
	@Column({
		primaryKey: true,
		type: DataType.UUID,
		defaultValue: Sequelize.UUIDV4
	})
	id: string;

	@Column
	googleId: string;

	@Column
	displayName: string;

	@Column
	image: string;

	@HasMany(() => Profile)
	profiles: Profile[]

}
