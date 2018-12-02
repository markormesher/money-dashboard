import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Profile } from "./Profile";
import { User } from "./User";

@Table({ tableName: "user_profile" })
export class UserProfile extends Model<UserProfile> {

	@ForeignKey(() => User)
	@Column({ type: DataType.UUID })
	public userId: string;

	@ForeignKey(() => Profile)
	@Column({ type: DataType.UUID })
	public profileId: string;

}
