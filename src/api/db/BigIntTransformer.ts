import { FindOperator, ValueTransformer } from "typeorm";

class BigIntTransformer implements ValueTransformer {
  public static toDbFormat(value: number): string {
    if (value === undefined) {
      return undefined;
    } else if (value === null) {
      return null;
    } else {
      return `${value}`;
    }
  }

  public static fromDbFormat(value: string): number {
    if (value === undefined) {
      return undefined;
    } else if (value === null) {
      return null;
    } else {
      return parseInt(value);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public to(value: number | FindOperator<any>): string | FindOperator<any> {
    if (value instanceof FindOperator) {
      return value;
    }

    return BigIntTransformer.toDbFormat(value);
  }

  public from(value: string): number {
    return BigIntTransformer.fromDbFormat(value);
  }
}

export { BigIntTransformer };
