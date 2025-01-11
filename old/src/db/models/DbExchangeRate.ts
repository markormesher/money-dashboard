import { Column, Entity, PrimaryColumn, BaseEntity } from "typeorm";
import { BigIntTransformer } from "../BigIntTransformer";
import { IExchangeRate } from "../../models/IExchangeRate";
import { CurrencyCode } from "../../models/ICurrency";

@Entity("exchange_rate")
class DbExchangeRate extends BaseEntity implements IExchangeRate {
  @PrimaryColumn({
    type: String,
  })
  public currencyCode: CurrencyCode;

  @PrimaryColumn({
    type: "bigint",
    transformer: new BigIntTransformer(),
  })
  public date: number;

  @Column({
    type: "double precision",
  })
  public ratePerGbp: number;

  @Column({
    type: "bigint",
    transformer: new BigIntTransformer(),
  })
  public updateTime: number;
}

export { DbExchangeRate };
