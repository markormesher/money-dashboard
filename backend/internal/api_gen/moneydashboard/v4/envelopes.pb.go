// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.36.3
// 	protoc        (unknown)
// source: moneydashboard/v4/envelopes.proto

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

type Envelope struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Id            string                 `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	Name          string                 `protobuf:"bytes,2,opt,name=name,proto3" json:"name,omitempty"`
	Active        bool                   `protobuf:"varint,3,opt,name=active,proto3" json:"active,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *Envelope) Reset() {
	*x = Envelope{}
	mi := &file_moneydashboard_v4_envelopes_proto_msgTypes[0]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *Envelope) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Envelope) ProtoMessage() {}

func (x *Envelope) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_envelopes_proto_msgTypes[0]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Envelope.ProtoReflect.Descriptor instead.
func (*Envelope) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_envelopes_proto_rawDescGZIP(), []int{0}
}

func (x *Envelope) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

func (x *Envelope) GetName() string {
	if x != nil {
		return x.Name
	}
	return ""
}

func (x *Envelope) GetActive() bool {
	if x != nil {
		return x.Active
	}
	return false
}

type GetEnvelopeByIdRequest struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Id            string                 `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *GetEnvelopeByIdRequest) Reset() {
	*x = GetEnvelopeByIdRequest{}
	mi := &file_moneydashboard_v4_envelopes_proto_msgTypes[1]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *GetEnvelopeByIdRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetEnvelopeByIdRequest) ProtoMessage() {}

func (x *GetEnvelopeByIdRequest) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_envelopes_proto_msgTypes[1]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetEnvelopeByIdRequest.ProtoReflect.Descriptor instead.
func (*GetEnvelopeByIdRequest) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_envelopes_proto_rawDescGZIP(), []int{1}
}

func (x *GetEnvelopeByIdRequest) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

type GetEnvelopeByIdResponse struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Envelope      *Envelope              `protobuf:"bytes,1,opt,name=envelope,proto3" json:"envelope,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *GetEnvelopeByIdResponse) Reset() {
	*x = GetEnvelopeByIdResponse{}
	mi := &file_moneydashboard_v4_envelopes_proto_msgTypes[2]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *GetEnvelopeByIdResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetEnvelopeByIdResponse) ProtoMessage() {}

func (x *GetEnvelopeByIdResponse) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_envelopes_proto_msgTypes[2]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetEnvelopeByIdResponse.ProtoReflect.Descriptor instead.
func (*GetEnvelopeByIdResponse) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_envelopes_proto_rawDescGZIP(), []int{2}
}

func (x *GetEnvelopeByIdResponse) GetEnvelope() *Envelope {
	if x != nil {
		return x.Envelope
	}
	return nil
}

type GetAllEnvelopesRequest struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *GetAllEnvelopesRequest) Reset() {
	*x = GetAllEnvelopesRequest{}
	mi := &file_moneydashboard_v4_envelopes_proto_msgTypes[3]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *GetAllEnvelopesRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetAllEnvelopesRequest) ProtoMessage() {}

func (x *GetAllEnvelopesRequest) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_envelopes_proto_msgTypes[3]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetAllEnvelopesRequest.ProtoReflect.Descriptor instead.
func (*GetAllEnvelopesRequest) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_envelopes_proto_rawDescGZIP(), []int{3}
}

type GetAllEnvelopesResponse struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Envelopes     []*Envelope            `protobuf:"bytes,1,rep,name=envelopes,proto3" json:"envelopes,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *GetAllEnvelopesResponse) Reset() {
	*x = GetAllEnvelopesResponse{}
	mi := &file_moneydashboard_v4_envelopes_proto_msgTypes[4]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *GetAllEnvelopesResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetAllEnvelopesResponse) ProtoMessage() {}

func (x *GetAllEnvelopesResponse) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_envelopes_proto_msgTypes[4]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetAllEnvelopesResponse.ProtoReflect.Descriptor instead.
func (*GetAllEnvelopesResponse) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_envelopes_proto_rawDescGZIP(), []int{4}
}

func (x *GetAllEnvelopesResponse) GetEnvelopes() []*Envelope {
	if x != nil {
		return x.Envelopes
	}
	return nil
}

type UpsertEnvelopeRequest struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Envelope      *Envelope              `protobuf:"bytes,1,opt,name=envelope,proto3" json:"envelope,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *UpsertEnvelopeRequest) Reset() {
	*x = UpsertEnvelopeRequest{}
	mi := &file_moneydashboard_v4_envelopes_proto_msgTypes[5]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *UpsertEnvelopeRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*UpsertEnvelopeRequest) ProtoMessage() {}

