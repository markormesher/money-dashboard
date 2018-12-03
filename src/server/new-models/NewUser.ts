import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NewProfile } from "./NewProfile";

@Entity("new_user")
class NewUser extends BaseEntity {

	@PrimaryGeneratedColumn("uuid")
	public id: string;

	@Column()
	public googleId: string;

	@Column()
	public displayName: string;

	@Column()
	public image: string;

	@ManyToMany(() => NewProfile, (p) => p.users)
	@JoinTable()
	public profiles: NewProfile[];

	@ManyToOne(() => NewProfile, (p) => p.usersWithProfileActivated)
	public activeProfile: NewProfile;

}

export {
	NewUser,
};
