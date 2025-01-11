import { SelectQueryBuilder } from "typeorm";
import { StatusError } from "../utils/StatusError";
import { cleanUuid } from "../utils/entities";
import { DbEnvelope } from "../db/models/DbEnvelope";
import { DbUser } from "../db/models/DbUser";
import { IEnvelopeBalance } from "../models/IEnvelopeBalance";
import { IEnvelopeAllocation } from "../models/IEnvelopeAllocation";
import { ITransaction } from "../models/ITransaction";
import { IEnvelope } from "../models/IEnvelope";
import { roundCurrency } from "../utils/helpers";
import { getAllEnvelopeAllocations } from "./envelope-allocation-manager";
import { getTransactionQueryBuilder } from "./transaction-manager";
import { getEnvelopeTransferQueryBuilder } from "./envelope-transfer-manager";

interface IEnvelopeQueryBuilderOptions {
  readonly withProfile?: boolean;
}

function getEnvelopeQueryBuilder(options: IEnvelopeQueryBuilderOptions = {}): SelectQueryBuilder<DbEnvelope> {
  let builder = DbEnvelope.createQueryBuilder("envelope");

  if (options.withProfile) {
    builder = builder.leftJoinAndSelect("envelope.profile", "profile");
  }

  return builder;
}

function getEnvelope(user: DbUser, envelopeId?: string): Promise<DbEnvelope> {
  return getEnvelopeQueryBuilder()
    .where("envelope.id = :envelopeId")
    .andWhere("envelope.profile_id = :profileId")
    .andWhere("envelope.deleted = FALSE")
    .setParameters({
      envelopeId: cleanUuid(envelopeId),
      profileId: user.activeProfile.id,
    })
    .getOne();
}

function getAllEnvelopes(user: DbUser): Promise<DbEnvelope[]> {
  const query = getEnvelopeQueryBuilder()
    .where("envelope.profile_id = :profileId")
    .andWhere("envelope.deleted = FALSE")
    .setParameters({
      profileId: user.activeProfile.id,
    });

  return query.getMany();
}

function getEnvelopeForTransaction(envelopeAllocations: IEnvelopeAllocation[], transaction: ITransaction): IEnvelope {
  const matchingAllocations = envelopeAllocations.filter(
    (allocation) =>
      allocation.category.id == transaction.category.id && allocation.startDate <= transaction.effectiveDate,
  );
  if (matchingAllocations.length == 0) {
    return null;
  } else {
    // find the most recent allocation by sorting biggest-first
    matchingAllocations.sort((a, b) => b.startDate - a.startDate);
    return matchingAllocations[0].envelope;
  }
}

async function getEnvelopeBalances(user: DbUser): Promise<IEnvelopeBalance[]> {
  // AFTER-REFACTOR: currencies

  // get all envelopes and set up zero balances for them
  const envelopes = await getAllEnvelopes(user);
  const balances: Record<string, number> = {};
  envelopes.forEach((e) => {
    balances[e.id] = 0;
  });

  // get all transactions and map each transaction to an envelope
  const envelopeAllocations = await getAllEnvelopeAllocations(user, false);
  const transactions = await getTransactionQueryBuilder({ withCategory: true, withAccount: true })
    .where("transaction.profile_id = :profileId")
    .andWhere("transaction.deleted = FALSE")
    .andWhere("account.include_in_envelopes = TRUE")
    .setParameters({
      profileId: user.activeProfile.id,
    })
    .getMany();
  let unallocatedBalance = 0;
  transactions.forEach((transaction) => {
    const envelope = getEnvelopeForTransaction(envelopeAllocations, transaction);
    if (envelope == null) {
      unallocatedBalance += transaction.amount;
    } else {
      balances[envelope.id] += transaction.amount;
    }
  });

  // get all transfers between envelopes and update balances accordingly
  const envelopeTransfers = await getEnvelopeTransferQueryBuilder()
    .where("transfer.profile_id = :profileId")
    .andWhere("transfer.deleted = FALSE")
    .setParameters({
      profileId: user.activeProfile.id,
    })
    .getMany();
  envelopeTransfers.forEach((transfer) => {
    const { fromEnvelope, toEnvelope } = transfer;

    if (!fromEnvelope) {
      unallocatedBalance -= transfer.amount;
    } else {
      balances[fromEnvelope.id] -= transfer.amount;
    }

    if (!toEnvelope) {
      unallocatedBalance += transfer.amount;
    } else {
      balances[toEnvelope.id] += transfer.amount;
    }
  });

  // build return values and add an extra record for unallocated funds
  const returnValue = envelopes.map((envelope) => ({ envelope, balance: roundCurrency(balances[envelope.id]) }));
  returnValue.push({ envelope: null, balance: roundCurrency(unallocatedBalance) });
  return returnValue;
}

function saveEnvelope(user: DbUser, envelopeId: string, properties: Partial<DbEnvelope>): Promise<DbEnvelope> {
  return getEnvelope(user, envelopeId).then((envelope) => {
    envelope = DbEnvelope.getRepository().merge(envelope || new DbEnvelope(), properties);
    envelope.profile = user.activeProfile;
    return envelope.save();
  });
}

function deleteEnvelope(user: DbUser, envelopeId: string): Promise<DbEnvelope> {
  return getEnvelope(user, envelopeId).then((envelope) => {
    if (!envelope) {
      throw new StatusError(404, "That envelope does not exist");
    } else {
      envelope.deleted = true;
      return envelope.save();
    }
  });
}

export { getEnvelopeQueryBuilder, getEnvelope, getAllEnvelopes, getEnvelopeBalances, saveEnvelope, deleteEnvelope };