func (x *UpsertEnvelopeRequest) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_envelopes_proto_msgTypes[5]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use UpsertEnvelopeRequest.ProtoReflect.Descriptor instead.
func (*UpsertEnvelopeRequest) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_envelopes_proto_rawDescGZIP(), []int{5}
}

func (x *UpsertEnvelopeRequest) GetEnvelope() *Envelope {
	if x != nil {
		return x.Envelope
	}
	return nil
}

type UpsertEnvelopeResponse struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *UpsertEnvelopeResponse) Reset() {
	*x = UpsertEnvelopeResponse{}
	mi := &file_moneydashboard_v4_envelopes_proto_msgTypes[6]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *UpsertEnvelopeResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*UpsertEnvelopeResponse) ProtoMessage() {}

func (x *UpsertEnvelopeResponse) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_envelopes_proto_msgTypes[6]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use UpsertEnvelopeResponse.ProtoReflect.Descriptor instead.
func (*UpsertEnvelopeResponse) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_envelopes_proto_rawDescGZIP(), []int{6}
}

var File_moneydashboard_v4_envelopes_proto protoreflect.FileDescriptor

var file_moneydashboard_v4_envelopes_proto_rawDesc = []byte{
	0x0a, 0x21, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64,
	0x2f, 0x76, 0x34, 0x2f, 0x65, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x73, 0x2e, 0x70, 0x72,
	0x6f, 0x74, 0x6f, 0x12, 0x11, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f,
	0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x22, 0x46, 0x0a, 0x08, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f,
	0x70, 0x65, 0x12, 0x0e, 0x0a, 0x02, 0x69, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x02,
	0x69, 0x64, 0x12, 0x12, 0x0a, 0x04, 0x6e, 0x61, 0x6d, 0x65, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09,
	0x52, 0x04, 0x6e, 0x61, 0x6d, 0x65, 0x12, 0x16, 0x0a, 0x06, 0x61, 0x63, 0x74, 0x69, 0x76, 0x65,
	0x18, 0x03, 0x20, 0x01, 0x28, 0x08, 0x52, 0x06, 0x61, 0x63, 0x74, 0x69, 0x76, 0x65, 0x22, 0x28,
	0x0a, 0x16, 0x47, 0x65, 0x74, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x42, 0x79, 0x49,
	0x64, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x12, 0x0e, 0x0a, 0x02, 0x69, 0x64, 0x18, 0x01,
	0x20, 0x01, 0x28, 0x09, 0x52, 0x02, 0x69, 0x64, 0x22, 0x52, 0x0a, 0x17, 0x47, 0x65, 0x74, 0x45,
	0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x42, 0x79, 0x49, 0x64, 0x52, 0x65, 0x73, 0x70, 0x6f,
	0x6e, 0x73, 0x65, 0x12, 0x37, 0x0a, 0x08, 0x65, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x18,
	0x01, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x1b, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73,
	0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f,
	0x70, 0x65, 0x52, 0x08, 0x65, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x22, 0x18, 0x0a, 0x16,
	0x47, 0x65, 0x74, 0x41, 0x6c, 0x6c, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x73, 0x52,
	0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x22, 0x54, 0x0a, 0x17, 0x47, 0x65, 0x74, 0x41, 0x6c, 0x6c,
	0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x73, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73,
	0x65, 0x12, 0x39, 0x0a, 0x09, 0x65, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x73, 0x18, 0x01,
	0x20, 0x03, 0x28, 0x0b, 0x32, 0x1b, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68,
	0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70,
	0x65, 0x52, 0x09, 0x65, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x73, 0x22, 0x50, 0x0a, 0x15,
	0x55, 0x70, 0x73, 0x65, 0x72, 0x74, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x52, 0x65,
	0x71, 0x75, 0x65, 0x73, 0x74, 0x12, 0x37, 0x0a, 0x08, 0x65, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70,
	0x65, 0x18, 0x01, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x1b, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64,
	0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x45, 0x6e, 0x76, 0x65,
	0x6c, 0x6f, 0x70, 0x65, 0x52, 0x08, 0x65, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x22, 0x18,
	0x0a, 0x16, 0x55, 0x70, 0x73, 0x65, 0x72, 0x74, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65,
	0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x32, 0xce, 0x02, 0x0a, 0x11, 0x4d, 0x44, 0x45,
	0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x53, 0x65, 0x72, 0x76, 0x69, 0x63, 0x65, 0x12, 0x68,
	0x0a, 0x0f, 0x47, 0x65, 0x74, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x42, 0x79, 0x49,
	0x64, 0x12, 0x29, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61,
	0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x47, 0x65, 0x74, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70,
	0x65, 0x42, 0x79, 0x49, 0x64, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x2a, 0x2e, 0x6d,
	0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76, 0x34,
	0x2e, 0x47, 0x65, 0x74, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x42, 0x79, 0x49, 0x64,
	0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x68, 0x0a, 0x0f, 0x47, 0x65, 0x74, 0x41,
	0x6c, 0x6c, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x73, 0x12, 0x29, 0x2e, 0x6d, 0x6f,
	0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e,
	0x47, 0x65, 0x74, 0x41, 0x6c, 0x6c, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x73, 0x52,
	0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x2a, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61,
	0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x47, 0x65, 0x74, 0x41, 0x6c,
	0x6c, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x73, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e,
	0x73, 0x65, 0x12, 0x65, 0x0a, 0x0e, 0x55, 0x70, 0x73, 0x65, 0x72, 0x74, 0x45, 0x6e, 0x76, 0x65,
	0x6c, 0x6f, 0x70, 0x65, 0x12, 0x28, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68,
	0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x55, 0x70, 0x73, 0x65, 0x72, 0x74, 0x45,
	0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70, 0x65, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x29,
	0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e,
	0x76, 0x34, 0x2e, 0x55, 0x70, 0x73, 0x65, 0x72, 0x74, 0x45, 0x6e, 0x76, 0x65, 0x6c, 0x6f, 0x70,
	0x65, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x42, 0x51, 0x5a, 0x4f, 0x67, 0x69, 0x74,
	0x68, 0x75, 0x62, 0x2e, 0x63, 0x6f, 0x6d, 0x2f, 0x6d, 0x61, 0x72, 0x6b, 0x6f, 0x72, 0x6d, 0x65,
	0x73, 0x68, 0x65, 0x72, 0x2f, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x2d, 0x64, 0x61, 0x73, 0x68, 0x62,
	0x6f, 0x61, 0x72, 0x64, 0x2f, 0x69, 0x6e, 0x74, 0x65, 0x72, 0x6e, 0x61, 0x6c, 0x2f, 0x61, 0x70,
	0x69, 0x5f, 0x67, 0x65, 0x6e, 0x2f, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62,
	0x6f, 0x61, 0x72, 0x64, 0x2f, 0x76, 0x34, 0x3b, 0x6d, 0x64, 0x76, 0x34, 0x62, 0x06, 0x70, 0x72,
	0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_moneydashboard_v4_envelopes_proto_rawDescOnce sync.Once
	file_moneydashboard_v4_envelopes_proto_rawDescData = file_moneydashboard_v4_envelopes_proto_rawDesc
)

