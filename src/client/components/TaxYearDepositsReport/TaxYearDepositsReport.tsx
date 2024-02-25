import axios, { AxiosResponse } from "axios";
import * as React from "react";
import { IDetailedCategoryBalance } from "../../../models/IDetailedCategoryBalance";
import { ITaxYearDepositsData, mapTaxYearDepositsDataFromApi } from "../../../models/ITaxYearDepositsData";
import { DateModeOption } from "../../../models/ITransaction";
import { AccountTag, ACCOUNT_TAG_DISPLAY_NAMES } from "../../../models/IAccount";
import * as bs from "../../global-styles/Bootstrap.scss";
import * as gs from "../../global-styles/Global.scss";
import { formatCurrencyStyled } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { CheckboxBtn } from "../_ui/CheckboxBtn/CheckboxBtn";
import { DateModeToggleBtn } from "../_ui/DateModeToggleBtn/DateModeToggleBtn";
import { LoadingSpinner } from "../_ui/LoadingSpinner/LoadingSpinner";
import { Card } from "../_ui/Card/Card";
import { PageHeader } from "../_ui/PageHeader/PageHeader";
import { PageOptions } from "../_ui/PageOptions/PageOptions";
import { globalErrorManager } from "../../helpers/errors/error-manager";

function TaxYearDepositsReport(): React.ReactElement {
  const lastFrameRequested = React.useRef(0);

  const [dateMode, setDateMode] = React.useState<DateModeOption>("transaction");
  const [splitValues, setSplitValues] = React.useState(false);
  const [accountTag, setAccountTag] = React.useState<AccountTag>("isa");
  const [data, setData] = React.useState<ITaxYearDepositsData>();
  const [loading, setLoading] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  // data fetching
  React.useEffect(() => {
    fetchData();
  }, [dateMode, accountTag]);

  function fetchData(): void {
    const thisFrame = ++lastFrameRequested.current;
    setLoading(true);

    axios
      .get<ITaxYearDepositsData>("/api/reports/tax-year-deposits/data", {
        params: { dateMode, accountTag },
      })
      .then((res: AxiosResponse<ITaxYearDepositsData>) => mapTaxYearDepositsDataFromApi(res.data))

      .then((data) => {
        if (thisFrame < lastFrameRequested.current) {
          console.log(`Dropping result for frame ${thisFrame}`);
          return;
        }

        setLoading(false);
        setFailed(false);
        setData(data);
      })
      .catch((err) => {
        if (thisFrame < lastFrameRequested.current) {
          console.log(`Dropping result for frame ${thisFrame}`);
          return;
        }

        globalErrorManager.emitNonFatalError("Failed to load data", err);
        setLoading(false);
        setFailed(true);
        setData(undefined);
      });
  }

  // ui

  function renderAccountTagChooser(): React.ReactElement[] {
    // tags that are relevant for tax year summaries
    const tags: AccountTag[] = ["pension", "isa"];
    return tags.map((tag) => (
      <CheckboxBtn
        key={`account-tag-${tag}`}
        payload={tag}
        text={ACCOUNT_TAG_DISPLAY_NAMES[tag]}
        checked={accountTag === tag}
        onChange={(checked) => {
          if (checked) {
            setAccountTag(tag);
          }
        }}
        btnProps={{
          className: combine(bs.btnOutlineInfo, bs.btnSm),
        }}
        iconUnchecked={"circle"}
        iconChecked={"check_circle"}
      />
    ));
  }

  function renderCategoryBalance(balance: IDetailedCategoryBalance): React.ReactElement | null {
    if (!balance) {
      return null;
    }

    const inc = balance.balanceIn;
    const dec = balance.balanceOut;

    if (splitValues) {
      return (
        <>
          {inc === 0 ? <>&nbsp;</> : formatCurrencyStyled(inc)}
          <br />
          {dec === 0 ? <>&nbsp;</> : formatCurrencyStyled(dec)}
        </>
      );
    } else {
      if (inc + dec == 0) {
        return null;
      }

      return <>{formatCurrencyStyled(inc + dec)}</>;
    }
  }

  function renderResults(): React.ReactElement {
    if (failed) {
      return <p>Data failed to load. Please try again.</p>;
    }

    if (loading) {
      return <LoadingSpinner centre={true} />;
    }

    if (!data) {
      return <p>No data to display.</p>;
    }

    const nonAssetCategories = data.allCategories
      .filter((c) => !c.isAssetGrowthCategory)
      .sort((a, b) => a.name.localeCompare(b.name));
    const assetCategories = data.allCategories
      .filter((c) => c.isAssetGrowthCategory)
      .sort((a, b) => a.name.localeCompare(b.name));
    const years = data.allYears.sort((a, b) => a - b);

    return (
      <div className={bs.tableResponsive}>
        <table className={combine(bs.table, bs.tableStriped, bs.tableSm)}>
          <thead>
            <tr>
              <th>{/* blank top-left corner cell */}</th>
              {years.map((year) => (
                <th key={year} className={bs.textEnd}>
                  {year}/{year + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {nonAssetCategories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                {years.map((year) => (
                  <td key={year} className={bs.textEnd}>
                    {renderCategoryBalance(data.yearData[year][category.id])}
                  </td>
                ))}
              </tr>
            ))}

            <tr className={gs.bottomBorder}>
              <td>
                <strong>Total Deposits</strong>
              </td>
              {years.map((year) => (
                <td key={year} className={bs.textEnd}>
                  <strong>
                    {formatCurrencyStyled(
                      Object.values(data.yearData[year])
                        .filter((b) => !b.category.isAssetGrowthCategory)
                        .map((b) => b.balanceIn + b.balanceOut)
                        .reduce((a, b) => a + b, 0),
                    )}
                  </strong>
                </td>
              ))}
            </tr>

            {assetCategories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                {years.map((year) => (
                  <td key={year} className={bs.textEnd}>
                    {renderCategoryBalance(data.yearData[year][category.id])}
                  </td>
                ))}
              </tr>
            ))}

            <tr className={gs.bottomBorder}>
              <td>
                <strong>Total</strong>
              </td>
              {years.map((year) => (
                <td key={year} className={bs.textEnd}>
                  <strong>
                    {formatCurrencyStyled(
                      Object.values(data.yearData[year])
                        .map((b) => b.balanceIn + b.balanceOut)
                        .reduce((a, b) => a + b, 0),
                    )}
                  </strong>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <>
      <PageHeader>
        <h2>Tax Year Deposits</h2>
      </PageHeader>

      <PageOptions>
        <CheckboxBtn
          text={"Split Values"}
          checked={splitValues}
          onChange={setSplitValues}
          btnProps={{
            className: combine(bs.btnOutlineInfo, bs.btnSm),
          }}
        />

        <DateModeToggleBtn
          value={dateMode}
          onChange={setDateMode}
          btnProps={{
            className: combine(bs.btnOutlineInfo, bs.btnSm),
          }}
        />

        <hr />

        {renderAccountTagChooser()}
      </PageOptions>

      <Card>{renderResults()}</Card>
    </>
  );
}

export { TaxYearDepositsReport };
