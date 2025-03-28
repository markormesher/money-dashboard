// @generated by protoc-gen-es v2.2.3 with parameter "target=ts,import_extension=js"
// @generated from file moneydashboard/v4/transactions.proto (package moneydashboard.v4, syntax proto3)
/* eslint-disable */

import type { GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import { fileDesc, messageDesc, serviceDesc } from "@bufbuild/protobuf/codegenv1";
import type { Category } from "./categories_pb.js";
import { file_moneydashboard_v4_categories } from "./categories_pb.js";
import type { Holding } from "./holdings_pb.js";
import { file_moneydashboard_v4_holdings } from "./holdings_pb.js";
import type { Message } from "@bufbuild/protobuf";

/**
 * Describes the file moneydashboard/v4/transactions.proto.
 */
export const file_moneydashboard_v4_transactions: GenFile = /*@__PURE__*/
  fileDesc("CiRtb25leWRhc2hib2FyZC92NC90cmFuc2FjdGlvbnMucHJvdG8SEW1vbmV5ZGFzaGJvYXJkLnY0IoICCgtUcmFuc2FjdGlvbhIKCgJpZBgBIAEoCRIMCgRkYXRlGAIgASgDEhMKC2J1ZGdldF9kYXRlGAMgASgDEhUKDWNyZWF0aW9uX2RhdGUYBCABKAMSDQoFcGF5ZWUYBSABKAkSDQoFbm90ZXMYBiABKAkSDgoGYW1vdW50GAcgASgBEhIKCnVuaXRfdmFsdWUYCCABKAESDwoHZGVsZXRlZBgJIAEoCBIrCgdob2xkaW5nGAogASgLMhoubW9uZXlkYXNoYm9hcmQudjQuSG9sZGluZxItCghjYXRlZ29yeRgLIAEoCzIbLm1vbmV5ZGFzaGJvYXJkLnY0LkNhdGVnb3J5IicKGUdldFRyYW5zYWN0aW9uQnlJZFJlcXVlc3QSCgoCaWQYASABKAkiUQoaR2V0VHJhbnNhY3Rpb25CeUlkUmVzcG9uc2USMwoLdHJhbnNhY3Rpb24YASABKAsyHi5tb25leWRhc2hib2FyZC52NC5UcmFuc2FjdGlvbiJTChlHZXRUcmFuc2FjdGlvblBhZ2VSZXF1ZXN0EgwKBHBhZ2UYASABKAUSEAoIcGVyX3BhZ2UYAiABKAUSFgoOc2VhcmNoX3BhdHRlcm4YAyABKAkifgoaR2V0VHJhbnNhY3Rpb25QYWdlUmVzcG9uc2USDQoFdG90YWwYASABKAUSFgoOZmlsdGVyZWRfdG90YWwYAiABKAUSOQoRZmlsdGVyZWRfZW50aXRpZXMYAyADKAsyHi5tb25leWRhc2hib2FyZC52NC5UcmFuc2FjdGlvbiJPChhVcHNlcnRUcmFuc2FjdGlvblJlcXVlc3QSMwoLdHJhbnNhY3Rpb24YASABKAsyHi5tb25leWRhc2hib2FyZC52NC5UcmFuc2FjdGlvbiIbChlVcHNlcnRUcmFuc2FjdGlvblJlc3BvbnNlIiYKGERlbGV0ZVRyYW5zYWN0aW9uUmVxdWVzdBIKCgJpZBgBIAEoCSIbChlEZWxldGVUcmFuc2FjdGlvblJlc3BvbnNlIhIKEEdldFBheWVlc1JlcXVlc3QiIwoRR2V0UGF5ZWVzUmVzcG9uc2USDgoGcGF5ZWVzGAEgAygJMrQEChRNRFRyYW5zYWN0aW9uU2VydmljZRJxChJHZXRUcmFuc2FjdGlvbkJ5SWQSLC5tb25leWRhc2hib2FyZC52NC5HZXRUcmFuc2FjdGlvbkJ5SWRSZXF1ZXN0Gi0ubW9uZXlkYXNoYm9hcmQudjQuR2V0VHJhbnNhY3Rpb25CeUlkUmVzcG9uc2UScQoSR2V0VHJhbnNhY3Rpb25QYWdlEiwubW9uZXlkYXNoYm9hcmQudjQuR2V0VHJhbnNhY3Rpb25QYWdlUmVxdWVzdBotLm1vbmV5ZGFzaGJvYXJkLnY0LkdldFRyYW5zYWN0aW9uUGFnZVJlc3BvbnNlEm4KEVVwc2VydFRyYW5zYWN0aW9uEisubW9uZXlkYXNoYm9hcmQudjQuVXBzZXJ0VHJhbnNhY3Rpb25SZXF1ZXN0GiwubW9uZXlkYXNoYm9hcmQudjQuVXBzZXJ0VHJhbnNhY3Rpb25SZXNwb25zZRJuChFEZWxldGVUcmFuc2FjdGlvbhIrLm1vbmV5ZGFzaGJvYXJkLnY0LkRlbGV0ZVRyYW5zYWN0aW9uUmVxdWVzdBosLm1vbmV5ZGFzaGJvYXJkLnY0LkRlbGV0ZVRyYW5zYWN0aW9uUmVzcG9uc2USVgoJR2V0UGF5ZWVzEiMubW9uZXlkYXNoYm9hcmQudjQuR2V0UGF5ZWVzUmVxdWVzdBokLm1vbmV5ZGFzaGJvYXJkLnY0LkdldFBheWVlc1Jlc3BvbnNlQlFaT2dpdGh1Yi5jb20vbWFya29ybWVzaGVyL21vbmV5LWRhc2hib2FyZC9pbnRlcm5hbC9hcGlfZ2VuL21vbmV5ZGFzaGJvYXJkL3Y0O21kdjRiBnByb3RvMw", [file_moneydashboard_v4_categories, file_moneydashboard_v4_holdings]);

/**
 * @generated from message moneydashboard.v4.Transaction
 */
export type Transaction = Message<"moneydashboard.v4.Transaction"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;

  /**
   * @generated from field: int64 date = 2;
   */
  date: bigint;

  /**
   * @generated from field: int64 budget_date = 3;
   */
  budgetDate: bigint;

  /**
   * @generated from field: int64 creation_date = 4;
   */
  creationDate: bigint;

  /**
   * @generated from field: string payee = 5;
   */
  payee: string;

  /**
   * @generated from field: string notes = 6;
   */
  notes: string;

  /**
   * @generated from field: double amount = 7;
   */
  amount: number;

  /**
   * @generated from field: double unit_value = 8;
   */
  unitValue: number;

  /**
   * @generated from field: bool deleted = 9;
   */
  deleted: boolean;

  /**
   * @generated from field: moneydashboard.v4.Holding holding = 10;
   */
  holding?: Holding;

  /**
   * @generated from field: moneydashboard.v4.Category category = 11;
   */
  category?: Category;
};

