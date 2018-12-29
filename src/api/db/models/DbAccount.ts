import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IAccount } from "../../../commons/models/IAccount";
import { BaseModel } from "./BaseModel";
import { DbProfile } from "./DbProfile";
import { DbTransaction } from "./DbTransaction";

@Entity("account")
class DbAccount extends BaseModel implements IAccount {

	@PrimaryGeneratedColumn("uuid")
	public id: string;

	@Column()
	public name: string;

	@Column({ default: "current" })
	public type: string;

	@Column({ default: true })
	public active: boolean;

	@OneToMany(
			/* istanbul ignore next */
			() => DbTransaction,
			/* istanbul ignore next */
			(t) => t.account,
	)
	public transactions: DbTransaction[];

	@ManyToOne(
			/* istanbul ignore next */
			() => DbProfile,
			/* istanbul ignore next */
			(p) => p.accounts,
			{ eager: true },
	)
	public profile: DbProfile;

	@Column({ default: false })
	public deleted: boolean;

}

export {
	DbAccount,
};
