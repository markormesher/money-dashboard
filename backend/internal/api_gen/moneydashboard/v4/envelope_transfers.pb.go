// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.36.3
// 	protoc        (unknown)
// source: moneydashboard/v4/envelope_transfers.proto

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

type EnvelopeTransfer struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Id            string                 `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	Date          int64                  `protobuf:"varint,2,opt,name=date,proto3" json:"date,omitempty"`
	Notes         string                 `protobuf:"bytes,3,opt,name=notes,proto3" json:"notes,omitempty"`
	Amount        float64                `protobuf:"fixed64,4,opt,name=amount,proto3" json:"amount,omitempty"`
	FromEnvelope  *Envelope              `protobuf:"bytes,5,opt,name=from_envelope,json=fromEnvelope,proto3" json:"from_envelope,omitempty"`
	ToEnvelope    *Envelope              `protobuf:"bytes,6,opt,name=to_envelope,json=toEnvelope,proto3" json:"to_envelope,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *EnvelopeTransfer) Reset() {
	*x = EnvelopeTransfer{}
	mi := &file_moneydashboard_v4_envelope_transfers_proto_msgTypes[0]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *EnvelopeTransfer) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*EnvelopeTransfer) ProtoMessage() {}

func (x *EnvelopeTransfer) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_envelope_transfers_proto_msgTypes[0]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use EnvelopeTransfer.ProtoReflect.Descriptor instead.
func (*EnvelopeTransfer) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_envelope_transfers_proto_rawDescGZIP(), []int{0}
}

func (x *EnvelopeTransfer) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

func (x *EnvelopeTransfer) GetDate() int64 {
	if x != nil {
		return x.Date
	}
	return 0
}

func (x *EnvelopeTransfer) GetNotes() string {
	if x != nil {
		return x.Notes
	}
	return ""
}

func (x *EnvelopeTransfer) GetAmount() float64 {
	if x != nil {
		return x.Amount
	}
	return 0
}

func (x *EnvelopeTransfer) GetFromEnvelope() *Envelope {
	if x != nil {
		return x.FromEnvelope
	}
	return nil
}

func (x *EnvelopeTransfer) GetToEnvelope() *Envelope {
	if x != nil {
		return x.ToEnvelope
	}
	return nil
}

type GetEnvelopeTransferByIdRequest struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Id            string                 `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *GetEnvelopeTransferByIdRequest) Reset() {
	*x = GetEnvelopeTransferByIdRequest{}
	mi := &file_moneydashboard_v4_envelope_transfers_proto_msgTypes[1]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *GetEnvelopeTransferByIdRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetEnvelopeTransferByIdRequest) ProtoMessage() {}

func (x *GetEnvelopeTransferByIdRequest) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_envelope_transfers_proto_msgTypes[1]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetEnvelopeTransferByIdRequest.ProtoReflect.Descriptor instead.
func (*GetEnvelopeTransferByIdRequest) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_envelope_transfers_proto_rawDescGZIP(), []int{1}
}

func (x *GetEnvelopeTransferByIdRequest) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

type GetEnvelopeTransferByIdResponse struct {
	state            protoimpl.MessageState `protogen:"open.v1"`
	EnvelopeTransfer *EnvelopeTransfer      `protobuf:"bytes,1,opt,name=envelopeTransfer,proto3" json:"envelopeTransfer,omitempty"`
	unknownFields    protoimpl.UnknownFields
	sizeCache        protoimpl.SizeCache
}

func (x *GetEnvelopeTransferByIdResponse) Reset() {
	*x = GetEnvelopeTransferByIdResponse{}
	mi := &file_moneydashboard_v4_envelope_transfers_proto_msgTypes[2]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *GetEnvelopeTransferByIdResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetEnvelopeTransferByIdResponse) ProtoMessage() {}

func (x *GetEnvelopeTransferByIdResponse) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_envelope_transfers_proto_msgTypes[2]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetEnvelopeTransferByIdResponse.ProtoReflect.Descriptor instead.
func (*GetEnvelopeTransferByIdResponse) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_envelope_transfers_proto_rawDescGZIP(), []int{2}
}

func (x *GetEnvelopeTransferByIdResponse) GetEnvelopeTransfer() *EnvelopeTransfer {
	if x != nil {
		return x.EnvelopeTransfer
	}
	return nil
}

type GetEnvelopeTransferPageRequest struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Page          int32                  `protobuf:"varint,1,opt,name=page,proto3" json:"page,omitempty"`
	PerPage       int32                  `protobuf:"varint,2,opt,name=per_page,json=perPage,proto3" json:"per_page,omitempty"`
	SearchPattern string                 `protobuf:"bytes,3,opt,name=search_pattern,json=searchPattern,proto3" json:"search_pattern,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *GetEnvelopeTransferPageRequest) Reset() {
	*x = GetEnvelopeTransferPageRequest{}
	mi := &file_moneydashboard_v4_envelope_transfers_proto_msgTypes[3]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *GetEnvelopeTransferPageRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetEnvelopeTransferPageRequest) ProtoMessage() {}

