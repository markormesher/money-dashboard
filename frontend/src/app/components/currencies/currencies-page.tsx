import React, { ReactElement } from "react";
import { Currency } from "../../../api_gen/moneydashboard/v4/currencies_pb";
import { useAsyncEffect } from "../../utils/hooks";
import { toastBus } from "../toaster/toaster";
import { apiClient } from "../../../api/api";
import { Icon, IconGroup } from "../common/icon/icon";
import { useRouter } from "../app/router";
import { PageHeader } from "../page-header/page-header";
import { LoadingPanel } from "../common/loading/loading";
import { ErrorPanel } from "../common/error/error";
import { Tile, TileSet } from "../common/tile-set/tile-set";
import { copyToClipboard } from "../../utils/text";

function CurrenciesPage(): ReactElement {
  const { setMeta } = useRouter();
  React.useEffect(() => {
    setMeta({ parents: ["Settings"], title: "Currencies" });
  }, []);

  const [error, setError] = React.useState<unknown>();
  const [currencies, setCurrencies] = React.useState<Currency[]>();

  useAsyncEffect(async () => {
    try {
      const res = await apiClient.getAllCurrencies({});
      setCurrencies(res.currencies);
    } catch (e) {
      toastBus.error("Failed to load currencies");
      setError(e);
      console.log(e);
    }
  }, []);

  const pageButtons = [
    <button className={"outline"}>
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
  } else if (!currencies) {
    body = <LoadingPanel />;
  } else {
    body = (
      <TileSet>
        {currencies.map((c) => (
          <Tile key={c.id}>
            <h4>
              {c.symbol} {c.code}
            </h4>
            <footer>
              <ul>
                <li>
                  <a href={""} className={"secondary"} onClick={() => toastBus.info("Coming soon..")}>
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
            </footer>
          </Tile>
        ))}
      </TileSet>
    );
  }

  return (
    <>
      <PageHeader title={"Currencies"} buttons={pageButtons} options={pageOptions} />
      <hr />
      <section>{body}</section>
    </>
  );
}

export { CurrenciesPage };
