import Sequelize = require('sequelize');
import { BelongsTo, Column, DataType, ForeignKey, IsUUID, Model, Table } from "sequelize-typescript";
import { Account } from "./Account";
import { Category } from "./Category";
import { Profile } from "./Profile";

@Table({ tableName: 'transaction' })
export class Transaction extends Model<Transaction> {

	@IsUUID(4)
	@Column({
		primaryKey: true,
		type: DataType.UUID,
		defaultValue: Sequelize.UUIDV4
	})
	id: string;

	@Column({
		type: DataType.DATEONLY
	})
	transactionDate: Date;

	@Column({
		type: DataType.DATEONLY
	})
	effectiveDate: Date;

	@Column({
		type: DataType.FLOAT
	})
	amount: number;

	@Column
	payee: string;

	@Column
	note: string;

	@ForeignKey(() => Account)
	@Column({ type: DataType.UUID })
	accountId: string;

	@BelongsTo(() => Account)
	account: Account;

	@ForeignKey(() => Category)
	@Column({ type: DataType.UUID })
	categoryId: string;

	@BelongsTo(() => Category)
	category: Category;

	@ForeignKey(() => Profile)
	@Column({ type: DataType.UUID })
	profileId: string;

	@BelongsTo(() => Profile)
	profile: Profile;

}
