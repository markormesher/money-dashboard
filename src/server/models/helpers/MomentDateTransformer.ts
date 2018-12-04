import * as Moment from "moment";
import { FindOperator, ValueTransformer } from "typeorm";

class MomentDateTransformer implements ValueTransformer {

	public static toDbFormat(value: Moment.Moment): number {
		return value.unix();
	}

	public static fromDbFormat(value: number): Moment.Moment {
		return value ? Moment(value * 1000) : null;
	}

	public to(value: Moment.Moment | FindOperator<any>): number | FindOperator<any> {
		if (!value) {
			return null;
		}

		if (value instanceof FindOperator) {
			return value;
		}

		return MomentDateTransformer.toDbFormat(value);
	}

	public from(value: number): Moment.Moment {
		return MomentDateTransformer.fromDbFormat(value);
	}
}

export {
	MomentDateTransformer,
};
