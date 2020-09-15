import { Column, Entity, PrimaryColumn } from "typeorm";
import { BigIntTransformer } from "../BigIntTransformer";
import { IExchangeRate } from "../../../commons/models/IExchangeRate";
import { CurrencyCode } from "../../../commons/models/ICurrency";
import { BaseModel } from "./BaseModel";

@Entity("exchange_rate")
class DbExchangeRate extends BaseModel implements IExchangeRate {
  @PrimaryColumn({
    type: String,
  })
  public currencyCode: CurrencyCode;

  @PrimaryColumn({
    type: "double precision",
  })
  public ratePerGbp: number;

  @Column({
    type: "bigint",
    transformer: new BigIntTransformer(),
  })
  public date: number;
}

export { DbExchangeRate };
