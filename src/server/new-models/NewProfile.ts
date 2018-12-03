import { BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { NewAccount } from "./NewAccount";
import { NewBudget } from "./NewBudget";
import { NewUser } from "./NewUser";

@Entity("new_profile")
class NewProfile extends BaseEntity {

	@PrimaryGeneratedColumn("uuid")
	public id: string;

	@Column()
	public name: string;

	@OneToMany(() => NewAccount, (a) => a.profile)
	public accounts: NewAccount[];

	@OneToMany(() => NewBudget, (b) => b.profile)
	public budgets: NewBudget[];

	@ManyToMany(() => NewUser, (u) => u.profiles)
	public users: NewUser[];

	@OneToMany(() => NewUser, (b) => b.activeProfile)
	public usersWithProfileActivated: NewUser[];

}

export {
	NewProfile,
};
