import * as React from "react";
import { PureComponent, ReactElement, ReactNode } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { CacheKeyUtil } from "@dragonlabs/redux-cache-key-util";
import { IEnvelope, mapEnvelopeFromApi } from "../../../models/IEnvelope";
import * as bs from "../../global-styles/Bootstrap.scss";
import { combine } from "../../helpers/style-helpers";
import {
  EnvelopeCacheKeys,
  setEnvelopeToEdit,
  setDisplayActiveOnly,
  startDeleteEnvelope,
  startSetEnvelopeActive,
} from "../../redux/envelopes";
import { IRootState } from "../../redux/root";
import { CheckboxBtn } from "../_ui/CheckboxBtn/CheckboxBtn";
import { ApiDataTableDataProvider } from "../_ui/DataTable/DataProvider/ApiDataTableDataProvider";
import { DataTable, IColumn } from "../_ui/DataTable/DataTable";
import { DeleteBtn } from "../_ui/DeleteBtn/DeleteBtn";
import { IconBtn } from "../_ui/IconBtn/IconBtn";
import { KeyShortcut } from "../_ui/KeyShortcut/KeyShortcut";
import { EnvelopeEditModal } from "../EnvelopeEditModal/EnvelopeEditModal";
import { PageHeader, PageHeaderActions } from "../_ui/PageHeader/PageHeader";
import { PageOptions } from "../_ui/PageOptions/PageOptions";
import { Card } from "../_ui/Card/Card";
import { IProfileAwareProps, mapStateToProfileAwareProps } from "../../redux/profiles";

interface IEnvelopesPageProps extends IProfileAwareProps {
  readonly cacheTime: number;
  readonly displayActiveOnly?: boolean;
  readonly envelopeToEdit?: IEnvelope;
  readonly envelopeEditsInProgress?: IEnvelope[];

  readonly actions?: {
    readonly deleteEnvelope: (envelope: IEnvelope) => AnyAction;
    readonly setDisplayActiveOnly: (active: boolean) => AnyAction;
    readonly setEnvelopeToEdit: (envelope: IEnvelope) => AnyAction;
    readonly setEnvelopeActive: (active: boolean, envelope: IEnvelope) => AnyAction;
  };
}

function mapStateToProps(state: IRootState, props: IEnvelopesPageProps): IEnvelopesPageProps {
  return {
    ...mapStateToProfileAwareProps(state),
    ...props,
    cacheTime: CacheKeyUtil.getKeyTime(EnvelopeCacheKeys.ENVELOPE_DATA),
    displayActiveOnly: state.envelopes.displayActiveOnly,
    envelopeToEdit: state.envelopes.envelopeToEdit,
    envelopeEditsInProgress: state.envelopes.envelopeEditsInProgress,
  };
}

function mapDispatchToProps(dispatch: Dispatch, props: IEnvelopesPageProps): IEnvelopesPageProps {
  return {
    ...props,
    actions: {
      deleteEnvelope: (envelope): AnyAction => dispatch(startDeleteEnvelope(envelope)),
      setDisplayActiveOnly: (active): AnyAction => dispatch(setDisplayActiveOnly(active)),
      setEnvelopeToEdit: (envelope): AnyAction => dispatch(setEnvelopeToEdit(envelope)),
      setEnvelopeActive: (active, envelope): AnyAction => dispatch(startSetEnvelopeActive(envelope, active)),
    },
  };
}

class UCEnvelopesPage extends PureComponent<IEnvelopesPageProps> {
  private tableColumns: IColumn[] = [
    {
      title: "Name",
      sortField: "envelope.name",
      defaultSortDirection: "ASC",
    },
    {
      title: "Actions",
      sortable: false,
    },
  ];

  private dataProvider = new ApiDataTableDataProvider<IEnvelope>(
    "/api/envelopes/table-data",
    () => ({
      cacheTime: this.props.cacheTime,
      activeOnly: this.props.displayActiveOnly,
    }),
    mapEnvelopeFromApi,
  );

  constructor(props: IEnvelopesPageProps) {
    super(props);

    this.tableRowRenderer = this.tableRowRenderer.bind(this);
    this.generateActionButtons = this.generateActionButtons.bind(this);
    this.startEnvelopeCreation = this.startEnvelopeCreation.bind(this);
  }

  public render(): ReactNode {
    const { cacheTime, activeProfile, displayActiveOnly, envelopeToEdit } = this.props;

    return (
      <>
        {envelopeToEdit !== undefined && <EnvelopeEditModal />}

        <PageHeader>
          <h2>Envelopes</h2>
          <PageHeaderActions>
            <KeyShortcut targetStr={"c"} onTrigger={this.startEnvelopeCreation}>
              <IconBtn
                icon={"add"}
                text={"New Envelope"}
                onClick={this.startEnvelopeCreation}
                btnProps={{
                  className: combine(bs.btnSm, bs.btnSuccess),
                }}
              />
            </KeyShortcut>
          </PageHeaderActions>
        </PageHeader>

        <PageOptions>
          <CheckboxBtn
            text={"Active Envelopes Only"}
            checked={this.props.displayActiveOnly}
            onChange={this.props.actions.setDisplayActiveOnly}
            btnProps={{
              className: combine(bs.btnOutlineInfo, bs.btnSm),
            }}
          />
        </PageOptions>

        <Card>
          <DataTable<IEnvelope>
            columns={this.tableColumns}
            dataProvider={this.dataProvider}
            rowRenderer={this.tableRowRenderer}
            watchedProps={{ cacheTime, activeProfile, displayActiveOnly }}
          />
        </Card>
      </>
    );
  }

  private tableRowRenderer(envelope: IEnvelope): ReactElement<void> {
    return (
      <tr key={envelope.id}>
        <td>{envelope.name}</td>
        <td>{this.generateActionButtons(envelope)}</td>
      </tr>
    );
  }

  private generateActionButtons(envelope: IEnvelope): ReactElement<void> {
    const { actions, envelopeEditsInProgress } = this.props;
    return (
      <div className={combine(bs.btnGroup, bs.btnGroupSm)}>
        <IconBtn
          icon={"edit"}
          text={"Edit"}
          payload={envelope}
          onClick={actions.setEnvelopeToEdit}
          btnProps={{
            className: bs.btnOutlineDark,
            disabled: envelopeEditsInProgress.some((a) => a.id === envelope.id),
          }}
        />

        <CheckboxBtn
          text={"Active?"}
          payload={envelope}
          checked={envelope.active}
          onChange={actions.setEnvelopeActive}
          btnProps={{
            className: bs.btnOutlineDark,
            disabled: envelopeEditsInProgress.some((a) => a.id === envelope.id),
          }}
        />

        <DeleteBtn
          payload={envelope}
          onConfirmedClick={actions.deleteEnvelope}
          btnProps={{
            className: bs.btnOutlineDark,
            disabled: envelopeEditsInProgress.some((a) => a.id === envelope.id),
          }}
        />
      </div>
    );
  }

  private startEnvelopeCreation(): void {
    this.props.actions.setEnvelopeToEdit(null);
  }
}

export const EnvelopesPage = connect(mapStateToProps, mapDispatchToProps)(UCEnvelopesPage);
