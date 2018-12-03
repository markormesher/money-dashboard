import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { NewProfile } from "./NewProfile";
import { NewTransaction } from "./NewTransaction";

@Entity("new_account")
class NewAccount extends BaseEntity {

	@PrimaryGeneratedColumn("uuid")
	public id: string;

	@Column()
	public name: string;

	@Column({ default: "current" })
	public type: string;

	@Column({ default: true })
	public active: boolean;

	@OneToMany(() => NewTransaction, (t) => t.account)
	public transactions: NewTransaction[];

	@ManyToOne(() => NewProfile, (p) => p.accounts)
	public profile: NewProfile;

}

export {
	NewAccount,
};
