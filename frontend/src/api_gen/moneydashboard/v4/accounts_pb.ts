// @generated by protoc-gen-es v2.2.3 with parameter "target=ts,import_extension=js"
// @generated from file moneydashboard/v4/accounts.proto (package moneydashboard.v4, syntax proto3)
/* eslint-disable */

import type { GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import { fileDesc, messageDesc, serviceDesc } from "@bufbuild/protobuf/codegenv1";
import type { Message } from "@bufbuild/protobuf";

/**
 * Describes the file moneydashboard/v4/accounts.proto.
 */
export const file_moneydashboard_v4_accounts: GenFile = /*@__PURE__*/
  fileDesc("CiBtb25leWRhc2hib2FyZC92NC9hY2NvdW50cy5wcm90bxIRbW9uZXlkYXNoYm9hcmQudjQihgEKB0FjY291bnQSCgoCaWQYASABKAkSDAoEbmFtZRgCIAEoCRINCgVub3RlcxgDIAEoCRIOCgZpc19pc2EYBCABKAgSEgoKaXNfcGVuc2lvbhgFIAEoCBIeChZleGNsdWRlX2Zyb21fZW52ZWxvcGVzGAYgASgIEg4KBmFjdGl2ZRgHIAEoCCIjChVHZXRBY2NvdW50QnlJZFJlcXVlc3QSCgoCaWQYASABKAkiRQoWR2V0QWNjb3VudEJ5SWRSZXNwb25zZRIrCgdhY2NvdW50GAEgASgLMhoubW9uZXlkYXNoYm9hcmQudjQuQWNjb3VudCIXChVHZXRBbGxBY2NvdW50c1JlcXVlc3QiRgoWR2V0QWxsQWNjb3VudHNSZXNwb25zZRIsCghhY2NvdW50cxgBIAMoCzIaLm1vbmV5ZGFzaGJvYXJkLnY0LkFjY291bnQiQwoUVXBzZXJ0QWNjb3VudFJlcXVlc3QSKwoHYWNjb3VudBgBIAEoCzIaLm1vbmV5ZGFzaGJvYXJkLnY0LkFjY291bnQiFwoVVXBzZXJ0QWNjb3VudFJlc3BvbnNlMsQCChBNREFjY291bnRTZXJ2aWNlEmUKDkdldEFjY291bnRCeUlkEigubW9uZXlkYXNoYm9hcmQudjQuR2V0QWNjb3VudEJ5SWRSZXF1ZXN0GikubW9uZXlkYXNoYm9hcmQudjQuR2V0QWNjb3VudEJ5SWRSZXNwb25zZRJlCg5HZXRBbGxBY2NvdW50cxIoLm1vbmV5ZGFzaGJvYXJkLnY0LkdldEFsbEFjY291bnRzUmVxdWVzdBopLm1vbmV5ZGFzaGJvYXJkLnY0LkdldEFsbEFjY291bnRzUmVzcG9uc2USYgoNVXBzZXJ0QWNjb3VudBInLm1vbmV5ZGFzaGJvYXJkLnY0LlVwc2VydEFjY291bnRSZXF1ZXN0GigubW9uZXlkYXNoYm9hcmQudjQuVXBzZXJ0QWNjb3VudFJlc3BvbnNlQlFaT2dpdGh1Yi5jb20vbWFya29ybWVzaGVyL21vbmV5LWRhc2hib2FyZC9pbnRlcm5hbC9hcGlfZ2VuL21vbmV5ZGFzaGJvYXJkL3Y0O21kdjRiBnByb3RvMw");

/**
 * @generated from message moneydashboard.v4.Account
 */
export type Account = Message<"moneydashboard.v4.Account"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;

  /**
   * @generated from field: string name = 2;
   */
  name: string;

  /**
   * @generated from field: string notes = 3;
   */
  notes: string;

  /**
   * @generated from field: bool is_isa = 4;
   */
  isIsa: boolean;

  /**
   * @generated from field: bool is_pension = 5;
   */
  isPension: boolean;

  /**
   * @generated from field: bool exclude_from_envelopes = 6;
   */
  excludeFromEnvelopes: boolean;

  /**
   * @generated from field: bool active = 7;
   */
  active: boolean;
};

/**
 * Describes the message moneydashboard.v4.Account.
 * Use `create(AccountSchema)` to create a new message.
 */
export const AccountSchema: GenMessage<Account> = /*@__PURE__*/
  messageDesc(file_moneydashboard_v4_accounts, 0);

/**
 * @generated from message moneydashboard.v4.GetAccountByIdRequest
 */
