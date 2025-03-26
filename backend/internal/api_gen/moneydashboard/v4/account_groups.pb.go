// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.36.3
// 	protoc        (unknown)
// source: moneydashboard/v4/account_groups.proto

package mdv4

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

type AccountGroup struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Id            string                 `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	Name          string                 `protobuf:"bytes,2,opt,name=name,proto3" json:"name,omitempty"`
	DisplayOrder  int32                  `protobuf:"varint,3,opt,name=display_order,json=displayOrder,proto3" json:"display_order,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *AccountGroup) Reset() {
	*x = AccountGroup{}
	mi := &file_moneydashboard_v4_account_groups_proto_msgTypes[0]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *AccountGroup) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*AccountGroup) ProtoMessage() {}

func (x *AccountGroup) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_account_groups_proto_msgTypes[0]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use AccountGroup.ProtoReflect.Descriptor instead.
func (*AccountGroup) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_account_groups_proto_rawDescGZIP(), []int{0}
}

func (x *AccountGroup) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

func (x *AccountGroup) GetName() string {
	if x != nil {
		return x.Name
	}
	return ""
}

func (x *AccountGroup) GetDisplayOrder() int32 {
	if x != nil {
		return x.DisplayOrder
	}
	return 0
}

type GetAccountGroupByIdRequest struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Id            string                 `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *GetAccountGroupByIdRequest) Reset() {
	*x = GetAccountGroupByIdRequest{}
	mi := &file_moneydashboard_v4_account_groups_proto_msgTypes[1]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *GetAccountGroupByIdRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetAccountGroupByIdRequest) ProtoMessage() {}

func (x *GetAccountGroupByIdRequest) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_account_groups_proto_msgTypes[1]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetAccountGroupByIdRequest.ProtoReflect.Descriptor instead.
func (*GetAccountGroupByIdRequest) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_account_groups_proto_rawDescGZIP(), []int{1}
}

func (x *GetAccountGroupByIdRequest) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

type GetAccountGroupByIdResponse struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	AccountGroup  *AccountGroup          `protobuf:"bytes,1,opt,name=account_group,json=accountGroup,proto3" json:"account_group,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *GetAccountGroupByIdResponse) Reset() {
	*x = GetAccountGroupByIdResponse{}
	mi := &file_moneydashboard_v4_account_groups_proto_msgTypes[2]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *GetAccountGroupByIdResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetAccountGroupByIdResponse) ProtoMessage() {}

func (x *GetAccountGroupByIdResponse) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_account_groups_proto_msgTypes[2]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetAccountGroupByIdResponse.ProtoReflect.Descriptor instead.
func (*GetAccountGroupByIdResponse) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_account_groups_proto_rawDescGZIP(), []int{2}
}

func (x *GetAccountGroupByIdResponse) GetAccountGroup() *AccountGroup {
	if x != nil {
		return x.AccountGroup
	}
	return nil
}

type GetAllAccountGroupsRequest struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *GetAllAccountGroupsRequest) Reset() {
	*x = GetAllAccountGroupsRequest{}
	mi := &file_moneydashboard_v4_account_groups_proto_msgTypes[3]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *GetAllAccountGroupsRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetAllAccountGroupsRequest) ProtoMessage() {}

func (x *GetAllAccountGroupsRequest) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_account_groups_proto_msgTypes[3]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetAllAccountGroupsRequest.ProtoReflect.Descriptor instead.
func (*GetAllAccountGroupsRequest) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_account_groups_proto_rawDescGZIP(), []int{3}
}

type GetAllAccountGroupsResponse struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	AccountGroups []*AccountGroup        `protobuf:"bytes,1,rep,name=account_groups,json=accountGroups,proto3" json:"account_groups,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *GetAllAccountGroupsResponse) Reset() {
	*x = GetAllAccountGroupsResponse{}
	mi := &file_moneydashboard_v4_account_groups_proto_msgTypes[4]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *GetAllAccountGroupsResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetAllAccountGroupsResponse) ProtoMessage() {}

func (x *GetAllAccountGroupsResponse) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_account_groups_proto_msgTypes[4]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetAllAccountGroupsResponse.ProtoReflect.Descriptor instead.
func (*GetAllAccountGroupsResponse) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_account_groups_proto_rawDescGZIP(), []int{4}
}

func (x *GetAllAccountGroupsResponse) GetAccountGroups() []*AccountGroup {
	if x != nil {
		return x.AccountGroups
	}
	return nil
}

type UpsertAccountGroupRequest struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	AccountGroup  *AccountGroup          `protobuf:"bytes,1,opt,name=account_group,json=accountGroup,proto3" json:"account_group,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *UpsertAccountGroupRequest) Reset() {
	*x = UpsertAccountGroupRequest{}
	mi := &file_moneydashboard_v4_account_groups_proto_msgTypes[5]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *UpsertAccountGroupRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*UpsertAccountGroupRequest) ProtoMessage() {}

