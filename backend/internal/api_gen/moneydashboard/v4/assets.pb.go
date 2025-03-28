// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.36.3
// 	protoc        (unknown)
// source: moneydashboard/v4/assets.proto

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

type Asset struct {
	state            protoimpl.MessageState `protogen:"open.v1"`
	Id               string                 `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	Name             string                 `protobuf:"bytes,2,opt,name=name,proto3" json:"name,omitempty"`
	Notes            string                 `protobuf:"bytes,3,opt,name=notes,proto3" json:"notes,omitempty"`
	DisplayPrecision int32                  `protobuf:"varint,4,opt,name=display_precision,json=displayPrecision,proto3" json:"display_precision,omitempty"`
	Active           bool                   `protobuf:"varint,6,opt,name=active,proto3" json:"active,omitempty"`
	Currency         *Currency              `protobuf:"bytes,7,opt,name=currency,proto3" json:"currency,omitempty"`
	unknownFields    protoimpl.UnknownFields
	sizeCache        protoimpl.SizeCache
}

func (x *Asset) Reset() {
	*x = Asset{}
	mi := &file_moneydashboard_v4_assets_proto_msgTypes[0]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *Asset) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Asset) ProtoMessage() {}

func (x *Asset) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_assets_proto_msgTypes[0]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Asset.ProtoReflect.Descriptor instead.
func (*Asset) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_assets_proto_rawDescGZIP(), []int{0}
}

func (x *Asset) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

func (x *Asset) GetName() string {
	if x != nil {
		return x.Name
	}
	return ""
}

func (x *Asset) GetNotes() string {
	if x != nil {
		return x.Notes
	}
	return ""
}

func (x *Asset) GetDisplayPrecision() int32 {
	if x != nil {
		return x.DisplayPrecision
	}
	return 0
}

func (x *Asset) GetActive() bool {
	if x != nil {
		return x.Active
	}
	return false
}

func (x *Asset) GetCurrency() *Currency {
	if x != nil {
		return x.Currency
	}
	return nil
}

type GetAssetByIdRequest struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Id            string                 `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *GetAssetByIdRequest) Reset() {
	*x = GetAssetByIdRequest{}
	mi := &file_moneydashboard_v4_assets_proto_msgTypes[1]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *GetAssetByIdRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetAssetByIdRequest) ProtoMessage() {}

func (x *GetAssetByIdRequest) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_assets_proto_msgTypes[1]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetAssetByIdRequest.ProtoReflect.Descriptor instead.
func (*GetAssetByIdRequest) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_assets_proto_rawDescGZIP(), []int{1}
}

func (x *GetAssetByIdRequest) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

type GetAssetByIdResponse struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Asset         *Asset                 `protobuf:"bytes,1,opt,name=asset,proto3" json:"asset,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *GetAssetByIdResponse) Reset() {
	*x = GetAssetByIdResponse{}
	mi := &file_moneydashboard_v4_assets_proto_msgTypes[2]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *GetAssetByIdResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetAssetByIdResponse) ProtoMessage() {}

func (x *GetAssetByIdResponse) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_assets_proto_msgTypes[2]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetAssetByIdResponse.ProtoReflect.Descriptor instead.
func (*GetAssetByIdResponse) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_assets_proto_rawDescGZIP(), []int{2}
}

func (x *GetAssetByIdResponse) GetAsset() *Asset {
	if x != nil {
		return x.Asset
	}
	return nil
}

type GetAllAssetsRequest struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *GetAllAssetsRequest) Reset() {
	*x = GetAllAssetsRequest{}
	mi := &file_moneydashboard_v4_assets_proto_msgTypes[3]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *GetAllAssetsRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetAllAssetsRequest) ProtoMessage() {}

func (x *GetAllAssetsRequest) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_assets_proto_msgTypes[3]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetAllAssetsRequest.ProtoReflect.Descriptor instead.
func (*GetAllAssetsRequest) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_assets_proto_rawDescGZIP(), []int{3}
}

type GetAllAssetsResponse struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Assets        []*Asset               `protobuf:"bytes,1,rep,name=assets,proto3" json:"assets,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *GetAllAssetsResponse) Reset() {
	*x = GetAllAssetsResponse{}
	mi := &file_moneydashboard_v4_assets_proto_msgTypes[4]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *GetAllAssetsResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetAllAssetsResponse) ProtoMessage() {}

func (x *GetAllAssetsResponse) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_assets_proto_msgTypes[4]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetAllAssetsResponse.ProtoReflect.Descriptor instead.
func (*GetAllAssetsResponse) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_assets_proto_rawDescGZIP(), []int{4}
}