export type GetAccountByIdRequest = Message<"moneydashboard.v4.GetAccountByIdRequest"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
};

/**
 * Describes the message moneydashboard.v4.GetAccountByIdRequest.
 * Use `create(GetAccountByIdRequestSchema)` to create a new message.
 */
export const GetAccountByIdRequestSchema: GenMessage<GetAccountByIdRequest> = /*@__PURE__*/
  messageDesc(file_moneydashboard_v4_accounts, 1);

/**
 * @generated from message moneydashboard.v4.GetAccountByIdResponse
 */
export type GetAccountByIdResponse = Message<"moneydashboard.v4.GetAccountByIdResponse"> & {
  /**
   * @generated from field: moneydashboard.v4.Account account = 1;
   */
  account?: Account;
};

/**
 * Describes the message moneydashboard.v4.GetAccountByIdResponse.
 * Use `create(GetAccountByIdResponseSchema)` to create a new message.
 */
export const GetAccountByIdResponseSchema: GenMessage<GetAccountByIdResponse> = /*@__PURE__*/
  messageDesc(file_moneydashboard_v4_accounts, 2);

/**
 * @generated from message moneydashboard.v4.GetAllAccountsRequest
 */
export type GetAllAccountsRequest = Message<"moneydashboard.v4.GetAllAccountsRequest"> & {
};

/**
 * Describes the message moneydashboard.v4.GetAllAccountsRequest.
 * Use `create(GetAllAccountsRequestSchema)` to create a new message.
 */
export const GetAllAccountsRequestSchema: GenMessage<GetAllAccountsRequest> = /*@__PURE__*/
  messageDesc(file_moneydashboard_v4_accounts, 3);

/**
 * @generated from message moneydashboard.v4.GetAllAccountsResponse
 */
export type GetAllAccountsResponse = Message<"moneydashboard.v4.GetAllAccountsResponse"> & {
  /**
   * @generated from field: repeated moneydashboard.v4.Account accounts = 1;
   */
  accounts: Account[];
};

/**
 * Describes the message moneydashboard.v4.GetAllAccountsResponse.
 * Use `create(GetAllAccountsResponseSchema)` to create a new message.
 */
export const GetAllAccountsResponseSchema: GenMessage<GetAllAccountsResponse> = /*@__PURE__*/
  messageDesc(file_moneydashboard_v4_accounts, 4);

/**
 * @generated from message moneydashboard.v4.UpsertAccountRequest
 */
export type UpsertAccountRequest = Message<"moneydashboard.v4.UpsertAccountRequest"> & {
  /**
   * @generated from field: moneydashboard.v4.Account account = 1;
   */
  account?: Account;
};

/**
 * Describes the message moneydashboard.v4.UpsertAccountRequest.
 * Use `create(UpsertAccountRequestSchema)` to create a new message.
 */
export const UpsertAccountRequestSchema: GenMessage<UpsertAccountRequest> = /*@__PURE__*/
  messageDesc(file_moneydashboard_v4_accounts, 5);

/**
 * @generated from message moneydashboard.v4.UpsertAccountResponse
 */
export type UpsertAccountResponse = Message<"moneydashboard.v4.UpsertAccountResponse"> & {
};

/**
 * Describes the message moneydashboard.v4.UpsertAccountResponse.
 * Use `create(UpsertAccountResponseSchema)` to create a new message.
 */
export const UpsertAccountResponseSchema: GenMessage<UpsertAccountResponse> = /*@__PURE__*/
  messageDesc(file_moneydashboard_v4_accounts, 6);

/**
 * @generated from service moneydashboard.v4.MDAccountService
 */
export const MDAccountService: GenService<{
  /**
   * @generated from rpc moneydashboard.v4.MDAccountService.GetAccountById
   */
  getAccountById: {
    methodKind: "unary";
    input: typeof GetAccountByIdRequestSchema;
    output: typeof GetAccountByIdResponseSchema;
  },
  /**
   * @generated from rpc moneydashboard.v4.MDAccountService.GetAllAccounts
   */
  getAllAccounts: {
    methodKind: "unary";
    input: typeof GetAllAccountsRequestSchema;
    output: typeof GetAllAccountsResponseSchema;
  },
  /**
   * @generated from rpc moneydashboard.v4.MDAccountService.UpsertAccount
   */
  upsertAccount: {
    methodKind: "unary";
    input: typeof UpsertAccountRequestSchema;
    output: typeof UpsertAccountResponseSchema;
  },
}> = /*@__PURE__*/
  serviceDesc(file_moneydashboard_v4_accounts, 0);

