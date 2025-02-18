// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.36.3
// 	protoc        (unknown)
// source: moneydashboard/v4/categories.proto

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

type Category struct {
	state                protoimpl.MessageState `protogen:"open.v1"`
	Id                   string                 `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	Name                 string                 `protobuf:"bytes,2,opt,name=name,proto3" json:"name,omitempty"`
	IsMemo               bool                   `protobuf:"varint,3,opt,name=is_memo,json=isMemo,proto3" json:"is_memo,omitempty"`
	IsInterestIncome     bool                   `protobuf:"varint,4,opt,name=is_interest_income,json=isInterestIncome,proto3" json:"is_interest_income,omitempty"`
	IsDividendIncome     bool                   `protobuf:"varint,5,opt,name=is_dividend_income,json=isDividendIncome,proto3" json:"is_dividend_income,omitempty"`
	IsCapitalAcquisition bool                   `protobuf:"varint,6,opt,name=is_capital_acquisition,json=isCapitalAcquisition,proto3" json:"is_capital_acquisition,omitempty"`
	IsCapitalDisposal    bool                   `protobuf:"varint,7,opt,name=is_capital_disposal,json=isCapitalDisposal,proto3" json:"is_capital_disposal,omitempty"`
	IsCapitalEventFee    bool                   `protobuf:"varint,8,opt,name=is_capital_event_fee,json=isCapitalEventFee,proto3" json:"is_capital_event_fee,omitempty"`
	Active               bool                   `protobuf:"varint,9,opt,name=active,proto3" json:"active,omitempty"`
	unknownFields        protoimpl.UnknownFields
	sizeCache            protoimpl.SizeCache
}

func (x *Category) Reset() {
	*x = Category{}
	mi := &file_moneydashboard_v4_categories_proto_msgTypes[0]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *Category) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Category) ProtoMessage() {}

func (x *Category) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_categories_proto_msgTypes[0]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Category.ProtoReflect.Descriptor instead.
func (*Category) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_categories_proto_rawDescGZIP(), []int{0}
}

func (x *Category) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

func (x *Category) GetName() string {
	if x != nil {
		return x.Name
	}
	return ""
}

func (x *Category) GetIsMemo() bool {
	if x != nil {
		return x.IsMemo
	}
	return false
}

func (x *Category) GetIsInterestIncome() bool {
	if x != nil {
		return x.IsInterestIncome
	}
	return false
}

func (x *Category) GetIsDividendIncome() bool {
	if x != nil {
		return x.IsDividendIncome
	}
	return false
}

func (x *Category) GetIsCapitalAcquisition() bool {
	if x != nil {
		return x.IsCapitalAcquisition
	}
	return false
}

func (x *Category) GetIsCapitalDisposal() bool {
	if x != nil {
		return x.IsCapitalDisposal
	}
	return false
}

func (x *Category) GetIsCapitalEventFee() bool {
	if x != nil {
		return x.IsCapitalEventFee
	}
	return false
}

func (x *Category) GetActive() bool {
	if x != nil {
		return x.Active
	}
	return false
}

type GetCategoryByIdRequest struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Id            string                 `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *GetCategoryByIdRequest) Reset() {
	*x = GetCategoryByIdRequest{}
	mi := &file_moneydashboard_v4_categories_proto_msgTypes[1]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *GetCategoryByIdRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetCategoryByIdRequest) ProtoMessage() {}

func (x *GetCategoryByIdRequest) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_categories_proto_msgTypes[1]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetCategoryByIdRequest.ProtoReflect.Descriptor instead.
func (*GetCategoryByIdRequest) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_categories_proto_rawDescGZIP(), []int{1}
}

func (x *GetCategoryByIdRequest) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