func (x *UpsertAccountGroupRequest) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_account_groups_proto_msgTypes[5]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use UpsertAccountGroupRequest.ProtoReflect.Descriptor instead.
func (*UpsertAccountGroupRequest) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_account_groups_proto_rawDescGZIP(), []int{5}
}

func (x *UpsertAccountGroupRequest) GetAccountGroup() *AccountGroup {
	if x != nil {
		return x.AccountGroup
	}
	return nil
}

type UpsertAccountGroupResponse struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *UpsertAccountGroupResponse) Reset() {
	*x = UpsertAccountGroupResponse{}
	mi := &file_moneydashboard_v4_account_groups_proto_msgTypes[6]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *UpsertAccountGroupResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*UpsertAccountGroupResponse) ProtoMessage() {}

func (x *UpsertAccountGroupResponse) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_account_groups_proto_msgTypes[6]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use UpsertAccountGroupResponse.ProtoReflect.Descriptor instead.
func (*UpsertAccountGroupResponse) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_account_groups_proto_rawDescGZIP(), []int{6}
}

var File_moneydashboard_v4_account_groups_proto protoreflect.FileDescriptor

var file_moneydashboard_v4_account_groups_proto_rawDesc = []byte{
	0x0a, 0x26, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64,
	0x2f, 0x76, 0x34, 0x2f, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x5f, 0x67, 0x72, 0x6f, 0x75,
	0x70, 0x73, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x11, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64,
	0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x22, 0x57, 0x0a, 0x0c, 0x41,
	0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x47, 0x72, 0x6f, 0x75, 0x70, 0x12, 0x0e, 0x0a, 0x02, 0x69,
	0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x02, 0x69, 0x64, 0x12, 0x12, 0x0a, 0x04, 0x6e,
	0x61, 0x6d, 0x65, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x04, 0x6e, 0x61, 0x6d, 0x65, 0x12,
	0x23, 0x0a, 0x0d, 0x64, 0x69, 0x73, 0x70, 0x6c, 0x61, 0x79, 0x5f, 0x6f, 0x72, 0x64, 0x65, 0x72,
	0x18, 0x03, 0x20, 0x01, 0x28, 0x05, 0x52, 0x0c, 0x64, 0x69, 0x73, 0x70, 0x6c, 0x61, 0x79, 0x4f,
	0x72, 0x64, 0x65, 0x72, 0x22, 0x2c, 0x0a, 0x1a, 0x47, 0x65, 0x74, 0x41, 0x63, 0x63, 0x6f, 0x75,
	0x6e, 0x74, 0x47, 0x72, 0x6f, 0x75, 0x70, 0x42, 0x79, 0x49, 0x64, 0x52, 0x65, 0x71, 0x75, 0x65,
	0x73, 0x74, 0x12, 0x0e, 0x0a, 0x02, 0x69, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x02,
	0x69, 0x64, 0x22, 0x63, 0x0a, 0x1b, 0x47, 0x65, 0x74, 0x41, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74,
	0x47, 0x72, 0x6f, 0x75, 0x70, 0x42, 0x79, 0x49, 0x64, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73,
	0x65, 0x12, 0x44, 0x0a, 0x0d, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x5f, 0x67, 0x72, 0x6f,
	0x75, 0x70, 0x18, 0x01, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x1f, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79,
	0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x41, 0x63, 0x63,
	0x6f, 0x75, 0x6e, 0x74, 0x47, 0x72, 0x6f, 0x75, 0x70, 0x52, 0x0c, 0x61, 0x63, 0x63, 0x6f, 0x75,
	0x6e, 0x74, 0x47, 0x72, 0x6f, 0x75, 0x70, 0x22, 0x1c, 0x0a, 0x1a, 0x47, 0x65, 0x74, 0x41, 0x6c,
	0x6c, 0x41, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x47, 0x72, 0x6f, 0x75, 0x70, 0x73, 0x52, 0x65,
	0x71, 0x75, 0x65, 0x73, 0x74, 0x22, 0x65, 0x0a, 0x1b, 0x47, 0x65, 0x74, 0x41, 0x6c, 0x6c, 0x41,
	0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x47, 0x72, 0x6f, 0x75, 0x70, 0x73, 0x52, 0x65, 0x73, 0x70,
	0x6f, 0x6e, 0x73, 0x65, 0x12, 0x46, 0x0a, 0x0e, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x5f,
	0x67, 0x72, 0x6f, 0x75, 0x70, 0x73, 0x18, 0x01, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x1f, 0x2e, 0x6d,
	0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76, 0x34,
	0x2e, 0x41, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x47, 0x72, 0x6f, 0x75, 0x70, 0x52, 0x0d, 0x61,
	0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x47, 0x72, 0x6f, 0x75, 0x70, 0x73, 0x22, 0x61, 0x0a, 0x19,
	0x55, 0x70, 0x73, 0x65, 0x72, 0x74, 0x41, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x47, 0x72, 0x6f,
	0x75, 0x70, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x12, 0x44, 0x0a, 0x0d, 0x61, 0x63, 0x63,
	0x6f, 0x75, 0x6e, 0x74, 0x5f, 0x67, 0x72, 0x6f, 0x75, 0x70, 0x18, 0x01, 0x20, 0x01, 0x28, 0x0b,
	0x32, 0x1f, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72,
	0x64, 0x2e, 0x76, 0x34, 0x2e, 0x41, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x47, 0x72, 0x6f, 0x75,
	0x70, 0x52, 0x0c, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x47, 0x72, 0x6f, 0x75, 0x70, 0x22,
	0x1c, 0x0a, 0x1a, 0x55, 0x70, 0x73, 0x65, 0x72, 0x74, 0x41, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74,
	0x47, 0x72, 0x6f, 0x75, 0x70, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x32, 0xf6, 0x02,
	0x0a, 0x15, 0x4d, 0x44, 0x41, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x47, 0x72, 0x6f, 0x75, 0x70,
	0x53, 0x65, 0x72, 0x76, 0x69, 0x63, 0x65, 0x12, 0x74, 0x0a, 0x13, 0x47, 0x65, 0x74, 0x41, 0x63,
	0x63, 0x6f, 0x75, 0x6e, 0x74, 0x47, 0x72, 0x6f, 0x75, 0x70, 0x42, 0x79, 0x49, 0x64, 0x12, 0x2d,
	0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e,
	0x76, 0x34, 0x2e, 0x47, 0x65, 0x74, 0x41, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x47, 0x72, 0x6f,
	0x75, 0x70, 0x42, 0x79, 0x49, 0x64, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x2e, 0x2e,
	0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76,
	0x34, 0x2e, 0x47, 0x65, 0x74, 0x41, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x47, 0x72, 0x6f, 0x75,
	0x70, 0x42, 0x79, 0x49, 0x64, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x74, 0x0a,
	0x13, 0x47, 0x65, 0x74, 0x41, 0x6c, 0x6c, 0x41, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x47, 0x72,
	0x6f, 0x75, 0x70, 0x73, 0x12, 0x2d, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68,
	0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x47, 0x65, 0x74, 0x41, 0x6c, 0x6c, 0x41,
	0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x47, 0x72, 0x6f, 0x75, 0x70, 0x73, 0x52, 0x65, 0x71, 0x75,
	0x65, 0x73, 0x74, 0x1a, 0x2e, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62,
	0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x47, 0x65, 0x74, 0x41, 0x6c, 0x6c, 0x41, 0x63,
	0x63, 0x6f, 0x75, 0x6e, 0x74, 0x47, 0x72, 0x6f, 0x75, 0x70, 0x73, 0x52, 0x65, 0x73, 0x70, 0x6f,
	0x6e, 0x73, 0x65, 0x12, 0x71, 0x0a, 0x12, 0x55, 0x70, 0x73, 0x65, 0x72, 0x74, 0x41, 0x63, 0x63,
	0x6f, 0x75, 0x6e, 0x74, 0x47, 0x72, 0x6f, 0x75, 0x70, 0x12, 0x2c, 0x2e, 0x6d, 0x6f, 0x6e, 0x65,
	0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x55, 0x70,
	0x73, 0x65, 0x72, 0x74, 0x41, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x47, 0x72, 0x6f, 0x75, 0x70,
	0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x2d, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64,
	0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x55, 0x70, 0x73, 0x65,
	0x72, 0x74, 0x41, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x47, 0x72, 0x6f, 0x75, 0x70, 0x52, 0x65,
	0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x42, 0x51, 0x5a, 0x4f, 0x67, 0x69, 0x74, 0x68, 0x75, 0x62,
	0x2e, 0x63, 0x6f, 0x6d, 0x2f, 0x6d, 0x61, 0x72, 0x6b, 0x6f, 0x72, 0x6d, 0x65, 0x73, 0x68, 0x65,
	0x72, 0x2f, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x2d, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72,
	0x64, 0x2f, 0x69, 0x6e, 0x74, 0x65, 0x72, 0x6e, 0x61, 0x6c, 0x2f, 0x61, 0x70, 0x69, 0x5f, 0x67,
	0x65, 0x6e, 0x2f, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72,
	0x64, 0x2f, 0x76, 0x34, 0x3b, 0x6d, 0x64, 0x76, 0x34, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f,
	0x33,
}