/**
 * Describes the message moneydashboard.v4.Transaction.
 * Use `create(TransactionSchema)` to create a new message.
 */
export const TransactionSchema: GenMessage<Transaction> = /*@__PURE__*/
  messageDesc(file_moneydashboard_v4_transactions, 0);

/**
 * @generated from message moneydashboard.v4.GetTransactionByIdRequest
 */
export type GetTransactionByIdRequest = Message<"moneydashboard.v4.GetTransactionByIdRequest"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
};

/**
 * Describes the message moneydashboard.v4.GetTransactionByIdRequest.
 * Use `create(GetTransactionByIdRequestSchema)` to create a new message.
 */
export const GetTransactionByIdRequestSchema: GenMessage<GetTransactionByIdRequest> = /*@__PURE__*/
  messageDesc(file_moneydashboard_v4_transactions, 1);

/**
 * @generated from message moneydashboard.v4.GetTransactionByIdResponse
 */
export type GetTransactionByIdResponse = Message<"moneydashboard.v4.GetTransactionByIdResponse"> & {
  /**
   * @generated from field: moneydashboard.v4.Transaction transaction = 1;
   */
  transaction?: Transaction;
};

/**
 * Describes the message moneydashboard.v4.GetTransactionByIdResponse.
 * Use `create(GetTransactionByIdResponseSchema)` to create a new message.
 */
export const GetTransactionByIdResponseSchema: GenMessage<GetTransactionByIdResponse> = /*@__PURE__*/
  messageDesc(file_moneydashboard_v4_transactions, 2);

/**
 * @generated from message moneydashboard.v4.GetTransactionPageRequest
 */
export type GetTransactionPageRequest = Message<"moneydashboard.v4.GetTransactionPageRequest"> & {
  /**
   * @generated from field: int32 page = 1;
   */
  page: number;

  /**
   * @generated from field: int32 per_page = 2;
   */
  perPage: number;

  /**
   * @generated from field: string search_pattern = 3;
   */
  searchPattern: string;
};

/**
 * Describes the message moneydashboard.v4.GetTransactionPageRequest.
 * Use `create(GetTransactionPageRequestSchema)` to create a new message.
 */
export const GetTransactionPageRequestSchema: GenMessage<GetTransactionPageRequest> = /*@__PURE__*/
  messageDesc(file_moneydashboard_v4_transactions, 3);

/**
 * @generated from message moneydashboard.v4.GetTransactionPageResponse
 */
export type GetTransactionPageResponse = Message<"moneydashboard.v4.GetTransactionPageResponse"> & {
  /**
   * @generated from field: int32 total = 1;
   */
  total: number;

  /**
   * @generated from field: int32 filtered_total = 2;
   */
  filteredTotal: number;

  /**
   * @generated from field: repeated moneydashboard.v4.Transaction filtered_entities = 3;
   */
  filteredEntities: Transaction[];
};

/**
 * Describes the message moneydashboard.v4.GetTransactionPageResponse.
 * Use `create(GetTransactionPageResponseSchema)` to create a new message.
 */
export const GetTransactionPageResponseSchema: GenMessage<GetTransactionPageResponse> = /*@__PURE__*/
  messageDesc(file_moneydashboard_v4_transactions, 4);

