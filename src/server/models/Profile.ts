import * as Sequelize from "sequelize";
import { BelongsToMany, Column, DataType, IsUUID, Model, Table } from "sequelize-typescript";

import { User } from "./User";
import { UserProfile } from "./UserProfile";

@Table({ tableName: "profile" })
export class Profile extends Model<Profile> {

	@IsUUID(4)
	@Column({
		primaryKey: true,
		type: DataType.UUID,
		defaultValue: Sequelize.UUIDV4,
	})
	public id: string;

	@Column
	public name: string;

	@BelongsToMany(() => User, () => UserProfile)
	public users: User[];

}
