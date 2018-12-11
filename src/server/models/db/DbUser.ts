import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { IUser } from "../IUser";
import { DbProfile } from "./DbProfile";

@Entity("new_user")
class DbUser extends BaseEntity implements IUser {

	@PrimaryGeneratedColumn("uuid")
	public id: string;

	@Column()
	public googleId: string;

	@Column()
	public displayName: string;

	@Column()
	public image: string;

	@ManyToMany(
			/* istanbul ignore next */
			() => DbProfile,
			/* istanbul ignore next */
			(p) => p.users,
			{ eager: true, cascade: true },
	)
	@JoinTable()
	public profiles: DbProfile[];

	@ManyToOne(
			/* istanbul ignore next */
			() => DbProfile,
			/* istanbul ignore next */
			(p) => p.usersWithProfileActivated,
			{ eager: true },
	)
	public activeProfile: DbProfile;

	@Column({ default: false })
	public deleted: boolean;

}

export {
	DbUser,
};
