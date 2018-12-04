import { BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IProfile } from "../IProfile";
import { DbAccount } from "./DbAccount";
import { DbBudget } from "./DbBudget";
import { DbCategory } from "./DbCategory";
import { DbUser } from "./DbUser";

@Entity("new_profile")
class DbProfile extends BaseEntity implements IProfile {

	@PrimaryGeneratedColumn("uuid")
	public id: string;

	@Column()
	public name: string;

	@OneToMany(() => DbAccount, (a) => a.profile)
	public accounts: DbAccount[];

	@OneToMany(() => DbBudget, (b) => b.profile)
	public budgets: DbBudget[];

	@OneToMany(() => DbCategory, (c) => c.profile)
	public categories: DbCategory[];

	@ManyToMany(() => DbUser, (u) => u.profiles)
	public users: DbUser[];

	@OneToMany(() => DbUser, (b) => b.activeProfile)
	public usersWithProfileActivated: DbUser[];

}

export {
	DbProfile,
};
