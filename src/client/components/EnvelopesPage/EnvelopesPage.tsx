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
  setDisplayActiveEnvelopesOnly,
  setDisplayActiveAllocationsOnly,
  startDeleteEnvelope,
  startSetEnvelopeActive,
  setAllocationToEdit,
  startDeleteAllocation,
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
import { IEnvelopeAllocation, mapEnvelopeAllocationFromApi } from "../../../models/IEnvelopeAllocation";
import { formatDate } from "../../helpers/formatters";
import { EnvelopeAllocationEditModal } from "../EnvelopeAllocationEditModal/EnvelopeAllocationEditModal";

interface IEnvelopesPageProps extends IProfileAwareProps {
  readonly envelopeCacheTime: number;
  readonly displayActiveEnvelopesOnly?: boolean;
  readonly envelopeToEdit?: IEnvelope;
  readonly envelopeEditsInProgress?: IEnvelope[];

  readonly allocationCacheTime: number;
  readonly displayActiveAllocationsOnly?: boolean;
  readonly allocationToEdit?: IEnvelopeAllocation;
  readonly allocationEditsInProgress?: IEnvelopeAllocation[];

  readonly actions?: {
    readonly setDisplayActiveEnvelopesOnly: (active: boolean) => AnyAction;
    readonly setEnvelopeToEdit: (envelope: IEnvelope) => AnyAction;
    readonly setEnvelopeActive: (active: boolean, envelope: IEnvelope) => AnyAction;
    readonly deleteEnvelope: (envelope: IEnvelope) => AnyAction;

    readonly setDisplayActiveAllocationsOnly: (active: boolean) => AnyAction;
    readonly setAllocationToEdit: (envelope: IEnvelopeAllocation) => AnyAction;
    readonly deleteAllocation: (envelope: IEnvelopeAllocation) => AnyAction;
  };
}

function mapStateToProps(state: IRootState, props: IEnvelopesPageProps): IEnvelopesPageProps {
  return {
    ...mapStateToProfileAwareProps(state),
    ...props,
    envelopeCacheTime: CacheKeyUtil.getKeyTime(EnvelopeCacheKeys.ENVELOPE_DATA),
    displayActiveEnvelopesOnly: state.envelopes.displayActiveEnvelopesOnly,
    envelopeToEdit: state.envelopes.envelopeToEdit,
    envelopeEditsInProgress: state.envelopes.envelopeEditsInProgress,

    allocationCacheTime: CacheKeyUtil.getKeyTime(EnvelopeCacheKeys.ALLOCATION_DATA),
    displayActiveAllocationsOnly: state.envelopes.displayActiveAllocationsOnly,
    allocationToEdit: state.envelopes.allocationToEdit,
    allocationEditsInProgress: state.envelopes.allocationEditsInProgress,
  };
}

function mapDispatchToProps(dispatch: Dispatch, props: IEnvelopesPageProps): IEnvelopesPageProps {
  return {
    ...props,
    actions: {
      setDisplayActiveEnvelopesOnly: (active): AnyAction => dispatch(setDisplayActiveEnvelopesOnly(active)),
      setEnvelopeToEdit: (envelope): AnyAction => dispatch(setEnvelopeToEdit(envelope)),
      setEnvelopeActive: (active, envelope): AnyAction => dispatch(startSetEnvelopeActive(envelope, active)),
      deleteEnvelope: (envelope): AnyAction => dispatch(startDeleteEnvelope(envelope)),

      setDisplayActiveAllocationsOnly: (active): AnyAction => dispatch(setDisplayActiveAllocationsOnly(active)),
      setAllocationToEdit: (allocation): AnyAction => dispatch(setAllocationToEdit(allocation)),
      deleteAllocation: (allocation): AnyAction => dispatch(startDeleteAllocation(allocation)),
    },
  };
}

