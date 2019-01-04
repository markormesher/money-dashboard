import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { IUser } from "../../../commons/models/IUser";
import { DbProfile } from "./DbProfile";

@Entity("user")
class DbUser extends BaseEntity implements IUser {

	@PrimaryGeneratedColumn("uuid")
	public id: string;

	@Column()
	public googleId: string;

	@Column()
	public displayName: string;

	@Column()
	public image: string;

	@Column({ default: false })
	public deleted: boolean;

	@ManyToMany(
			/* istanbul ignore next */
			() => DbProfile,
			/* istanbul ignore next */
			(p) => p.users,
			{ cascade: true },
	)
	@JoinTable()
	public profiles: DbProfile[];

	@ManyToOne(
			/* istanbul ignore next */
			() => DbProfile,
			/* istanbul ignore next */
			(p) => p.usersWithProfileActivated,
	)
	public activeProfile: DbProfile;

}

export {
	DbUser,
};
