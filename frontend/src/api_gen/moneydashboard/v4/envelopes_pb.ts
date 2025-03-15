// @generated by protoc-gen-es v2.2.3 with parameter "target=ts,import_extension=js"
// @generated from file moneydashboard/v4/envelopes.proto (package moneydashboard.v4, syntax proto3)
/* eslint-disable */

import type { GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import { fileDesc, messageDesc, serviceDesc } from "@bufbuild/protobuf/codegenv1";
import type { Message } from "@bufbuild/protobuf";

/**
 * Describes the file moneydashboard/v4/envelopes.proto.
 */
export const file_moneydashboard_v4_envelopes: GenFile = /*@__PURE__*/
  fileDesc("CiFtb25leWRhc2hib2FyZC92NC9lbnZlbG9wZXMucHJvdG8SEW1vbmV5ZGFzaGJvYXJkLnY0IjQKCEVudmVsb3BlEgoKAmlkGAEgASgJEgwKBG5hbWUYAiABKAkSDgoGYWN0aXZlGAMgASgIIiQKFkdldEVudmVsb3BlQnlJZFJlcXVlc3QSCgoCaWQYASABKAkiSAoXR2V0RW52ZWxvcGVCeUlkUmVzcG9uc2USLQoIZW52ZWxvcGUYASABKAsyGy5tb25leWRhc2hib2FyZC52NC5FbnZlbG9wZSIYChZHZXRBbGxFbnZlbG9wZXNSZXF1ZXN0IkkKF0dldEFsbEVudmVsb3Blc1Jlc3BvbnNlEi4KCWVudmVsb3BlcxgBIAMoCzIbLm1vbmV5ZGFzaGJvYXJkLnY0LkVudmVsb3BlIkYKFVVwc2VydEVudmVsb3BlUmVxdWVzdBItCghlbnZlbG9wZRgBIAEoCzIbLm1vbmV5ZGFzaGJvYXJkLnY0LkVudmVsb3BlIhgKFlVwc2VydEVudmVsb3BlUmVzcG9uc2UyzgIKEU1ERW52ZWxvcGVTZXJ2aWNlEmgKD0dldEVudmVsb3BlQnlJZBIpLm1vbmV5ZGFzaGJvYXJkLnY0LkdldEVudmVsb3BlQnlJZFJlcXVlc3QaKi5tb25leWRhc2hib2FyZC52NC5HZXRFbnZlbG9wZUJ5SWRSZXNwb25zZRJoCg9HZXRBbGxFbnZlbG9wZXMSKS5tb25leWRhc2hib2FyZC52NC5HZXRBbGxFbnZlbG9wZXNSZXF1ZXN0GioubW9uZXlkYXNoYm9hcmQudjQuR2V0QWxsRW52ZWxvcGVzUmVzcG9uc2USZQoOVXBzZXJ0RW52ZWxvcGUSKC5tb25leWRhc2hib2FyZC52NC5VcHNlcnRFbnZlbG9wZVJlcXVlc3QaKS5tb25leWRhc2hib2FyZC52NC5VcHNlcnRFbnZlbG9wZVJlc3BvbnNlQlFaT2dpdGh1Yi5jb20vbWFya29ybWVzaGVyL21vbmV5LWRhc2hib2FyZC9pbnRlcm5hbC9hcGlfZ2VuL21vbmV5ZGFzaGJvYXJkL3Y0O21kdjRiBnByb3RvMw");

/**
 * @generated from message moneydashboard.v4.Envelope
 */
export type Envelope = Message<"moneydashboard.v4.Envelope"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;

  /**
   * @generated from field: string name = 2;
   */
  name: string;

  /**
   * @generated from field: bool active = 3;
   */
  active: boolean;
};

/**
 * Describes the message moneydashboard.v4.Envelope.
 * Use `create(EnvelopeSchema)` to create a new message.
 */
export const EnvelopeSchema: GenMessage<Envelope> = /*@__PURE__*/
  messageDesc(file_moneydashboard_v4_envelopes, 0);

/**
 * @generated from message moneydashboard.v4.GetEnvelopeByIdRequest
 */
export type GetEnvelopeByIdRequest = Message<"moneydashboard.v4.GetEnvelopeByIdRequest"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
};

/**
 * Describes the message moneydashboard.v4.GetEnvelopeByIdRequest.
 * Use `create(GetEnvelopeByIdRequestSchema)` to create a new message.
 */
export const GetEnvelopeByIdRequestSchema: GenMessage<GetEnvelopeByIdRequest> = /*@__PURE__*/
  messageDesc(file_moneydashboard_v4_envelopes, 1);