func (x *GetAllAssetsResponse) GetAssets() []*Asset {
	if x != nil {
		return x.Assets
	}
	return nil
}

type UpsertAssetRequest struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Asset         *Asset                 `protobuf:"bytes,1,opt,name=asset,proto3" json:"asset,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *UpsertAssetRequest) Reset() {
	*x = UpsertAssetRequest{}
	mi := &file_moneydashboard_v4_assets_proto_msgTypes[5]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *UpsertAssetRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*UpsertAssetRequest) ProtoMessage() {}

func (x *UpsertAssetRequest) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_assets_proto_msgTypes[5]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use UpsertAssetRequest.ProtoReflect.Descriptor instead.
func (*UpsertAssetRequest) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_assets_proto_rawDescGZIP(), []int{5}
}

func (x *UpsertAssetRequest) GetAsset() *Asset {
	if x != nil {
		return x.Asset
	}
	return nil
}

type UpsertAssetResponse struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *UpsertAssetResponse) Reset() {
	*x = UpsertAssetResponse{}
	mi := &file_moneydashboard_v4_assets_proto_msgTypes[6]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *UpsertAssetResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*UpsertAssetResponse) ProtoMessage() {}

func (x *UpsertAssetResponse) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_assets_proto_msgTypes[6]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use UpsertAssetResponse.ProtoReflect.Descriptor instead.
func (*UpsertAssetResponse) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_assets_proto_rawDescGZIP(), []int{6}
}

var File_moneydashboard_v4_assets_proto protoreflect.FileDescriptor

var file_moneydashboard_v4_assets_proto_rawDesc = []byte{
	0x0a, 0x1e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64,
	0x2f, 0x76, 0x34, 0x2f, 0x61, 0x73, 0x73, 0x65, 0x74, 0x73, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f,
	0x12, 0x11, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64,
	0x2e, 0x76, 0x34, 0x1a, 0x22, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f,
	0x61, 0x72, 0x64, 0x2f, 0x76, 0x34, 0x2f, 0x63, 0x75, 0x72, 0x72, 0x65, 0x6e, 0x63, 0x69, 0x65,
	0x73, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x22, 0xbf, 0x01, 0x0a, 0x05, 0x41, 0x73, 0x73, 0x65,
	0x74, 0x12, 0x0e, 0x0a, 0x02, 0x69, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x02, 0x69,
	0x64, 0x12, 0x12, 0x0a, 0x04, 0x6e, 0x61, 0x6d, 0x65, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52,
	0x04, 0x6e, 0x61, 0x6d, 0x65, 0x12, 0x14, 0x0a, 0x05, 0x6e, 0x6f, 0x74, 0x65, 0x73, 0x18, 0x03,
	0x20, 0x01, 0x28, 0x09, 0x52, 0x05, 0x6e, 0x6f, 0x74, 0x65, 0x73, 0x12, 0x2b, 0x0a, 0x11, 0x64,
	0x69, 0x73, 0x70, 0x6c, 0x61, 0x79, 0x5f, 0x70, 0x72, 0x65, 0x63, 0x69, 0x73, 0x69, 0x6f, 0x6e,
	0x18, 0x04, 0x20, 0x01, 0x28, 0x05, 0x52, 0x10, 0x64, 0x69, 0x73, 0x70, 0x6c, 0x61, 0x79, 0x50,
	0x72, 0x65, 0x63, 0x69, 0x73, 0x69, 0x6f, 0x6e, 0x12, 0x16, 0x0a, 0x06, 0x61, 0x63, 0x74, 0x69,
	0x76, 0x65, 0x18, 0x06, 0x20, 0x01, 0x28, 0x08, 0x52, 0x06, 0x61, 0x63, 0x74, 0x69, 0x76, 0x65,
	0x12, 0x37, 0x0a, 0x08, 0x63, 0x75, 0x72, 0x72, 0x65, 0x6e, 0x63, 0x79, 0x18, 0x07, 0x20, 0x01,
	0x28, 0x0b, 0x32, 0x1b, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f,
	0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x43, 0x75, 0x72, 0x72, 0x65, 0x6e, 0x63, 0x79, 0x52,
	0x08, 0x63, 0x75, 0x72, 0x72, 0x65, 0x6e, 0x63, 0x79, 0x22, 0x25, 0x0a, 0x13, 0x47, 0x65, 0x74,
	0x41, 0x73, 0x73, 0x65, 0x74, 0x42, 0x79, 0x49, 0x64, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74,
	0x12, 0x0e, 0x0a, 0x02, 0x69, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x02, 0x69, 0x64,
	0x22, 0x46, 0x0a, 0x14, 0x47, 0x65, 0x74, 0x41, 0x73, 0x73, 0x65, 0x74, 0x42, 0x79, 0x49, 0x64,
	0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x2e, 0x0a, 0x05, 0x61, 0x73, 0x73, 0x65,
	0x74, 0x18, 0x01, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x18, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64,
	0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x41, 0x73, 0x73, 0x65,
	0x74, 0x52, 0x05, 0x61, 0x73, 0x73, 0x65, 0x74, 0x22, 0x15, 0x0a, 0x13, 0x47, 0x65, 0x74, 0x41,
	0x6c, 0x6c, 0x41, 0x73, 0x73, 0x65, 0x74, 0x73, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x22,
	0x48, 0x0a, 0x14, 0x47, 0x65, 0x74, 0x41, 0x6c, 0x6c, 0x41, 0x73, 0x73, 0x65, 0x74, 0x73, 0x52,
	0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x30, 0x0a, 0x06, 0x61, 0x73, 0x73, 0x65, 0x74,
	0x73, 0x18, 0x01, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x18, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64,
	0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x41, 0x73, 0x73, 0x65,
	0x74, 0x52, 0x06, 0x61, 0x73, 0x73, 0x65, 0x74, 0x73, 0x22, 0x44, 0x0a, 0x12, 0x55, 0x70, 0x73,
	0x65, 0x72, 0x74, 0x41, 0x73, 0x73, 0x65, 0x74, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x12,
	0x2e, 0x0a, 0x05, 0x61, 0x73, 0x73, 0x65, 0x74, 0x18, 0x01, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x18,
	0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e,
	0x76, 0x34, 0x2e, 0x41, 0x73, 0x73, 0x65, 0x74, 0x52, 0x05, 0x61, 0x73, 0x73, 0x65, 0x74, 0x22,
	0x15, 0x0a, 0x13, 0x55, 0x70, 0x73, 0x65, 0x72, 0x74, 0x41, 0x73, 0x73, 0x65, 0x74, 0x52, 0x65,
	0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x32, 0xb0, 0x02, 0x0a, 0x0e, 0x4d, 0x44, 0x41, 0x73, 0x73,
	0x65, 0x74, 0x53, 0x65, 0x72, 0x76, 0x69, 0x63, 0x65, 0x12, 0x5f, 0x0a, 0x0c, 0x47, 0x65, 0x74,
	0x41, 0x73, 0x73, 0x65, 0x74, 0x42, 0x79, 0x49, 0x64, 0x12, 0x26, 0x2e, 0x6d, 0x6f, 0x6e, 0x65,
	0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x47, 0x65,
	0x74, 0x41, 0x73, 0x73, 0x65, 0x74, 0x42, 0x79, 0x49, 0x64, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73,
	0x74, 0x1a, 0x27, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61,
	0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x47, 0x65, 0x74, 0x41, 0x73, 0x73, 0x65, 0x74, 0x42, 0x79,
	0x49, 0x64, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x5f, 0x0a, 0x0c, 0x47, 0x65,
	0x74, 0x41, 0x6c, 0x6c, 0x41, 0x73, 0x73, 0x65, 0x74, 0x73, 0x12, 0x26, 0x2e, 0x6d, 0x6f, 0x6e,
	0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x47,
	0x65, 0x74, 0x41, 0x6c, 0x6c, 0x41, 0x73, 0x73, 0x65, 0x74, 0x73, 0x52, 0x65, 0x71, 0x75, 0x65,
	0x73, 0x74, 0x1a, 0x27, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f,
	0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x47, 0x65, 0x74, 0x41, 0x6c, 0x6c, 0x41, 0x73, 0x73,
	0x65, 0x74, 0x73, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x5c, 0x0a, 0x0b, 0x55,
	0x70, 0x73, 0x65, 0x72, 0x74, 0x41, 0x73, 0x73, 0x65, 0x74, 0x12, 0x25, 0x2e, 0x6d, 0x6f, 0x6e,
	0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x55,
	0x70, 0x73, 0x65, 0x72, 0x74, 0x41, 0x73, 0x73, 0x65, 0x74, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73,
	0x74, 0x1a, 0x26, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61,
	0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x55, 0x70, 0x73, 0x65, 0x72, 0x74, 0x41, 0x73, 0x73, 0x65,
	0x74, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x42, 0x51, 0x5a, 0x4f, 0x67, 0x69, 0x74,
	0x68, 0x75, 0x62, 0x2e, 0x63, 0x6f, 0x6d, 0x2f, 0x6d, 0x61, 0x72, 0x6b, 0x6f, 0x72, 0x6d, 0x65,
	0x73, 0x68, 0x65, 0x72, 0x2f, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x2d, 0x64, 0x61, 0x73, 0x68, 0x62,
	0x6f, 0x61, 0x72, 0x64, 0x2f, 0x69, 0x6e, 0x74, 0x65, 0x72, 0x6e, 0x61, 0x6c, 0x2f, 0x61, 0x70,
	0x69, 0x5f, 0x67, 0x65, 0x6e, 0x2f, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62,
	0x6f, 0x61, 0x72, 0x64, 0x2f, 0x76, 0x34, 0x3b, 0x6d, 0x64, 0x76, 0x34, 0x62, 0x06, 0x70, 0x72,
	0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_moneydashboard_v4_assets_proto_rawDescOnce sync.Once
	file_moneydashboard_v4_assets_proto_rawDescData = file_moneydashboard_v4_assets_proto_rawDesc
)

func file_moneydashboard_v4_assets_proto_rawDescGZIP() []byte {
	file_moneydashboard_v4_assets_proto_rawDescOnce.Do(func() {
		file_moneydashboard_v4_assets_proto_rawDescData = protoimpl.X.CompressGZIP(file_moneydashboard_v4_assets_proto_rawDescData)
	})
	return file_moneydashboard_v4_assets_proto_rawDescData
}

var file_moneydashboard_v4_assets_proto_msgTypes = make([]protoimpl.MessageInfo, 7)
var file_moneydashboard_v4_assets_proto_goTypes = []any{
	(*Asset)(nil),                // 0: moneydashboard.v4.Asset
	(*GetAssetByIdRequest)(nil),  // 1: moneydashboard.v4.GetAssetByIdRequest
	(*GetAssetByIdResponse)(nil), // 2: moneydashboard.v4.GetAssetByIdResponse
	(*GetAllAssetsRequest)(nil),  // 3: moneydashboard.v4.GetAllAssetsRequest
	(*GetAllAssetsResponse)(nil), // 4: moneydashboard.v4.GetAllAssetsResponse
	(*UpsertAssetRequest)(nil),   // 5: moneydashboard.v4.UpsertAssetRequest
	(*UpsertAssetResponse)(nil),  // 6: moneydashboard.v4.UpsertAssetResponse
	(*Currency)(nil),             // 7: moneydashboard.v4.Currency
}
var file_moneydashboard_v4_assets_proto_depIdxs = []int32{
	7, // 0: moneydashboard.v4.Asset.currency:type_name -> moneydashboard.v4.Currency
	0, // 1: moneydashboard.v4.GetAssetByIdResponse.asset:type_name -> moneydashboard.v4.Asset
	0, // 2: moneydashboard.v4.GetAllAssetsResponse.assets:type_name -> moneydashboard.v4.Asset
	0, // 3: moneydashboard.v4.UpsertAssetRequest.asset:type_name -> moneydashboard.v4.Asset
	1, // 4: moneydashboard.v4.MDAssetService.GetAssetById:input_type -> moneydashboard.v4.GetAssetByIdRequest
	3, // 5: moneydashboard.v4.MDAssetService.GetAllAssets:input_type -> moneydashboard.v4.GetAllAssetsRequest
	5, // 6: moneydashboard.v4.MDAssetService.UpsertAsset:input_type -> moneydashboard.v4.UpsertAssetRequest
	2, // 7: moneydashboard.v4.MDAssetService.GetAssetById:output_type -> moneydashboard.v4.GetAssetByIdResponse
	4, // 8: moneydashboard.v4.MDAssetService.GetAllAssets:output_type -> moneydashboard.v4.GetAllAssetsResponse
	6, // 9: moneydashboard.v4.MDAssetService.UpsertAsset:output_type -> moneydashboard.v4.UpsertAssetResponse
	7, // [7:10] is the sub-list for method output_type
	4, // [4:7] is the sub-list for method input_type
	4, // [4:4] is the sub-list for extension type_name
	4, // [4:4] is the sub-list for extension extendee
	0, // [0:4] is the sub-list for field type_name
}

func init() { file_moneydashboard_v4_assets_proto_init() }
func file_moneydashboard_v4_assets_proto_init() {
	if File_moneydashboard_v4_assets_proto != nil {
		return
	}
	file_moneydashboard_v4_currencies_proto_init()
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_moneydashboard_v4_assets_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   7,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_moneydashboard_v4_assets_proto_goTypes,
		DependencyIndexes: file_moneydashboard_v4_assets_proto_depIdxs,
		MessageInfos:      file_moneydashboard_v4_assets_proto_msgTypes,
	}.Build()
	File_moneydashboard_v4_assets_proto = out.File
	file_moneydashboard_v4_assets_proto_rawDesc = nil
	file_moneydashboard_v4_assets_proto_goTypes = nil
	file_moneydashboard_v4_assets_proto_depIdxs = nil
}