func (x *GetEnvelopeTransferPageRequest) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_envelope_transfers_proto_msgTypes[3]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetEnvelopeTransferPageRequest.ProtoReflect.Descriptor instead.
func (*GetEnvelopeTransferPageRequest) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_envelope_transfers_proto_rawDescGZIP(), []int{3}
}

func (x *GetEnvelopeTransferPageRequest) GetPage() int32 {
	if x != nil {
		return x.Page
	}
	return 0
}

func (x *GetEnvelopeTransferPageRequest) GetPerPage() int32 {
	if x != nil {
		return x.PerPage
	}
	return 0
}

func (x *GetEnvelopeTransferPageRequest) GetSearchPattern() string {
	if x != nil {
		return x.SearchPattern
	}
	return ""
}

type GetEnvelopeTransferPageResponse struct {
	state            protoimpl.MessageState `protogen:"open.v1"`
	Total            int32                  `protobuf:"varint,1,opt,name=total,proto3" json:"total,omitempty"`
	FilteredTotal    int32                  `protobuf:"varint,2,opt,name=filtered_total,json=filteredTotal,proto3" json:"filtered_total,omitempty"`
	FilteredEntities []*EnvelopeTransfer    `protobuf:"bytes,3,rep,name=filtered_entities,json=filteredEntities,proto3" json:"filtered_entities,omitempty"`
	unknownFields    protoimpl.UnknownFields
	sizeCache        protoimpl.SizeCache
}

func (x *GetEnvelopeTransferPageResponse) Reset() {
	*x = GetEnvelopeTransferPageResponse{}
	mi := &file_moneydashboard_v4_envelope_transfers_proto_msgTypes[4]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *GetEnvelopeTransferPageResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetEnvelopeTransferPageResponse) ProtoMessage() {}

func (x *GetEnvelopeTransferPageResponse) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_envelope_transfers_proto_msgTypes[4]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetEnvelopeTransferPageResponse.ProtoReflect.Descriptor instead.
func (*GetEnvelopeTransferPageResponse) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_envelope_transfers_proto_rawDescGZIP(), []int{4}
}

func (x *GetEnvelopeTransferPageResponse) GetTotal() int32 {
	if x != nil {
		return x.Total
	}
	return 0
}

func (x *GetEnvelopeTransferPageResponse) GetFilteredTotal() int32 {
	if x != nil {
		return x.FilteredTotal
	}
	return 0
}

func (x *GetEnvelopeTransferPageResponse) GetFilteredEntities() []*EnvelopeTransfer {
	if x != nil {
		return x.FilteredEntities
	}
	return nil
}

type UpsertEnvelopeTransferRequest struct {
	state            protoimpl.MessageState `protogen:"open.v1"`
	EnvelopeTransfer *EnvelopeTransfer      `protobuf:"bytes,1,opt,name=envelopeTransfer,proto3" json:"envelopeTransfer,omitempty"`
	unknownFields    protoimpl.UnknownFields
	sizeCache        protoimpl.SizeCache
}

func (x *UpsertEnvelopeTransferRequest) Reset() {
	*x = UpsertEnvelopeTransferRequest{}
	mi := &file_moneydashboard_v4_envelope_transfers_proto_msgTypes[5]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *UpsertEnvelopeTransferRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*UpsertEnvelopeTransferRequest) ProtoMessage() {}

func (x *UpsertEnvelopeTransferRequest) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_envelope_transfers_proto_msgTypes[5]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use UpsertEnvelopeTransferRequest.ProtoReflect.Descriptor instead.
func (*UpsertEnvelopeTransferRequest) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_envelope_transfers_proto_rawDescGZIP(), []int{5}
}