func file_moneydashboard_v4_envelopes_proto_rawDescGZIP() []byte {
	file_moneydashboard_v4_envelopes_proto_rawDescOnce.Do(func() {
		file_moneydashboard_v4_envelopes_proto_rawDescData = protoimpl.X.CompressGZIP(file_moneydashboard_v4_envelopes_proto_rawDescData)
	})
	return file_moneydashboard_v4_envelopes_proto_rawDescData
}

var file_moneydashboard_v4_envelopes_proto_msgTypes = make([]protoimpl.MessageInfo, 7)
var file_moneydashboard_v4_envelopes_proto_goTypes = []any{
	(*Envelope)(nil),                // 0: moneydashboard.v4.Envelope
	(*GetEnvelopeByIdRequest)(nil),  // 1: moneydashboard.v4.GetEnvelopeByIdRequest
	(*GetEnvelopeByIdResponse)(nil), // 2: moneydashboard.v4.GetEnvelopeByIdResponse
	(*GetAllEnvelopesRequest)(nil),  // 3: moneydashboard.v4.GetAllEnvelopesRequest
	(*GetAllEnvelopesResponse)(nil), // 4: moneydashboard.v4.GetAllEnvelopesResponse
	(*UpsertEnvelopeRequest)(nil),   // 5: moneydashboard.v4.UpsertEnvelopeRequest
	(*UpsertEnvelopeResponse)(nil),  // 6: moneydashboard.v4.UpsertEnvelopeResponse
}
var file_moneydashboard_v4_envelopes_proto_depIdxs = []int32{
	0, // 0: moneydashboard.v4.GetEnvelopeByIdResponse.envelope:type_name -> moneydashboard.v4.Envelope
	0, // 1: moneydashboard.v4.GetAllEnvelopesResponse.envelopes:type_name -> moneydashboard.v4.Envelope
	0, // 2: moneydashboard.v4.UpsertEnvelopeRequest.envelope:type_name -> moneydashboard.v4.Envelope
	1, // 3: moneydashboard.v4.MDEnvelopeService.GetEnvelopeById:input_type -> moneydashboard.v4.GetEnvelopeByIdRequest
	3, // 4: moneydashboard.v4.MDEnvelopeService.GetAllEnvelopes:input_type -> moneydashboard.v4.GetAllEnvelopesRequest
	5, // 5: moneydashboard.v4.MDEnvelopeService.UpsertEnvelope:input_type -> moneydashboard.v4.UpsertEnvelopeRequest
	2, // 6: moneydashboard.v4.MDEnvelopeService.GetEnvelopeById:output_type -> moneydashboard.v4.GetEnvelopeByIdResponse
	4, // 7: moneydashboard.v4.MDEnvelopeService.GetAllEnvelopes:output_type -> moneydashboard.v4.GetAllEnvelopesResponse
	6, // 8: moneydashboard.v4.MDEnvelopeService.UpsertEnvelope:output_type -> moneydashboard.v4.UpsertEnvelopeResponse
	6, // [6:9] is the sub-list for method output_type
	3, // [3:6] is the sub-list for method input_type
	3, // [3:3] is the sub-list for extension type_name
	3, // [3:3] is the sub-list for extension extendee
	0, // [0:3] is the sub-list for field type_name
}

func init() { file_moneydashboard_v4_envelopes_proto_init() }
func file_moneydashboard_v4_envelopes_proto_init() {
	if File_moneydashboard_v4_envelopes_proto != nil {
		return
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_moneydashboard_v4_envelopes_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   7,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_moneydashboard_v4_envelopes_proto_goTypes,
		DependencyIndexes: file_moneydashboard_v4_envelopes_proto_depIdxs,
		MessageInfos:      file_moneydashboard_v4_envelopes_proto_msgTypes,
	}.Build()
	File_moneydashboard_v4_envelopes_proto = out.File
	file_moneydashboard_v4_envelopes_proto_rawDesc = nil
	file_moneydashboard_v4_envelopes_proto_goTypes = nil
	file_moneydashboard_v4_envelopes_proto_depIdxs = nil
}