var (
	file_moneydashboard_v4_account_groups_proto_rawDescOnce sync.Once
	file_moneydashboard_v4_account_groups_proto_rawDescData = file_moneydashboard_v4_account_groups_proto_rawDesc
)

func file_moneydashboard_v4_account_groups_proto_rawDescGZIP() []byte {
	file_moneydashboard_v4_account_groups_proto_rawDescOnce.Do(func() {
		file_moneydashboard_v4_account_groups_proto_rawDescData = protoimpl.X.CompressGZIP(file_moneydashboard_v4_account_groups_proto_rawDescData)
	})
	return file_moneydashboard_v4_account_groups_proto_rawDescData
}

var file_moneydashboard_v4_account_groups_proto_msgTypes = make([]protoimpl.MessageInfo, 7)
var file_moneydashboard_v4_account_groups_proto_goTypes = []any{
	(*AccountGroup)(nil),                // 0: moneydashboard.v4.AccountGroup
	(*GetAccountGroupByIdRequest)(nil),  // 1: moneydashboard.v4.GetAccountGroupByIdRequest
	(*GetAccountGroupByIdResponse)(nil), // 2: moneydashboard.v4.GetAccountGroupByIdResponse
	(*GetAllAccountGroupsRequest)(nil),  // 3: moneydashboard.v4.GetAllAccountGroupsRequest
	(*GetAllAccountGroupsResponse)(nil), // 4: moneydashboard.v4.GetAllAccountGroupsResponse
	(*UpsertAccountGroupRequest)(nil),   // 5: moneydashboard.v4.UpsertAccountGroupRequest
	(*UpsertAccountGroupResponse)(nil),  // 6: moneydashboard.v4.UpsertAccountGroupResponse
}
var file_moneydashboard_v4_account_groups_proto_depIdxs = []int32{
	0, // 0: moneydashboard.v4.GetAccountGroupByIdResponse.account_group:type_name -> moneydashboard.v4.AccountGroup
	0, // 1: moneydashboard.v4.GetAllAccountGroupsResponse.account_groups:type_name -> moneydashboard.v4.AccountGroup
	0, // 2: moneydashboard.v4.UpsertAccountGroupRequest.account_group:type_name -> moneydashboard.v4.AccountGroup
	1, // 3: moneydashboard.v4.MDAccountGroupService.GetAccountGroupById:input_type -> moneydashboard.v4.GetAccountGroupByIdRequest
	3, // 4: moneydashboard.v4.MDAccountGroupService.GetAllAccountGroups:input_type -> moneydashboard.v4.GetAllAccountGroupsRequest
	5, // 5: moneydashboard.v4.MDAccountGroupService.UpsertAccountGroup:input_type -> moneydashboard.v4.UpsertAccountGroupRequest
	2, // 6: moneydashboard.v4.MDAccountGroupService.GetAccountGroupById:output_type -> moneydashboard.v4.GetAccountGroupByIdResponse
	4, // 7: moneydashboard.v4.MDAccountGroupService.GetAllAccountGroups:output_type -> moneydashboard.v4.GetAllAccountGroupsResponse
	6, // 8: moneydashboard.v4.MDAccountGroupService.UpsertAccountGroup:output_type -> moneydashboard.v4.UpsertAccountGroupResponse
	6, // [6:9] is the sub-list for method output_type
	3, // [3:6] is the sub-list for method input_type
	3, // [3:3] is the sub-list for extension type_name
	3, // [3:3] is the sub-list for extension extendee
	0, // [0:3] is the sub-list for field type_name
}

func init() { file_moneydashboard_v4_account_groups_proto_init() }
func file_moneydashboard_v4_account_groups_proto_init() {
	if File_moneydashboard_v4_account_groups_proto != nil {
		return
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_moneydashboard_v4_account_groups_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   7,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_moneydashboard_v4_account_groups_proto_goTypes,
		DependencyIndexes: file_moneydashboard_v4_account_groups_proto_depIdxs,
		MessageInfos:      file_moneydashboard_v4_account_groups_proto_msgTypes,
	}.Build()
	File_moneydashboard_v4_account_groups_proto = out.File
	file_moneydashboard_v4_account_groups_proto_rawDesc = nil
	file_moneydashboard_v4_account_groups_proto_goTypes = nil
	file_moneydashboard_v4_account_groups_proto_depIdxs = nil
}