class UCEnvelopesPage extends PureComponent<IEnvelopesPageProps> {
  private envelopeTableColumns: IColumn[] = [
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

  private envelopeDataProvider = new ApiDataTableDataProvider<IEnvelope>(
    "/api/envelopes/table-data",
    () => ({
      envelopeCacheTime: this.props.envelopeCacheTime,
      activeOnly: this.props.displayActiveEnvelopesOnly,
    }),
    mapEnvelopeFromApi,
  );

  private allocationTableColumns: IColumn[] = [
    {
      title: "Start Date",
      sortField: "allocation.startDate",
      defaultSortDirection: "DESC",
    },
    {
      title: "Allocation",
      sortField: "category.name",
      defaultSortDirection: "ASC",
    },
    {
      title: "Actions",
      sortable: false,
    },
  ];

  private allocationDataProvider = new ApiDataTableDataProvider<IEnvelopeAllocation>(
    "/api/envelope-allocations/table-data",
    () => ({
      allocationCacheTime: this.props.allocationCacheTime,
      activeOnly: this.props.displayActiveAllocationsOnly,
    }),
    mapEnvelopeAllocationFromApi,
  );

  constructor(props: IEnvelopesPageProps) {
    super(props);

    this.envelopeTableRowRenderer = this.envelopeTableRowRenderer.bind(this);
    this.generateEnvelopeActionButtons = this.generateEnvelopeActionButtons.bind(this);
    this.startEnvelopeCreation = this.startEnvelopeCreation.bind(this);

    this.allocationTableRowRenderer = this.allocationTableRowRenderer.bind(this);
    this.generateAllocationActionButtons = this.generateAllocationActionButtons.bind(this);
    this.startAllocationCreation = this.startAllocationCreation.bind(this);
  }

  public render(): ReactNode {
    const {
      envelopeCacheTime,
      allocationCacheTime,
      activeProfile,
      displayActiveEnvelopesOnly,
      displayActiveAllocationsOnly,
      envelopeToEdit,
      allocationToEdit,
    } = this.props;

    return (
      <>
        {envelopeToEdit !== undefined && <EnvelopeEditModal />}
        {allocationToEdit !== undefined && <EnvelopeAllocationEditModal />}

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
            checked={this.props.displayActiveEnvelopesOnly}
            onChange={this.props.actions.setDisplayActiveEnvelopesOnly}
            btnProps={{
              className: combine(bs.btnOutlineInfo, bs.btnSm),
            }}
          />
        </PageOptions>

        <Card>
          <DataTable<IEnvelope>
            columns={this.envelopeTableColumns}
            dataProvider={this.envelopeDataProvider}
            rowRenderer={this.envelopeTableRowRenderer}
            watchedProps={{ envelopeCacheTime, activeProfile, displayActiveEnvelopesOnly }}
          />
        </Card>

        <hr />

        <PageHeader>
          <h2>Envelope &harr; Category Allocations</h2>
          <PageHeaderActions>
            <IconBtn
              icon={"add"}
              text={"New Allocation"}
              onClick={this.startAllocationCreation}
              btnProps={{
                className: combine(bs.btnSm, bs.btnSuccess),
              }}
            />
          </PageHeaderActions>
        </PageHeader>

        <PageOptions>
          <CheckboxBtn
            text={"Active Allocations Only"}
            checked={this.props.displayActiveEnvelopesOnly}
            onChange={this.props.actions.setDisplayActiveAllocationsOnly}
            btnProps={{
              className: combine(bs.btnOutlineInfo, bs.btnSm),
            }}
          />
        </PageOptions>

        <Card>
          <DataTable<IEnvelopeAllocation>
            columns={this.allocationTableColumns}
            dataProvider={this.allocationDataProvider}
            rowRenderer={this.allocationTableRowRenderer}
            watchedProps={{ allocationCacheTime, activeProfile, displayActiveAllocationsOnly }}
          />
        </Card>
      </>
    );
  }

  private envelopeTableRowRenderer(envelope: IEnvelope): ReactElement<void> {
    return (
      <tr key={envelope.id}>
        <td>{envelope.name}</td>
        <td>{this.generateEnvelopeActionButtons(envelope)}</td>
      </tr>
    );
  }

  private generateEnvelopeActionButtons(envelope: IEnvelope): ReactElement<void> {
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

  private allocationTableRowRenderer(allocation: IEnvelopeAllocation): ReactElement<void> {
    return (
      <tr key={allocation.id}>
        <td>{formatDate(allocation.startDate)}</td>
        <td>
          {allocation.category.name} &rarr; {allocation.envelope.name}
        </td>
        <td>{this.generateAllocationActionButtons(allocation)}</td>
      </tr>
    );
  }

  private generateAllocationActionButtons(allocation: IEnvelopeAllocation): ReactElement<void> {
    const { actions, allocationEditsInProgress } = this.props;
    return (
      <div className={combine(bs.btnGroup, bs.btnGroupSm)}>
        <IconBtn
          icon={"edit"}
          text={"Edit"}
          payload={allocation}
          onClick={actions.setAllocationToEdit}
          btnProps={{
            className: bs.btnOutlineDark,
            disabled: allocationEditsInProgress.some((a) => a.id === allocation.id),
          }}
        />

        <DeleteBtn
          payload={allocation}
          onConfirmedClick={actions.deleteAllocation}
          btnProps={{
            className: bs.btnOutlineDark,
            disabled: allocationEditsInProgress.some((a) => a.id === allocation.id),
          }}
        />
      </div>
    );
  }

  private startEnvelopeCreation(): void {
    this.props.actions.setEnvelopeToEdit(null);
  }

  private startAllocationCreation(): void {
    this.props.actions.setAllocationToEdit(null);
  }
}

export const EnvelopesPage = connect(mapStateToProps, mapDispatchToProps)(UCEnvelopesPage);
