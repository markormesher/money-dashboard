import { Column, Entity, PrimaryColumn, BaseEntity } from "typeorm";
import { BigIntTransformer } from "../BigIntTransformer";
import { IExchangeRate } from "../../../commons/models/IExchangeRate";
import { CurrencyCode } from "../../../commons/models/ICurrency";

@Entity("exchange_rate")
class DbExchangeRate extends BaseEntity implements IExchangeRate {
  @PrimaryColumn({
    type: String,
  })
  public currencyCode: CurrencyCode;

  @Column({
    type: "double precision",
  })
  public ratePerGbp: number;

  @PrimaryColumn({
    type: "bigint",
    transformer: new BigIntTransformer(),
  })
  public date: number;
}

export { DbExchangeRate };
