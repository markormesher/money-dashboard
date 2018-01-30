import Sequelize = require('sequelize');
import {Column, DataType, ForeignKey, IsUUID, Model, Table} from "sequelize-typescript";
import {User} from "./User";

@Table
export class Profile extends Model<Profile> {

	@IsUUID(4)
	@Column({
		primaryKey: true,
		type: DataType.UUID,
		defaultValue: Sequelize.UUIDV4
	})
	id: string;

	@ForeignKey(() => User)
	@Column({type: DataType.UUID})
	userId: string;

	@Column
	name: string;

	@Column
	active: boolean;

}