/**
 * @generated from message moneydashboard.v4.GetEnvelopeByIdResponse
 */
export type GetEnvelopeByIdResponse = Message<"moneydashboard.v4.GetEnvelopeByIdResponse"> & {
  /**
   * @generated from field: moneydashboard.v4.Envelope envelope = 1;
   */
  envelope?: Envelope;
};

/**
 * Describes the message moneydashboard.v4.GetEnvelopeByIdResponse.
 * Use `create(GetEnvelopeByIdResponseSchema)` to create a new message.
 */
export const GetEnvelopeByIdResponseSchema: GenMessage<GetEnvelopeByIdResponse> = /*@__PURE__*/
  messageDesc(file_moneydashboard_v4_envelopes, 2);

/**
 * @generated from message moneydashboard.v4.GetAllEnvelopesRequest
 */
export type GetAllEnvelopesRequest = Message<"moneydashboard.v4.GetAllEnvelopesRequest"> & {
};

/**
 * Describes the message moneydashboard.v4.GetAllEnvelopesRequest.
 * Use `create(GetAllEnvelopesRequestSchema)` to create a new message.
 */
export const GetAllEnvelopesRequestSchema: GenMessage<GetAllEnvelopesRequest> = /*@__PURE__*/
  messageDesc(file_moneydashboard_v4_envelopes, 3);

/**
 * @generated from message moneydashboard.v4.GetAllEnvelopesResponse
 */
export type GetAllEnvelopesResponse = Message<"moneydashboard.v4.GetAllEnvelopesResponse"> & {
  /**
   * @generated from field: repeated moneydashboard.v4.Envelope envelopes = 1;
   */
  envelopes: Envelope[];
};

/**
 * Describes the message moneydashboard.v4.GetAllEnvelopesResponse.
 * Use `create(GetAllEnvelopesResponseSchema)` to create a new message.
 */
export const GetAllEnvelopesResponseSchema: GenMessage<GetAllEnvelopesResponse> = /*@__PURE__*/
  messageDesc(file_moneydashboard_v4_envelopes, 4);

/**
 * @generated from message moneydashboard.v4.UpsertEnvelopeRequest
 */
export type UpsertEnvelopeRequest = Message<"moneydashboard.v4.UpsertEnvelopeRequest"> & {
  /**
   * @generated from field: moneydashboard.v4.Envelope envelope = 1;
   */
  envelope?: Envelope;
};

/**
 * Describes the message moneydashboard.v4.UpsertEnvelopeRequest.
 * Use `create(UpsertEnvelopeRequestSchema)` to create a new message.
 */
export const UpsertEnvelopeRequestSchema: GenMessage<UpsertEnvelopeRequest> = /*@__PURE__*/
  messageDesc(file_moneydashboard_v4_envelopes, 5);

/**
 * @generated from message moneydashboard.v4.UpsertEnvelopeResponse
 */
export type UpsertEnvelopeResponse = Message<"moneydashboard.v4.UpsertEnvelopeResponse"> & {
};

/**
 * Describes the message moneydashboard.v4.UpsertEnvelopeResponse.
 * Use `create(UpsertEnvelopeResponseSchema)` to create a new message.
 */
export const UpsertEnvelopeResponseSchema: GenMessage<UpsertEnvelopeResponse> = /*@__PURE__*/
  messageDesc(file_moneydashboard_v4_envelopes, 6);

/**
 * @generated from service moneydashboard.v4.MDEnvelopeService
 */
export const MDEnvelopeService: GenService<{
  /**
   * @generated from rpc moneydashboard.v4.MDEnvelopeService.GetEnvelopeById
   */
  getEnvelopeById: {
    methodKind: "unary";
    input: typeof GetEnvelopeByIdRequestSchema;
    output: typeof GetEnvelopeByIdResponseSchema;
  },
  /**
   * @generated from rpc moneydashboard.v4.MDEnvelopeService.GetAllEnvelopes
   */
  getAllEnvelopes: {
    methodKind: "unary";
    input: typeof GetAllEnvelopesRequestSchema;
    output: typeof GetAllEnvelopesResponseSchema;
  },
  /**
   * @generated from rpc moneydashboard.v4.MDEnvelopeService.UpsertEnvelope
   */
  upsertEnvelope: {
    methodKind: "unary";
    input: typeof UpsertEnvelopeRequestSchema;
    output: typeof UpsertEnvelopeResponseSchema;
  },
}> = /*@__PURE__*/
  serviceDesc(file_moneydashboard_v4_envelopes, 0);