func (x *UpsertEnvelopeTransferRequest) GetEnvelopeTransfer() *EnvelopeTransfer {
	if x != nil {
		return x.EnvelopeTransfer
	}
	return nil
}

type UpsertEnvelopeTransferResponse struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *UpsertEnvelopeTransferResponse) Reset() {
	*x = UpsertEnvelopeTransferResponse{}
	mi := &file_moneydashboard_v4_envelope_transfers_proto_msgTypes[6]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *UpsertEnvelopeTransferResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*UpsertEnvelopeTransferResponse) ProtoMessage() {}

func (x *UpsertEnvelopeTransferResponse) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_envelope_transfers_proto_msgTypes[6]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use UpsertEnvelopeTransferResponse.ProtoReflect.Descriptor instead.
func (*UpsertEnvelopeTransferResponse) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_envelope_transfers_proto_rawDescGZIP(), []int{6}
}

type DeleteEnvelopeTransferRequest struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Id            string                 `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *DeleteEnvelopeTransferRequest) Reset() {
	*x = DeleteEnvelopeTransferRequest{}
	mi := &file_moneydashboard_v4_envelope_transfers_proto_msgTypes[7]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *DeleteEnvelopeTransferRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*DeleteEnvelopeTransferRequest) ProtoMessage() {}

func (x *DeleteEnvelopeTransferRequest) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_envelope_transfers_proto_msgTypes[7]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use DeleteEnvelopeTransferRequest.ProtoReflect.Descriptor instead.
func (*DeleteEnvelopeTransferRequest) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_envelope_transfers_proto_rawDescGZIP(), []int{7}
}

func (x *DeleteEnvelopeTransferRequest) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

type DeleteEnvelopeTransferResponse struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *DeleteEnvelopeTransferResponse) Reset() {
	*x = DeleteEnvelopeTransferResponse{}
	mi := &file_moneydashboard_v4_envelope_transfers_proto_msgTypes[8]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *DeleteEnvelopeTransferResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*DeleteEnvelopeTransferResponse) ProtoMessage() {}

func (x *DeleteEnvelopeTransferResponse) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_envelope_transfers_proto_msgTypes[8]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use DeleteEnvelopeTransferResponse.ProtoReflect.Descriptor instead.
func (*DeleteEnvelopeTransferResponse) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_envelope_transfers_proto_rawDescGZIP(), []int{8}
}

var File_moneydashboard_v4_envelope_transfers_proto protoreflect.FileDescriptor

var file_moneydashboard_v4_envelope_transfers_proto_rawDesc = []byte{
	0x0a, 0x2a, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64,
	0x2f, 0x76, 0x34, 0x2f, 0x65, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x5f, 0x74, 0x72, 0x61,
	0x6e, 0x73, 0x66, 0x65, 0x72, 0x73, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x11, 0x6d, 0x6f,
	0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x1a,
	0x21, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2f,
	0x76, 0x34, 0x2f, 0x65, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x73, 0x2e, 0x70, 0x72, 0x6f,
	0x74, 0x6f, 0x22, 0xe4, 0x01, 0x0a, 0x10, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x54,
	0x72, 0x61, 0x6e, 0x73, 0x66, 0x65, 0x72, 0x12, 0x0e, 0x0a, 0x02, 0x69, 0x64, 0x18, 0x01, 0x20,
	0x01, 0x28, 0x09, 0x52, 0x02, 0x69, 0x64, 0x12, 0x12, 0x0a, 0x04, 0x64, 0x61, 0x74, 0x65, 0x18,
	0x02, 0x20, 0x01, 0x28, 0x03, 0x52, 0x04, 0x64, 0x61, 0x74, 0x65, 0x12, 0x14, 0x0a, 0x05, 0x6e,
	0x6f, 0x74, 0x65, 0x73, 0x18, 0x03, 0x20, 0x01, 0x28, 0x09, 0x52, 0x05, 0x6e, 0x6f, 0x74, 0x65,
	0x73, 0x12, 0x16, 0x0a, 0x06, 0x61, 0x6d, 0x6f, 0x75, 0x6e, 0x74, 0x18, 0x04, 0x20, 0x01, 0x28,
	0x01, 0x52, 0x06, 0x61, 0x6d, 0x6f, 0x75, 0x6e, 0x74, 0x12, 0x40, 0x0a, 0x0d, 0x66, 0x72, 0x6f,
	0x6d, 0x5f, 0x65, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x18, 0x05, 0x20, 0x01, 0x28, 0x0b,
	0x32, 0x1b, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72,
	0x64, 0x2e, 0x76, 0x34, 0x2e, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x52, 0x0c, 0x66,
	0x72, 0x6f, 0x6d, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x12, 0x3c, 0x0a, 0x0b, 0x74,
	0x6f, 0x5f, 0x65, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x18, 0x06, 0x20, 0x01, 0x28, 0x0b,
	0x32, 0x1b, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72,
	0x64, 0x2e, 0x76, 0x34, 0x2e, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x52, 0x0a, 0x74,
	0x6f, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x22, 0x30, 0x0a, 0x1e, 0x47, 0x65, 0x74,
	0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x54, 0x72, 0x61, 0x6e, 0x73, 0x66, 0x65, 0x72,
	0x42, 0x79, 0x49, 0x64, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x12, 0x0e, 0x0a, 0x02, 0x69,
	0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x02, 0x69, 0x64, 0x22, 0x72, 0x0a, 0x1f, 0x47,
	0x65, 0x74, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x54, 0x72, 0x61, 0x6e, 0x73, 0x66,
	0x65, 0x72, 0x42, 0x79, 0x49, 0x64, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x4f,
	0x0a, 0x10, 0x65, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x54, 0x72, 0x61, 0x6e, 0x73, 0x66,
	0x65, 0x72, 0x18, 0x01, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x23, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79,
	0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x45, 0x6e, 0x76,
	0x65, 0x6c, 0x6f, 0x70, 0x65, 0x54, 0x72, 0x61, 0x6e, 0x73, 0x66, 0x65, 0x72, 0x52, 0x10, 0x65,
	0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x54, 0x72, 0x61, 0x6e, 0x73, 0x66, 0x65, 0x72, 0x22,
	0x76, 0x0a, 0x1e, 0x47, 0x65, 0x74, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x54, 0x72,
	0x61, 0x6e, 0x73, 0x66, 0x65, 0x72, 0x50, 0x61, 0x67, 0x65, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73,
	0x74, 0x12, 0x12, 0x0a, 0x04, 0x70, 0x61, 0x67, 0x65, 0x18, 0x01, 0x20, 0x01, 0x28, 0x05, 0x52,
	0x04, 0x70, 0x61, 0x67, 0x65, 0x12, 0x19, 0x0a, 0x08, 0x70, 0x65, 0x72, 0x5f, 0x70, 0x61, 0x67,
	0x65, 0x18, 0x02, 0x20, 0x01, 0x28, 0x05, 0x52, 0x07, 0x70, 0x65, 0x72, 0x50, 0x61, 0x67, 0x65,
	0x12, 0x25, 0x0a, 0x0e, 0x73, 0x65, 0x61, 0x72, 0x63, 0x68, 0x5f, 0x70, 0x61, 0x74, 0x74, 0x65,
	0x72, 0x6e, 0x18, 0x03, 0x20, 0x01, 0x28, 0x09, 0x52, 0x0d, 0x73, 0x65, 0x61, 0x72, 0x63, 0x68,
	0x50, 0x61, 0x74, 0x74, 0x65, 0x72, 0x6e, 0x22, 0xb0, 0x01, 0x0a, 0x1f, 0x47, 0x65, 0x74, 0x45,
	0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x54, 0x72, 0x61, 0x6e, 0x73, 0x66, 0x65, 0x72, 0x50,
	0x61, 0x67, 0x65, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x14, 0x0a, 0x05, 0x74,
	0x6f, 0x74, 0x61, 0x6c, 0x18, 0x01, 0x20, 0x01, 0x28, 0x05, 0x52, 0x05, 0x74, 0x6f, 0x74, 0x61,
	0x6c, 0x12, 0x25, 0x0a, 0x0e, 0x66, 0x69, 0x6c, 0x74, 0x65, 0x72, 0x65, 0x64, 0x5f, 0x74, 0x6f,
	0x74, 0x61, 0x6c, 0x18, 0x02, 0x20, 0x01, 0x28, 0x05, 0x52, 0x0d, 0x66, 0x69, 0x6c, 0x74, 0x65,
	0x72, 0x65, 0x64, 0x54, 0x6f, 0x74, 0x61, 0x6c, 0x12, 0x50, 0x0a, 0x11, 0x66, 0x69, 0x6c, 0x74,
	0x65, 0x72, 0x65, 0x64, 0x5f, 0x65, 0x6e, 0x74, 0x69, 0x74, 0x69, 0x65, 0x73, 0x18, 0x03, 0x20,
	0x03, 0x28, 0x0b, 0x32, 0x23, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62,
	0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65,
	0x54, 0x72, 0x61, 0x6e, 0x73, 0x66, 0x65, 0x72, 0x52, 0x10, 0x66, 0x69, 0x6c, 0x74, 0x65, 0x72,
	0x65, 0x64, 0x45, 0x6e, 0x74, 0x69, 0x74, 0x69, 0x65, 0x73, 0x22, 0x70, 0x0a, 0x1d, 0x55, 0x70,
	0x73, 0x65, 0x72, 0x74, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x54, 0x72, 0x61, 0x6e,
	0x73, 0x66, 0x65, 0x72, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x12, 0x4f, 0x0a, 0x10, 0x65,
	0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x54, 0x72, 0x61, 0x6e, 0x73, 0x66, 0x65, 0x72, 0x18,
	0x01, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x23, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73,
	0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f,
	0x70, 0x65, 0x54, 0x72, 0x61, 0x6e, 0x73, 0x66, 0x65, 0x72, 0x52, 0x10, 0x65, 0x6e, 0x76, 0x65,
	0x6c, 0x6f, 0x70, 0x65, 0x54, 0x72, 0x61, 0x6e, 0x73, 0x66, 0x65, 0x72, 0x22, 0x20, 0x0a, 0x1e,
	0x55, 0x70, 0x73, 0x65, 0x72, 0x74, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x54, 0x72,
	0x61, 0x6e, 0x73, 0x66, 0x65, 0x72, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x22, 0x2f,
	0x0a, 0x1d, 0x44, 0x65, 0x6c, 0x65, 0x74, 0x65, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65,
	0x54, 0x72, 0x61, 0x6e, 0x73, 0x66, 0x65, 0x72, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x12,
	0x0e, 0x0a, 0x02, 0x69, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x02, 0x69, 0x64, 0x22,
	0x20, 0x0a, 0x1e, 0x44, 0x65, 0x6c, 0x65, 0x74, 0x65, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70,
	0x65, 0x54, 0x72, 0x61, 0x6e, 0x73, 0x66, 0x65, 0x72, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73,
	0x65, 0x32, 0x9f, 0x04, 0x0a, 0x19, 0x4d, 0x44, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65,
	0x54, 0x72, 0x61, 0x6e, 0x73, 0x66, 0x65, 0x72, 0x53, 0x65, 0x72, 0x76, 0x69, 0x63, 0x65, 0x12,
	0x80, 0x01, 0x0a, 0x17, 0x47, 0x65, 0x74, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x54,
	0x72, 0x61, 0x6e, 0x73, 0x66, 0x65, 0x72, 0x42, 0x79, 0x49, 0x64, 0x12, 0x31, 0x2e, 0x6d, 0x6f,
	0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e,
	0x47, 0x65, 0x74, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x54, 0x72, 0x61, 0x6e, 0x73,
	0x66, 0x65, 0x72, 0x42, 0x79, 0x49, 0x64, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x32,
	0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e,
	0x76, 0x34, 0x2e, 0x47, 0x65, 0x74, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x54, 0x72,
	0x61, 0x6e, 0x73, 0x66, 0x65, 0x72, 0x42, 0x79, 0x49, 0x64, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e,
	0x73, 0x65, 0x12, 0x80, 0x01, 0x0a, 0x17, 0x47, 0x65, 0x74, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f,
	0x70, 0x65, 0x54, 0x72, 0x61, 0x6e, 0x73, 0x66, 0x65, 0x72, 0x50, 0x61, 0x67, 0x65, 0x12, 0x31,
	0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e,
	0x76, 0x34, 0x2e, 0x47, 0x65, 0x74, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x54, 0x72,
	0x61, 0x6e, 0x73, 0x66, 0x65, 0x72, 0x50, 0x61, 0x67, 0x65, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73,
	0x74, 0x1a, 0x32, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61,
	0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x47, 0x65, 0x74, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70,
	0x65, 0x54, 0x72, 0x61, 0x6e, 0x73, 0x66, 0x65, 0x72, 0x50, 0x61, 0x67, 0x65, 0x52, 0x65, 0x73,
	0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x7d, 0x0a, 0x16, 0x55, 0x70, 0x73, 0x65, 0x72, 0x74, 0x45,
	0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x54, 0x72, 0x61, 0x6e, 0x73, 0x66, 0x65, 0x72, 0x12,
	0x30, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64,
	0x2e, 0x76, 0x34, 0x2e, 0x55, 0x70, 0x73, 0x65, 0x72, 0x74, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f,
	0x70, 0x65, 0x54, 0x72, 0x61, 0x6e, 0x73, 0x66, 0x65, 0x72, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73,
	0x74, 0x1a, 0x31, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61,
	0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x55, 0x70, 0x73, 0x65, 0x72, 0x74, 0x45, 0x6e, 0x76, 0x65,
	0x6c, 0x6f, 0x70, 0x65, 0x54, 0x72, 0x61, 0x6e, 0x73, 0x66, 0x65, 0x72, 0x52, 0x65, 0x73, 0x70,
	0x6f, 0x6e, 0x73, 0x65, 0x12, 0x7d, 0x0a, 0x16, 0x44, 0x65, 0x6c, 0x65, 0x74, 0x65, 0x45, 0x6e,
	0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x54, 0x72, 0x61, 0x6e, 0x73, 0x66, 0x65, 0x72, 0x12, 0x30,
	0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e,
	0x76, 0x34, 0x2e, 0x44, 0x65, 0x6c, 0x65, 0x74, 0x65, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70,
	0x65, 0x54, 0x72, 0x61, 0x6e, 0x73, 0x66, 0x65, 0x72, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74,
	0x1a, 0x31, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72,
	0x64, 0x2e, 0x76, 0x34, 0x2e, 0x44, 0x65, 0x6c, 0x65, 0x74, 0x65, 0x45, 0x6e, 0x76, 0x65, 0x6c,
	0x6f, 0x70, 0x65, 0x54, 0x72, 0x61, 0x6e, 0x73, 0x66, 0x65, 0x72, 0x52, 0x65, 0x73, 0x70, 0x6f,
	0x6e, 0x73, 0x65, 0x42, 0x51, 0x5a, 0x4f, 0x67, 0x69, 0x74, 0x68, 0x75, 0x62, 0x2e, 0x63, 0x6f,
	0x6d, 0x2f, 0x6d, 0x61, 0x72, 0x6b, 0x6f, 0x72, 0x6d, 0x65, 0x73, 0x68, 0x65, 0x72, 0x2f, 0x6d,
	0x6f, 0x6e, 0x65, 0x79, 0x2d, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2f, 0x69,
	0x6e, 0x74, 0x65, 0x72, 0x6e, 0x61, 0x6c, 0x2f, 0x61, 0x70, 0x69, 0x5f, 0x67, 0x65, 0x6e, 0x2f,
	0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2f, 0x76,
	0x34, 0x3b, 0x6d, 0x64, 0x76, 0x34, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_moneydashboard_v4_envelope_transfers_proto_rawDescOnce sync.Once
	file_moneydashboard_v4_envelope_transfers_proto_rawDescData = file_moneydashboard_v4_envelope_transfers_proto_rawDesc
)

func file_moneydashboard_v4_envelope_transfers_proto_rawDescGZIP() []byte {
	file_moneydashboard_v4_envelope_transfers_proto_rawDescOnce.Do(func() {
		file_moneydashboard_v4_envelope_transfers_proto_rawDescData = protoimpl.X.CompressGZIP(file_moneydashboard_v4_envelope_transfers_proto_rawDescData)
	})
	return file_moneydashboard_v4_envelope_transfers_proto_rawDescData
}

var file_moneydashboard_v4_envelope_transfers_proto_msgTypes = make([]protoimpl.MessageInfo, 9)
var file_moneydashboard_v4_envelope_transfers_proto_goTypes = []any{
	(*EnvelopeTransfer)(nil),                // 0: moneydashboard.v4.EnvelopeTransfer
	(*GetEnvelopeTransferByIdRequest)(nil),  // 1: moneydashboard.v4.GetEnvelopeTransferByIdRequest
	(*GetEnvelopeTransferByIdResponse)(nil), // 2: moneydashboard.v4.GetEnvelopeTransferByIdResponse
	(*GetEnvelopeTransferPageRequest)(nil),  // 3: moneydashboard.v4.GetEnvelopeTransferPageRequest
	(*GetEnvelopeTransferPageResponse)(nil), // 4: moneydashboard.v4.GetEnvelopeTransferPageResponse
	(*UpsertEnvelopeTransferRequest)(nil),   // 5: moneydashboard.v4.UpsertEnvelopeTransferRequest
	(*UpsertEnvelopeTransferResponse)(nil),  // 6: moneydashboard.v4.UpsertEnvelopeTransferResponse
	(*DeleteEnvelopeTransferRequest)(nil),   // 7: moneydashboard.v4.DeleteEnvelopeTransferRequest
	(*DeleteEnvelopeTransferResponse)(nil),  // 8: moneydashboard.v4.DeleteEnvelopeTransferResponse
	(*Envelope)(nil),                        // 9: moneydashboard.v4.Envelope
}
var file_moneydashboard_v4_envelope_transfers_proto_depIdxs = []int32{
	9, // 0: moneydashboard.v4.EnvelopeTransfer.from_envelope:type_name -> moneydashboard.v4.Envelope
	9, // 1: moneydashboard.v4.EnvelopeTransfer.to_envelope:type_name -> moneydashboard.v4.Envelope
	0, // 2: moneydashboard.v4.GetEnvelopeTransferByIdResponse.envelopeTransfer:type_name -> moneydashboard.v4.EnvelopeTransfer
	0, // 3: moneydashboard.v4.GetEnvelopeTransferPageResponse.filtered_entities:type_name -> moneydashboard.v4.EnvelopeTransfer
	0, // 4: moneydashboard.v4.UpsertEnvelopeTransferRequest.envelopeTransfer:type_name -> moneydashboard.v4.EnvelopeTransfer
	1, // 5: moneydashboard.v4.MDEnvelopeTransferService.GetEnvelopeTransferById:input_type -> moneydashboard.v4.GetEnvelopeTransferByIdRequest
	3, // 6: moneydashboard.v4.MDEnvelopeTransferService.GetEnvelopeTransferPage:input_type -> moneydashboard.v4.GetEnvelopeTransferPageRequest
	5, // 7: moneydashboard.v4.MDEnvelopeTransferService.UpsertEnvelopeTransfer:input_type -> moneydashboard.v4.UpsertEnvelopeTransferRequest
	7, // 8: moneydashboard.v4.MDEnvelopeTransferService.DeleteEnvelopeTransfer:input_type -> moneydashboard.v4.DeleteEnvelopeTransferRequest
	2, // 9: moneydashboard.v4.MDEnvelopeTransferService.GetEnvelopeTransferById:output_type -> moneydashboard.v4.GetEnvelopeTransferByIdResponse
	4, // 10: moneydashboard.v4.MDEnvelopeTransferService.GetEnvelopeTransferPage:output_type -> moneydashboard.v4.GetEnvelopeTransferPageResponse
	6, // 11: moneydashboard.v4.MDEnvelopeTransferService.UpsertEnvelopeTransfer:output_type -> moneydashboard.v4.UpsertEnvelopeTransferResponse
	8, // 12: moneydashboard.v4.MDEnvelopeTransferService.DeleteEnvelopeTransfer:output_type -> moneydashboard.v4.DeleteEnvelopeTransferResponse
	9, // [9:13] is the sub-list for method output_type
	5, // [5:9] is the sub-list for method input_type
	5, // [5:5] is the sub-list for extension type_name
	5, // [5:5] is the sub-list for extension extendee
	0, // [0:5] is the sub-list for field type_name
}

func init() { file_moneydashboard_v4_envelope_transfers_proto_init() }
func file_moneydashboard_v4_envelope_transfers_proto_init() {
	if File_moneydashboard_v4_envelope_transfers_proto != nil {
		return
	}
	file_moneydashboard_v4_envelopes_proto_init()
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_moneydashboard_v4_envelope_transfers_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   9,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_moneydashboard_v4_envelope_transfers_proto_goTypes,
		DependencyIndexes: file_moneydashboard_v4_envelope_transfers_proto_depIdxs,
		MessageInfos:      file_moneydashboard_v4_envelope_transfers_proto_msgTypes,
	}.Build()
	File_moneydashboard_v4_envelope_transfers_proto = out.File
	file_moneydashboard_v4_envelope_transfers_proto_rawDesc = nil
	file_moneydashboard_v4_envelope_transfers_proto_goTypes = nil
	file_moneydashboard_v4_envelope_transfers_proto_depIdxs = nil
}
