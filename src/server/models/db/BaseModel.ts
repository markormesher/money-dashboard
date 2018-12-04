import { BaseEntity, PrimaryGeneratedColumn } from "typeorm";

class BaseModel extends BaseEntity {

	@PrimaryGeneratedColumn("uuid")
	public id: string;

}

export {
	BaseModel,
};
