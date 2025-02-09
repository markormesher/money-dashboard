import React, { ReactElement } from "react";
import { Currency, CurrencyRate } from "../../../api_gen/moneydashboard/v4/currencies_pb";
import { useAsyncEffect } from "../../utils/hooks";
import { toastBus } from "../toaster/toaster";
import { Icon, IconGroup } from "../common/icon/icon";
import { useRouter } from "../app/router";
import { PageHeader } from "../page-header/page-header";
import { LoadingPanel } from "../common/loading/loading";
import { ErrorPanel } from "../common/error/error";
import { Tile, TileSet } from "../common/tile-set/tile-set";
import { copyToClipboard } from "../../utils/text";
import { currencyServiceClient } from "../../../api/api";
import { gbpCurrencyId, zeroId } from "../../../config/consts";
import { formatDateFromProto } from "../../utils/dates";
import { CurrencyEditModal } from "./currency-edit-modal";

function CurrenciesPage(): ReactElement {
  const { setMeta } = useRouter();
  React.useEffect(() => {
    setMeta({ parents: ["Settings"], title: "Currencies" });
  }, []);

  const [error, setError] = React.useState<unknown>();
  const [currencies, setCurrencies] = React.useState<Currency[]>();
  const [rates, setRates] = React.useState<Record<string, CurrencyRate>>();

  const [editingId, setEditingId] = React.useState<string>();

  useAsyncEffect(async () => {
    try {
      const res = await currencyServiceClient.getAllCurrencies({});
      setCurrencies(res.currencies);
    } catch (e) {
      toastBus.error("Failed to load currencies.");
      setError(e);
      console.log(e);
    }
  }, []);

  useAsyncEffect(async () => {
    try {
      const res = await currencyServiceClient.getLatestCurrencyRates({});
      const rates: Record<string, CurrencyRate> = {};
      res.currencyRates.forEach((r) => {
        rates[r.currencyId] = r;
      });
      setRates(rates);
    } catch (e) {
      toastBus.error("Failed to load currency rates.");
      setError(e);
      console.log(e);
    }
  }, []);

  const pageButtons = [
    <button className={"outline"} onClick={() => setEditingId(zeroId)}>
      <IconGroup>
        <Icon name={"add"} />
        <span>New</span>
      </IconGroup>
    </button>,
  ];

  const pageOptions = (
    <>
      <fieldset>
        <input type={"text"} placeholder={"Search"} />
      </fieldset>

      <fieldset>
        <label>
          <input type={"checkbox"} role={"switch"} />
          Hide inactive
        </label>
      </fieldset>
    </>
  );

  let body: ReactElement;
  if (error) {
    body = <ErrorPanel error={error} />;
  } else if (!currencies || !rates) {
    body = <LoadingPanel />;
  } else {
    body = (
      <TileSet>
        {currencies.map((c) => {
          const isGbp = c.id == gbpCurrencyId && false;
          const rate = rates[c.id];

          return (
            <Tile key={c.id}>
              <hgroup>
                <h4>
                  {c.symbol} {c.code}
                </h4>
                {rate ? (
                  <ul className={"horizonal"}>
                    <li>
                      &pound; = {c.symbol}
                      {rate.rate.toFixed(c.calculationPrecision)}
                    </li>
                    <li>Updated {formatDateFromProto(rate.date)}</li>
                  </ul>
                ) : (
                  <p>Never updated.</p>
                )}
              </hgroup>
              <footer>
                {isGbp ? (
                  <small className={"muted"}>The base currency cannot be edited.</small>
                ) : (
                  <ul className={"horizonal"}>
                    <li>
                      <a href={""} className={"secondary"} onClick={() => setEditingId(c.id)}>
                        <IconGroup>
                          <Icon name={"edit"} />
                          <span>Edit</span>
                        </IconGroup>
                      </a>
                    </li>

                    <li>
                      <a href={""} className={"secondary"} onClick={() => copyToClipboard(c.id)}>
                        <IconGroup>
                          <Icon name={"content_copy"} />
                          <span>Copy ID</span>
                        </IconGroup>
                      </a>
                    </li>
                  </ul>
                )}
              </footer>
            </Tile>
          );
        })}
      </TileSet>
    );
  }

  return (
    <>
      <div id={"content"} className={"overflow-auto"}>
        <PageHeader title={"Currencies"} buttons={pageButtons} options={pageOptions} />
        <hr />
        <section>{body}</section>
      </div>
      <CurrencyEditModal currencyId={editingId} onClose={() => setEditingId(undefined)} />
    </>
  );
}

export { CurrenciesPage };
