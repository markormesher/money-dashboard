import * as Sequelize from "sequelize";
import { BelongsTo, BelongsToMany, Column, DataType, DefaultScope, IsUUID, Model, Table } from "sequelize-typescript";
import { Profile } from "./Profile";
import { UserProfile } from "./UserProfile";

@DefaultScope({
	include: [
		{ model: () => Profile, as: "profiles" },
		{ model: () => Profile, as: "activeProfile" },
	],
})
@Table({ tableName: "user" })
export class User extends Model<User> {

	@IsUUID(4)
	@Column({
		primaryKey: true,
		type: DataType.UUID,
		defaultValue: Sequelize.UUIDV4,
	})
	public id: string;

	@Column
	public googleId: string;

	@Column
	public displayName: string;

	@Column
	public image: string;

	@BelongsToMany(() => Profile, () => UserProfile)
	public profiles: Profile[];

	// TODO: unused for now
	@BelongsTo(() => Profile, "activeProfileId")
	public activeProfile: Profile;
	public activeProfileId: string;

}
