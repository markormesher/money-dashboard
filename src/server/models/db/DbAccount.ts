import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IAccount } from "../IAccount";
import { BaseModel } from "./BaseModel";
import { DbProfile } from "./DbProfile";
import { DbTransaction } from "./DbTransaction";

@Entity("new_account")
class DbAccount extends BaseModel implements IAccount {

	@PrimaryGeneratedColumn("uuid")
	public id: string;

	@Column()
	public name: string;

	@Column({ default: "current" })
	public type: string;

	@Column({ default: true })
	public active: boolean;

	@OneToMany(() => DbTransaction, (t) => t.account)
	public transactions: DbTransaction[];

	@ManyToOne(() => DbProfile, (p) => p.accounts, { eager: true })
	public profile: DbProfile;

	@Column({ default: false })
	public deleted: boolean;

}

export {
	DbAccount,
};
