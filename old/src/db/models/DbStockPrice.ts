import { Column, Entity, PrimaryColumn, BaseEntity } from "typeorm";
import { BigIntTransformer } from "../BigIntTransformer";
import { StockTicker } from "../../models/IStock";
import { IStockPrice } from "../../models/IStockPrice";

@Entity("stock_price")
class DbStockPrice extends BaseEntity implements IStockPrice {
  @PrimaryColumn({
    type: String,
  })
  public ticker: StockTicker;

  @PrimaryColumn({
    type: "bigint",
    transformer: new BigIntTransformer(),
  })
  public date: number;

  @Column({
    type: "double precision",
  })
  public ratePerBaseCurrency: number;
}

export { DbStockPrice };
