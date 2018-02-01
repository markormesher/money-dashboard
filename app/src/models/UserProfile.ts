import {Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "./User";
import {Profile} from "./Profile";

@Table
export class UserProfile extends Model<UserProfile> {

	@ForeignKey(() => User)
	@Column({type: DataType.UUID})
	userId: string;

	@ForeignKey(() => Profile)
	@Column({type: DataType.UUID})
	profileId: string;

}
