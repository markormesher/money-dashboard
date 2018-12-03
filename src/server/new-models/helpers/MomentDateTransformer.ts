import * as Moment from "moment";
import { ValueTransformer } from "typeorm";

class MomentDateTransformer implements ValueTransformer {
	public from(value: Moment.Moment): string {
		return value && value.toISOString() || null;
	}

	public to(value: string): Moment.Moment {
		return value && Moment(value) || null;
	}
}

export {
	MomentDateTransformer,
};
