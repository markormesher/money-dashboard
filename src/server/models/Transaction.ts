import * as Sequelize from "sequelize";
import { BelongsTo, Column, DataType, ForeignKey, IsUUID, Model, Table } from "sequelize-typescript";

import { Account } from "./Account";
import { Category } from "./Category";
import { Profile } from "./Profile";

@Table({ tableName: "transaction" })
export class Transaction extends Model<Transaction> {

	@IsUUID(4)
	@Column({
		primaryKey: true,
		type: DataType.UUID,
		defaultValue: Sequelize.UUIDV4,
	})
	public id: string;

	@Column({
		type: DataType.DATEONLY,
	})
	public transactionDate: Date;

	@Column({
		type: DataType.DATEONLY,
	})
	public effectiveDate: Date;

	@Column({
		type: DataType.FLOAT,
	})
	public amount: number;

	@Column
	public payee: string;

	@Column
	public note: string;

	@ForeignKey(() => Account)
	@Column({ type: DataType.UUID })
	public accountId: string;

	@BelongsTo(() => Account)
	public account: Account;

	@ForeignKey(() => Category)
	@Column({ type: DataType.UUID })
	public categoryId: string;

	@BelongsTo(() => Category)
	public category: Category;

	@ForeignKey(() => Profile)
	@Column({ type: DataType.UUID })
	public profileId: string;

	@BelongsTo(() => Profile)
	public profile: Profile;

}
