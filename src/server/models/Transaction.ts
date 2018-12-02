import * as Sequelize from "sequelize";
import { BelongsTo, Column, DataType, IsUUID, Model, Table } from "sequelize-typescript";
import { Account } from "./Account";
import { Category } from "./Category";
import { Profile } from "./Profile";

type DateModeOption = "effective" | "transaction";

@Table({ tableName: "transaction" })
export class Transaction extends Model<Transaction> {

	@IsUUID(4)
	@Column({
		primaryKey: true,
		type: DataType.UUID,
		defaultValue: Sequelize.UUIDV4,
	})
	public id: string;

	@Column({ type: DataType.DATEONLY })
	public transactionDate: Date;

	@Column({ type: DataType.DATEONLY })
	public effectiveDate: Date;

	@Column({ type: DataType.FLOAT })
	public amount: number;

	@Column
	public payee: string;

	@Column
	public note: string;

	@BelongsTo(() => Account, "accountId")
	public account: Account;
	public accountId: string;

	@BelongsTo(() => Category, "categoryId")
	public category: Category;
	public categoryId: string;

	@BelongsTo(() => Profile, "profileId")
	public profile: Profile;
	public profileId: string;

}

export {
	DateModeOption,
};