type GetCategoryByIdResponse struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Category      *Category              `protobuf:"bytes,1,opt,name=category,proto3" json:"category,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *GetCategoryByIdResponse) Reset() {
	*x = GetCategoryByIdResponse{}
	mi := &file_moneydashboard_v4_categories_proto_msgTypes[2]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *GetCategoryByIdResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetCategoryByIdResponse) ProtoMessage() {}

func (x *GetCategoryByIdResponse) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_categories_proto_msgTypes[2]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetCategoryByIdResponse.ProtoReflect.Descriptor instead.
func (*GetCategoryByIdResponse) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_categories_proto_rawDescGZIP(), []int{2}
}

func (x *GetCategoryByIdResponse) GetCategory() *Category {
	if x != nil {
		return x.Category
	}
	return nil
}

type GetAllCategoriesRequest struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *GetAllCategoriesRequest) Reset() {
	*x = GetAllCategoriesRequest{}
	mi := &file_moneydashboard_v4_categories_proto_msgTypes[3]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *GetAllCategoriesRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetAllCategoriesRequest) ProtoMessage() {}

func (x *GetAllCategoriesRequest) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_categories_proto_msgTypes[3]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetAllCategoriesRequest.ProtoReflect.Descriptor instead.
func (*GetAllCategoriesRequest) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_categories_proto_rawDescGZIP(), []int{3}
}

type GetAllCategoriesResponse struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Categories    []*Category            `protobuf:"bytes,1,rep,name=categories,proto3" json:"categories,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *GetAllCategoriesResponse) Reset() {
	*x = GetAllCategoriesResponse{}
	mi := &file_moneydashboard_v4_categories_proto_msgTypes[4]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *GetAllCategoriesResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetAllCategoriesResponse) ProtoMessage() {}

func (x *GetAllCategoriesResponse) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_categories_proto_msgTypes[4]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetAllCategoriesResponse.ProtoReflect.Descriptor instead.
func (*GetAllCategoriesResponse) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_categories_proto_rawDescGZIP(), []int{4}
}

func (x *GetAllCategoriesResponse) GetCategories() []*Category {
	if x != nil {
		return x.Categories
	}
	return nil
}