/**
 * @generated from message moneydashboard.v4.UpsertTransactionRequest
 */
export type UpsertTransactionRequest = Message<"moneydashboard.v4.UpsertTransactionRequest"> & {
  /**
   * @generated from field: moneydashboard.v4.Transaction transaction = 1;
   */
  transaction?: Transaction;
};

/**
 * Describes the message moneydashboard.v4.UpsertTransactionRequest.
 * Use `create(UpsertTransactionRequestSchema)` to create a new message.
 */
export const UpsertTransactionRequestSchema: GenMessage<UpsertTransactionRequest> = /*@__PURE__*/
  messageDesc(file_moneydashboard_v4_transactions, 5);

/**
 * @generated from message moneydashboard.v4.UpsertTransactionResponse
 */
export type UpsertTransactionResponse = Message<"moneydashboard.v4.UpsertTransactionResponse"> & {
};

/**
 * Describes the message moneydashboard.v4.UpsertTransactionResponse.
 * Use `create(UpsertTransactionResponseSchema)` to create a new message.
 */
export const UpsertTransactionResponseSchema: GenMessage<UpsertTransactionResponse> = /*@__PURE__*/
  messageDesc(file_moneydashboard_v4_transactions, 6);

/**
 * @generated from message moneydashboard.v4.DeleteTransactionRequest
 */
export type DeleteTransactionRequest = Message<"moneydashboard.v4.DeleteTransactionRequest"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
};

/**
 * Describes the message moneydashboard.v4.DeleteTransactionRequest.
 * Use `create(DeleteTransactionRequestSchema)` to create a new message.
 */
export const DeleteTransactionRequestSchema: GenMessage<DeleteTransactionRequest> = /*@__PURE__*/
  messageDesc(file_moneydashboard_v4_transactions, 7);

/**
 * @generated from message moneydashboard.v4.DeleteTransactionResponse
 */
export type DeleteTransactionResponse = Message<"moneydashboard.v4.DeleteTransactionResponse"> & {
};

/**
 * Describes the message moneydashboard.v4.DeleteTransactionResponse.
 * Use `create(DeleteTransactionResponseSchema)` to create a new message.
 */
export const DeleteTransactionResponseSchema: GenMessage<DeleteTransactionResponse> = /*@__PURE__*/
  messageDesc(file_moneydashboard_v4_transactions, 8);

/**
 * @generated from message moneydashboard.v4.GetPayeesRequest
 */
export type GetPayeesRequest = Message<"moneydashboard.v4.GetPayeesRequest"> & {
};

/**
 * Describes the message moneydashboard.v4.GetPayeesRequest.
 * Use `create(GetPayeesRequestSchema)` to create a new message.
 */
export const GetPayeesRequestSchema: GenMessage<GetPayeesRequest> = /*@__PURE__*/
  messageDesc(file_moneydashboard_v4_transactions, 9);

/**
 * @generated from message moneydashboard.v4.GetPayeesResponse
 */
export type GetPayeesResponse = Message<"moneydashboard.v4.GetPayeesResponse"> & {
  /**
   * @generated from field: repeated string payees = 1;
   */
  payees: string[];
};

/**
 * Describes the message moneydashboard.v4.GetPayeesResponse.
 * Use `create(GetPayeesResponseSchema)` to create a new message.
 */
export const GetPayeesResponseSchema: GenMessage<GetPayeesResponse> = /*@__PURE__*/
  messageDesc(file_moneydashboard_v4_transactions, 10);

/**
 * @generated from service moneydashboard.v4.MDTransactionService
 */
export const MDTransactionService: GenService<{
  /**
   * @generated from rpc moneydashboard.v4.MDTransactionService.GetTransactionById
   */
  getTransactionById: {
    methodKind: "unary";
    input: typeof GetTransactionByIdRequestSchema;
    output: typeof GetTransactionByIdResponseSchema;
  },
  /**
   * @generated from rpc moneydashboard.v4.MDTransactionService.GetTransactionPage
   */
  getTransactionPage: {
    methodKind: "unary";
    input: typeof GetTransactionPageRequestSchema;
    output: typeof GetTransactionPageResponseSchema;
  },
  /**
   * @generated from rpc moneydashboard.v4.MDTransactionService.UpsertTransaction
   */
  upsertTransaction: {
    methodKind: "unary";
    input: typeof UpsertTransactionRequestSchema;
    output: typeof UpsertTransactionResponseSchema;
  },
  /**
   * @generated from rpc moneydashboard.v4.MDTransactionService.DeleteTransaction
   */
  deleteTransaction: {
    methodKind: "unary";
    input: typeof DeleteTransactionRequestSchema;
    output: typeof DeleteTransactionResponseSchema;
  },
  /**
   * @generated from rpc moneydashboard.v4.MDTransactionService.GetPayees
   */
  getPayees: {
    methodKind: "unary";
    input: typeof GetPayeesRequestSchema;
    output: typeof GetPayeesResponseSchema;
  },
}> = /*@__PURE__*/
  serviceDesc(file_moneydashboard_v4_transactions, 0);

