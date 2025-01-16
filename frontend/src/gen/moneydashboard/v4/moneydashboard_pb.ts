// @generated by protoc-gen-es v2.2.3 with parameter "target=ts"
// @generated from file moneydashboard/v4/moneydashboard.proto (package moneydashboard.v4, syntax proto3)
/* eslint-disable */

import type { GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import { fileDesc, messageDesc, serviceDesc } from "@bufbuild/protobuf/codegenv1";
import type { Message } from "@bufbuild/protobuf";

/**
 * Describes the file moneydashboard/v4/moneydashboard.proto.
 */
export const file_moneydashboard_v4_moneydashboard: GenFile = /*@__PURE__*/
  fileDesc("CiZtb25leWRhc2hib2FyZC92NC9tb25leWRhc2hib2FyZC5wcm90bxIRbW9uZXlkYXNoYm9hcmQudjQiEgoEVXNlchIKCgJpZBgBIAEoCSIXChVHZXRDdXJyZW50VXNlclJlcXVlc3QiPwoWR2V0Q3VycmVudFVzZXJSZXNwb25zZRIlCgR1c2VyGAEgASgLMhcubW9uZXlkYXNoYm9hcmQudjQuVXNlcjJyCglNRFNlcnZpY2USZQoOR2V0Q3VycmVudFVzZXISKC5tb25leWRhc2hib2FyZC52NC5HZXRDdXJyZW50VXNlclJlcXVlc3QaKS5tb25leWRhc2hib2FyZC52NC5HZXRDdXJyZW50VXNlclJlc3BvbnNlQk1aS2dpdGh1Yi5jb20vbWFya29ybWVzaGVyL21vbmV5LWRhc2hib2FyZC9pbnRlcm5hbC9nZW4vbW9uZXlkYXNoYm9hcmQvdjQ7bWR2NGIGcHJvdG8z");

/**
 * @generated from message moneydashboard.v4.User
 */
export type User = Message<"moneydashboard.v4.User"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
};

/**
 * Describes the message moneydashboard.v4.User.
 * Use `create(UserSchema)` to create a new message.
 */
export const UserSchema: GenMessage<User> = /*@__PURE__*/
  messageDesc(file_moneydashboard_v4_moneydashboard, 0);

/**
 * @generated from message moneydashboard.v4.GetCurrentUserRequest
 */
export type GetCurrentUserRequest = Message<"moneydashboard.v4.GetCurrentUserRequest"> & {
};

/**
 * Describes the message moneydashboard.v4.GetCurrentUserRequest.
 * Use `create(GetCurrentUserRequestSchema)` to create a new message.
 */
export const GetCurrentUserRequestSchema: GenMessage<GetCurrentUserRequest> = /*@__PURE__*/
  messageDesc(file_moneydashboard_v4_moneydashboard, 1);

/**
 * @generated from message moneydashboard.v4.GetCurrentUserResponse
 */
export type GetCurrentUserResponse = Message<"moneydashboard.v4.GetCurrentUserResponse"> & {
  /**
   * @generated from field: moneydashboard.v4.User user = 1;
   */
  user?: User;
};

/**
 * Describes the message moneydashboard.v4.GetCurrentUserResponse.
 * Use `create(GetCurrentUserResponseSchema)` to create a new message.
 */
export const GetCurrentUserResponseSchema: GenMessage<GetCurrentUserResponse> = /*@__PURE__*/
  messageDesc(file_moneydashboard_v4_moneydashboard, 2);

/**
 * @generated from service moneydashboard.v4.MDService
 */
export const MDService: GenService<{
  /**
   * @generated from rpc moneydashboard.v4.MDService.GetCurrentUser
   */
  getCurrentUser: {
    methodKind: "unary";
    input: typeof GetCurrentUserRequestSchema;
    output: typeof GetCurrentUserResponseSchema;
  },
}> = /*@__PURE__*/
  serviceDesc(file_moneydashboard_v4_moneydashboard, 0);