type UpsertCategoryRequest struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Category      *Category              `protobuf:"bytes,1,opt,name=category,proto3" json:"category,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *UpsertCategoryRequest) Reset() {
	*x = UpsertCategoryRequest{}
	mi := &file_moneydashboard_v4_categories_proto_msgTypes[5]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *UpsertCategoryRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*UpsertCategoryRequest) ProtoMessage() {}

func (x *UpsertCategoryRequest) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_categories_proto_msgTypes[5]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use UpsertCategoryRequest.ProtoReflect.Descriptor instead.
func (*UpsertCategoryRequest) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_categories_proto_rawDescGZIP(), []int{5}
}

func (x *UpsertCategoryRequest) GetCategory() *Category {
	if x != nil {
		return x.Category
	}
	return nil
}

type UpsertCategoryResponse struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *UpsertCategoryResponse) Reset() {
	*x = UpsertCategoryResponse{}
	mi := &file_moneydashboard_v4_categories_proto_msgTypes[6]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *UpsertCategoryResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*UpsertCategoryResponse) ProtoMessage() {}

func (x *UpsertCategoryResponse) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_categories_proto_msgTypes[6]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use UpsertCategoryResponse.ProtoReflect.Descriptor instead.
func (*UpsertCategoryResponse) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_categories_proto_rawDescGZIP(), []int{6}
}

var File_moneydashboard_v4_categories_proto protoreflect.FileDescriptor

var file_moneydashboard_v4_categories_proto_rawDesc = []byte{
	0x0a, 0x22, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64,
	0x2f, 0x76, 0x34, 0x2f, 0x63, 0x61, 0x74, 0x65, 0x67, 0x6f, 0x72, 0x69, 0x65, 0x73, 0x2e, 0x70,
	0x72, 0x6f, 0x74, 0x6f, 0x12, 0x11, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62,
	0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x1a, 0x1d, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61,
	0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2f, 0x76, 0x34, 0x2f, 0x75, 0x73, 0x65, 0x72, 0x73,
	0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x22, 0xd2, 0x02, 0x0a, 0x08, 0x43, 0x61, 0x74, 0x65, 0x67,
	0x6f, 0x72, 0x79, 0x12, 0x0e, 0x0a, 0x02, 0x69, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52,
	0x02, 0x69, 0x64, 0x12, 0x12, 0x0a, 0x04, 0x6e, 0x61, 0x6d, 0x65, 0x18, 0x02, 0x20, 0x01, 0x28,
	0x09, 0x52, 0x04, 0x6e, 0x61, 0x6d, 0x65, 0x12, 0x17, 0x0a, 0x07, 0x69, 0x73, 0x5f, 0x6d, 0x65,
	0x6d, 0x6f, 0x18, 0x03, 0x20, 0x01, 0x28, 0x08, 0x52, 0x06, 0x69, 0x73, 0x4d, 0x65, 0x6d, 0x6f,
	0x12, 0x2c, 0x0a, 0x12, 0x69, 0x73, 0x5f, 0x69, 0x6e, 0x74, 0x65, 0x72, 0x65, 0x73, 0x74, 0x5f,
	0x69, 0x6e, 0x63, 0x6f, 0x6d, 0x65, 0x18, 0x04, 0x20, 0x01, 0x28, 0x08, 0x52, 0x10, 0x69, 0x73,
	0x49, 0x6e, 0x74, 0x65, 0x72, 0x65, 0x73, 0x74, 0x49, 0x6e, 0x63, 0x6f, 0x6d, 0x65, 0x12, 0x2c,
	0x0a, 0x12, 0x69, 0x73, 0x5f, 0x64, 0x69, 0x76, 0x69, 0x64, 0x65, 0x6e, 0x64, 0x5f, 0x69, 0x6e,
	0x63, 0x6f, 0x6d, 0x65, 0x18, 0x05, 0x20, 0x01, 0x28, 0x08, 0x52, 0x10, 0x69, 0x73, 0x44, 0x69,
	0x76, 0x69, 0x64, 0x65, 0x6e, 0x64, 0x49, 0x6e, 0x63, 0x6f, 0x6d, 0x65, 0x12, 0x34, 0x0a, 0x16,
	0x69, 0x73, 0x5f, 0x63, 0x61, 0x70, 0x69, 0x74, 0x61, 0x6c, 0x5f, 0x61, 0x63, 0x71, 0x75, 0x69,
	0x73, 0x69, 0x74, 0x69, 0x6f, 0x6e, 0x18, 0x06, 0x20, 0x01, 0x28, 0x08, 0x52, 0x14, 0x69, 0x73,
	0x43, 0x61, 0x70, 0x69, 0x74, 0x61, 0x6c, 0x41, 0x63, 0x71, 0x75, 0x69, 0x73, 0x69, 0x74, 0x69,
	0x6f, 0x6e, 0x12, 0x2e, 0x0a, 0x13, 0x69, 0x73, 0x5f, 0x63, 0x61, 0x70, 0x69, 0x74, 0x61, 0x6c,
	0x5f, 0x64, 0x69, 0x73, 0x70, 0x6f, 0x73, 0x61, 0x6c, 0x18, 0x07, 0x20, 0x01, 0x28, 0x08, 0x52,
	0x11, 0x69, 0x73, 0x43, 0x61, 0x70, 0x69, 0x74, 0x61, 0x6c, 0x44, 0x69, 0x73, 0x70, 0x6f, 0x73,
	0x61, 0x6c, 0x12, 0x2f, 0x0a, 0x14, 0x69, 0x73, 0x5f, 0x63, 0x61, 0x70, 0x69, 0x74, 0x61, 0x6c,
	0x5f, 0x65, 0x76, 0x65, 0x6e, 0x74, 0x5f, 0x66, 0x65, 0x65, 0x18, 0x08, 0x20, 0x01, 0x28, 0x08,
	0x52, 0x11, 0x69, 0x73, 0x43, 0x61, 0x70, 0x69, 0x74, 0x61, 0x6c, 0x45, 0x76, 0x65, 0x6e, 0x74,
	0x46, 0x65, 0x65, 0x12, 0x16, 0x0a, 0x06, 0x61, 0x63, 0x74, 0x69, 0x76, 0x65, 0x18, 0x09, 0x20,
	0x01, 0x28, 0x08, 0x52, 0x06, 0x61, 0x63, 0x74, 0x69, 0x76, 0x65, 0x22, 0x28, 0x0a, 0x16, 0x47,
	0x65, 0x74, 0x43, 0x61, 0x74, 0x65, 0x67, 0x6f, 0x72, 0x79, 0x42, 0x79, 0x49, 0x64, 0x52, 0x65,
	0x71, 0x75, 0x65, 0x73, 0x74, 0x12, 0x0e, 0x0a, 0x02, 0x69, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28,
	0x09, 0x52, 0x02, 0x69, 0x64, 0x22, 0x52, 0x0a, 0x17, 0x47, 0x65, 0x74, 0x43, 0x61, 0x74, 0x65,
	0x67, 0x6f, 0x72, 0x79, 0x42, 0x79, 0x49, 0x64, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65,
	0x12, 0x37, 0x0a, 0x08, 0x63, 0x61, 0x74, 0x65, 0x67, 0x6f, 0x72, 0x79, 0x18, 0x01, 0x20, 0x01,
	0x28, 0x0b, 0x32, 0x1b, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f,
	0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x43, 0x61, 0x74, 0x65, 0x67, 0x6f, 0x72, 0x79, 0x52,
	0x08, 0x63, 0x61, 0x74, 0x65, 0x67, 0x6f, 0x72, 0x79, 0x22, 0x19, 0x0a, 0x17, 0x47, 0x65, 0x74,
	0x41, 0x6c, 0x6c, 0x43, 0x61, 0x74, 0x65, 0x67, 0x6f, 0x72, 0x69, 0x65, 0x73, 0x52, 0x65, 0x71,
	0x75, 0x65, 0x73, 0x74, 0x22, 0x57, 0x0a, 0x18, 0x47, 0x65, 0x74, 0x41, 0x6c, 0x6c, 0x43, 0x61,
	0x74, 0x65, 0x67, 0x6f, 0x72, 0x69, 0x65, 0x73, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65,
	0x12, 0x3b, 0x0a, 0x0a, 0x63, 0x61, 0x74, 0x65, 0x67, 0x6f, 0x72, 0x69, 0x65, 0x73, 0x18, 0x01,
	0x20, 0x03, 0x28, 0x0b, 0x32, 0x1b, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68,
	0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x43, 0x61, 0x74, 0x65, 0x67, 0x6f, 0x72,
	0x79, 0x52, 0x0a, 0x63, 0x61, 0x74, 0x65, 0x67, 0x6f, 0x72, 0x69, 0x65, 0x73, 0x22, 0x50, 0x0a,
	0x15, 0x55, 0x70, 0x73, 0x65, 0x72, 0x74, 0x43, 0x61, 0x74, 0x65, 0x67, 0x6f, 0x72, 0x79, 0x52,
	0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x12, 0x37, 0x0a, 0x08, 0x63, 0x61, 0x74, 0x65, 0x67, 0x6f,
	0x72, 0x79, 0x18, 0x01, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x1b, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79,
	0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x43, 0x61, 0x74,
	0x65, 0x67, 0x6f, 0x72, 0x79, 0x52, 0x08, 0x63, 0x61, 0x74, 0x65, 0x67, 0x6f, 0x72, 0x79, 0x22,
	0x18, 0x0a, 0x16, 0x55, 0x70, 0x73, 0x65, 0x72, 0x74, 0x43, 0x61, 0x74, 0x65, 0x67, 0x6f, 0x72,
	0x79, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x32, 0xd1, 0x02, 0x0a, 0x11, 0x4d, 0x44,
	0x43, 0x61, 0x74, 0x65, 0x67, 0x6f, 0x72, 0x79, 0x53, 0x65, 0x72, 0x76, 0x69, 0x63, 0x65, 0x12,
	0x68, 0x0a, 0x0f, 0x47, 0x65, 0x74, 0x43, 0x61, 0x74, 0x65, 0x67, 0x6f, 0x72, 0x79, 0x42, 0x79,
	0x49, 0x64, 0x12, 0x29, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f,
	0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x47, 0x65, 0x74, 0x43, 0x61, 0x74, 0x65, 0x67, 0x6f,
	0x72, 0x79, 0x42, 0x79, 0x49, 0x64, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x2a, 0x2e,
	0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76,
	0x34, 0x2e, 0x47, 0x65, 0x74, 0x43, 0x61, 0x74, 0x65, 0x67, 0x6f, 0x72, 0x79, 0x42, 0x79, 0x49,
	0x64, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x6b, 0x0a, 0x10, 0x47, 0x65, 0x74,
	0x41, 0x6c, 0x6c, 0x43, 0x61, 0x74, 0x65, 0x67, 0x6f, 0x72, 0x69, 0x65, 0x73, 0x12, 0x2a, 0x2e,
	0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76,
	0x34, 0x2e, 0x47, 0x65, 0x74, 0x41, 0x6c, 0x6c, 0x43, 0x61, 0x74, 0x65, 0x67, 0x6f, 0x72, 0x69,
	0x65, 0x73, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x2b, 0x2e, 0x6d, 0x6f, 0x6e, 0x65,
	0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x47, 0x65,
	0x74, 0x41, 0x6c, 0x6c, 0x43, 0x61, 0x74, 0x65, 0x67, 0x6f, 0x72, 0x69, 0x65, 0x73, 0x52, 0x65,
	0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x65, 0x0a, 0x0e, 0x55, 0x70, 0x73, 0x65, 0x72, 0x74,
	0x43, 0x61, 0x74, 0x65, 0x67, 0x6f, 0x72, 0x79, 0x12, 0x28, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79,
	0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x55, 0x70, 0x73,
	0x65, 0x72, 0x74, 0x43, 0x61, 0x74, 0x65, 0x67, 0x6f, 0x72, 0x79, 0x52, 0x65, 0x71, 0x75, 0x65,
	0x73, 0x74, 0x1a, 0x29, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f,
	0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x55, 0x70, 0x73, 0x65, 0x72, 0x74, 0x43, 0x61, 0x74,
	0x65, 0x67, 0x6f, 0x72, 0x79, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x42, 0x51, 0x5a,
	0x4f, 0x67, 0x69, 0x74, 0x68, 0x75, 0x62, 0x2e, 0x63, 0x6f, 0x6d, 0x2f, 0x6d, 0x61, 0x72, 0x6b,
	0x6f, 0x72, 0x6d, 0x65, 0x73, 0x68, 0x65, 0x72, 0x2f, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x2d, 0x64,
	0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2f, 0x69, 0x6e, 0x74, 0x65, 0x72, 0x6e, 0x61,
	0x6c, 0x2f, 0x61, 0x70, 0x69, 0x5f, 0x67, 0x65, 0x6e, 0x2f, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64,
	0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2f, 0x76, 0x34, 0x3b, 0x6d, 0x64, 0x76, 0x34,
	0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_moneydashboard_v4_categories_proto_rawDescOnce sync.Once
	file_moneydashboard_v4_categories_proto_rawDescData = file_moneydashboard_v4_categories_proto_rawDesc
)

func file_moneydashboard_v4_categories_proto_rawDescGZIP() []byte {
	file_moneydashboard_v4_categories_proto_rawDescOnce.Do(func() {
		file_moneydashboard_v4_categories_proto_rawDescData = protoimpl.X.CompressGZIP(file_moneydashboard_v4_categories_proto_rawDescData)
	})
	return file_moneydashboard_v4_categories_proto_rawDescData
}

var file_moneydashboard_v4_categories_proto_msgTypes = make([]protoimpl.MessageInfo, 7)
var file_moneydashboard_v4_categories_proto_goTypes = []any{
	(*Category)(nil),                 // 0: moneydashboard.v4.Category
	(*GetCategoryByIdRequest)(nil),   // 1: moneydashboard.v4.GetCategoryByIdRequest
	(*GetCategoryByIdResponse)(nil),  // 2: moneydashboard.v4.GetCategoryByIdResponse
	(*GetAllCategoriesRequest)(nil),  // 3: moneydashboard.v4.GetAllCategoriesRequest
	(*GetAllCategoriesResponse)(nil), // 4: moneydashboard.v4.GetAllCategoriesResponse
	(*UpsertCategoryRequest)(nil),    // 5: moneydashboard.v4.UpsertCategoryRequest
	(*UpsertCategoryResponse)(nil),   // 6: moneydashboard.v4.UpsertCategoryResponse
}
var file_moneydashboard_v4_categories_proto_depIdxs = []int32{
	0, // 0: moneydashboard.v4.GetCategoryByIdResponse.category:type_name -> moneydashboard.v4.Category
	0, // 1: moneydashboard.v4.GetAllCategoriesResponse.categories:type_name -> moneydashboard.v4.Category
	0, // 2: moneydashboard.v4.UpsertCategoryRequest.category:type_name -> moneydashboard.v4.Category
	1, // 3: moneydashboard.v4.MDCategoryService.GetCategoryById:input_type -> moneydashboard.v4.GetCategoryByIdRequest
	3, // 4: moneydashboard.v4.MDCategoryService.GetAllCategories:input_type -> moneydashboard.v4.GetAllCategoriesRequest
	5, // 5: moneydashboard.v4.MDCategoryService.UpsertCategory:input_type -> moneydashboard.v4.UpsertCategoryRequest
	2, // 6: moneydashboard.v4.MDCategoryService.GetCategoryById:output_type -> moneydashboard.v4.GetCategoryByIdResponse
	4, // 7: moneydashboard.v4.MDCategoryService.GetAllCategories:output_type -> moneydashboard.v4.GetAllCategoriesResponse
	6, // 8: moneydashboard.v4.MDCategoryService.UpsertCategory:output_type -> moneydashboard.v4.UpsertCategoryResponse
	6, // [6:9] is the sub-list for method output_type
	3, // [3:6] is the sub-list for method input_type
	3, // [3:3] is the sub-list for extension type_name
	3, // [3:3] is the sub-list for extension extendee
	0, // [0:3] is the sub-list for field type_name
}

func init() { file_moneydashboard_v4_categories_proto_init() }
func file_moneydashboard_v4_categories_proto_init() {
	if File_moneydashboard_v4_categories_proto != nil {
		return
	}
	file_moneydashboard_v4_users_proto_init()
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_moneydashboard_v4_categories_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   7,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_moneydashboard_v4_categories_proto_goTypes,
		DependencyIndexes: file_moneydashboard_v4_categories_proto_depIdxs,
		MessageInfos:      file_moneydashboard_v4_categories_proto_msgTypes,
	}.Build()
	File_moneydashboard_v4_categories_proto = out.File
	file_moneydashboard_v4_categories_proto_rawDesc = nil
	file_moneydashboard_v4_categories_proto_goTypes = nil
	file_moneydashboard_v4_categories_proto_depIdxs = nil
}
