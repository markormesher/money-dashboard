// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.36.3
// 	protoc        (unknown)
// source: moneydashboard/v4/users.proto

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

type User struct {
	state            protoimpl.MessageState `protogen:"open.v1"`
	Id               string                 `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	ExternalUsername string                 `protobuf:"bytes,2,opt,name=external_username,json=externalUsername,proto3" json:"external_username,omitempty"`
	DisplayName      string                 `protobuf:"bytes,3,opt,name=display_name,json=displayName,proto3" json:"display_name,omitempty"`
	Deleted          bool                   `protobuf:"varint,4,opt,name=deleted,proto3" json:"deleted,omitempty"`
	ActiveProfile    *Profile               `protobuf:"bytes,5,opt,name=active_profile,json=activeProfile,proto3" json:"active_profile,omitempty"`
	unknownFields    protoimpl.UnknownFields
	sizeCache        protoimpl.SizeCache
}

func (x *User) Reset() {
	*x = User{}
	mi := &file_moneydashboard_v4_users_proto_msgTypes[0]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *User) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*User) ProtoMessage() {}

func (x *User) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_users_proto_msgTypes[0]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use User.ProtoReflect.Descriptor instead.
func (*User) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_users_proto_rawDescGZIP(), []int{0}
}

func (x *User) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

func (x *User) GetExternalUsername() string {
	if x != nil {
		return x.ExternalUsername
	}
	return ""
}

func (x *User) GetDisplayName() string {
	if x != nil {
		return x.DisplayName
	}
	return ""
}

func (x *User) GetDeleted() bool {
	if x != nil {
		return x.Deleted
	}
	return false
}

func (x *User) GetActiveProfile() *Profile {
	if x != nil {
		return x.ActiveProfile
	}
	return nil
}

type GetUserRequest struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *GetUserRequest) Reset() {
	*x = GetUserRequest{}
	mi := &file_moneydashboard_v4_users_proto_msgTypes[1]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *GetUserRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetUserRequest) ProtoMessage() {}

func (x *GetUserRequest) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_users_proto_msgTypes[1]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetUserRequest.ProtoReflect.Descriptor instead.
func (*GetUserRequest) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_users_proto_rawDescGZIP(), []int{1}
}

type GetUserResponse struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	User          *User                  `protobuf:"bytes,1,opt,name=user,proto3" json:"user,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *GetUserResponse) Reset() {
	*x = GetUserResponse{}
	mi := &file_moneydashboard_v4_users_proto_msgTypes[2]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *GetUserResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetUserResponse) ProtoMessage() {}

func (x *GetUserResponse) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_users_proto_msgTypes[2]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetUserResponse.ProtoReflect.Descriptor instead.
func (*GetUserResponse) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_users_proto_rawDescGZIP(), []int{2}
}

func (x *GetUserResponse) GetUser() *User {
	if x != nil {
		return x.User
	}
	return nil
}

type SetActiveProfileRequest struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Profile       *Profile               `protobuf:"bytes,1,opt,name=profile,proto3" json:"profile,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *SetActiveProfileRequest) Reset() {
	*x = SetActiveProfileRequest{}
	mi := &file_moneydashboard_v4_users_proto_msgTypes[3]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *SetActiveProfileRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*SetActiveProfileRequest) ProtoMessage() {}

func (x *SetActiveProfileRequest) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_users_proto_msgTypes[3]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use SetActiveProfileRequest.ProtoReflect.Descriptor instead.
func (*SetActiveProfileRequest) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_users_proto_rawDescGZIP(), []int{3}
}

func (x *SetActiveProfileRequest) GetProfile() *Profile {
	if x != nil {
		return x.Profile
	}
	return nil
}

type SetActiveProfileResponse struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *SetActiveProfileResponse) Reset() {
	*x = SetActiveProfileResponse{}
	mi := &file_moneydashboard_v4_users_proto_msgTypes[4]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *SetActiveProfileResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*SetActiveProfileResponse) ProtoMessage() {}

func (x *SetActiveProfileResponse) ProtoReflect() protoreflect.Message {
	mi := &file_moneydashboard_v4_users_proto_msgTypes[4]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use SetActiveProfileResponse.ProtoReflect.Descriptor instead.
func (*SetActiveProfileResponse) Descriptor() ([]byte, []int) {
	return file_moneydashboard_v4_users_proto_rawDescGZIP(), []int{4}
}

var File_moneydashboard_v4_users_proto protoreflect.FileDescriptor

var file_moneydashboard_v4_users_proto_rawDesc = []byte{
	0x0a, 0x1d, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64,
	0x2f, 0x76, 0x34, 0x2f, 0x75, 0x73, 0x65, 0x72, 0x73, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12,
	0x11, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e,
	0x76, 0x34, 0x1a, 0x20, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61,
	0x72, 0x64, 0x2f, 0x76, 0x34, 0x2f, 0x70, 0x72, 0x6f, 0x66, 0x69, 0x6c, 0x65, 0x73, 0x2e, 0x70,
	0x72, 0x6f, 0x74, 0x6f, 0x22, 0xc3, 0x01, 0x0a, 0x04, 0x55, 0x73, 0x65, 0x72, 0x12, 0x0e, 0x0a,
	0x02, 0x69, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x02, 0x69, 0x64, 0x12, 0x2b, 0x0a,
	0x11, 0x65, 0x78, 0x74, 0x65, 0x72, 0x6e, 0x61, 0x6c, 0x5f, 0x75, 0x73, 0x65, 0x72, 0x6e, 0x61,
	0x6d, 0x65, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x10, 0x65, 0x78, 0x74, 0x65, 0x72, 0x6e,
	0x61, 0x6c, 0x55, 0x73, 0x65, 0x72, 0x6e, 0x61, 0x6d, 0x65, 0x12, 0x21, 0x0a, 0x0c, 0x64, 0x69,
	0x73, 0x70, 0x6c, 0x61, 0x79, 0x5f, 0x6e, 0x61, 0x6d, 0x65, 0x18, 0x03, 0x20, 0x01, 0x28, 0x09,
	0x52, 0x0b, 0x64, 0x69, 0x73, 0x70, 0x6c, 0x61, 0x79, 0x4e, 0x61, 0x6d, 0x65, 0x12, 0x18, 0x0a,
	0x07, 0x64, 0x65, 0x6c, 0x65, 0x74, 0x65, 0x64, 0x18, 0x04, 0x20, 0x01, 0x28, 0x08, 0x52, 0x07,
	0x64, 0x65, 0x6c, 0x65, 0x74, 0x65, 0x64, 0x12, 0x41, 0x0a, 0x0e, 0x61, 0x63, 0x74, 0x69, 0x76,
	0x65, 0x5f, 0x70, 0x72, 0x6f, 0x66, 0x69, 0x6c, 0x65, 0x18, 0x05, 0x20, 0x01, 0x28, 0x0b, 0x32,
	0x1a, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64,
	0x2e, 0x76, 0x34, 0x2e, 0x50, 0x72, 0x6f, 0x66, 0x69, 0x6c, 0x65, 0x52, 0x0d, 0x61, 0x63, 0x74,
	0x69, 0x76, 0x65, 0x50, 0x72, 0x6f, 0x66, 0x69, 0x6c, 0x65, 0x22, 0x10, 0x0a, 0x0e, 0x47, 0x65,
	0x74, 0x55, 0x73, 0x65, 0x72, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x22, 0x3e, 0x0a, 0x0f,
	0x47, 0x65, 0x74, 0x55, 0x73, 0x65, 0x72, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12,
	0x2b, 0x0a, 0x04, 0x75, 0x73, 0x65, 0x72, 0x18, 0x01, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x17, 0x2e,
	0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76,
	0x34, 0x2e, 0x55, 0x73, 0x65, 0x72, 0x52, 0x04, 0x75, 0x73, 0x65, 0x72, 0x22, 0x4f, 0x0a, 0x17,
	0x53, 0x65, 0x74, 0x41, 0x63, 0x74, 0x69, 0x76, 0x65, 0x50, 0x72, 0x6f, 0x66, 0x69, 0x6c, 0x65,
	0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x12, 0x34, 0x0a, 0x07, 0x70, 0x72, 0x6f, 0x66, 0x69,
	0x6c, 0x65, 0x18, 0x01, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x1a, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79,
	0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x50, 0x72, 0x6f,
	0x66, 0x69, 0x6c, 0x65, 0x52, 0x07, 0x70, 0x72, 0x6f, 0x66, 0x69, 0x6c, 0x65, 0x22, 0x1a, 0x0a,
	0x18, 0x53, 0x65, 0x74, 0x41, 0x63, 0x74, 0x69, 0x76, 0x65, 0x50, 0x72, 0x6f, 0x66, 0x69, 0x6c,
	0x65, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x32, 0xce, 0x01, 0x0a, 0x0d, 0x4d, 0x44,
	0x55, 0x73, 0x65, 0x72, 0x53, 0x65, 0x72, 0x76, 0x69, 0x63, 0x65, 0x12, 0x50, 0x0a, 0x07, 0x47,
	0x65, 0x74, 0x55, 0x73, 0x65, 0x72, 0x12, 0x21, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61,
	0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x47, 0x65, 0x74, 0x55, 0x73,
	0x65, 0x72, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x22, 0x2e, 0x6d, 0x6f, 0x6e, 0x65,
	0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x47, 0x65,
	0x74, 0x55, 0x73, 0x65, 0x72, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x6b, 0x0a,
	0x10, 0x53, 0x65, 0x74, 0x41, 0x63, 0x74, 0x69, 0x76, 0x65, 0x50, 0x72, 0x6f, 0x66, 0x69, 0x6c,
	0x65, 0x12, 0x2a, 0x2e, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61,
	0x72, 0x64, 0x2e, 0x76, 0x34, 0x2e, 0x53, 0x65, 0x74, 0x41, 0x63, 0x74, 0x69, 0x76, 0x65, 0x50,
	0x72, 0x6f, 0x66, 0x69, 0x6c, 0x65, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x2b, 0x2e,
	0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2e, 0x76,
	0x34, 0x2e, 0x53, 0x65, 0x74, 0x41, 0x63, 0x74, 0x69, 0x76, 0x65, 0x50, 0x72, 0x6f, 0x66, 0x69,
	0x6c, 0x65, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x42, 0x51, 0x5a, 0x4f, 0x67, 0x69,
	0x74, 0x68, 0x75, 0x62, 0x2e, 0x63, 0x6f, 0x6d, 0x2f, 0x6d, 0x61, 0x72, 0x6b, 0x6f, 0x72, 0x6d,
	0x65, 0x73, 0x68, 0x65, 0x72, 0x2f, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x2d, 0x64, 0x61, 0x73, 0x68,
	0x62, 0x6f, 0x61, 0x72, 0x64, 0x2f, 0x69, 0x6e, 0x74, 0x65, 0x72, 0x6e, 0x61, 0x6c, 0x2f, 0x61,
	0x70, 0x69, 0x5f, 0x67, 0x65, 0x6e, 0x2f, 0x6d, 0x6f, 0x6e, 0x65, 0x79, 0x64, 0x61, 0x73, 0x68,
	0x62, 0x6f, 0x61, 0x72, 0x64, 0x2f, 0x76, 0x34, 0x3b, 0x6d, 0x64, 0x76, 0x34, 0x62, 0x06, 0x70,
	0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_moneydashboard_v4_users_proto_rawDescOnce sync.Once
	file_moneydashboard_v4_users_proto_rawDescData = file_moneydashboard_v4_users_proto_rawDesc
)

func file_moneydashboard_v4_users_proto_rawDescGZIP() []byte {
	file_moneydashboard_v4_users_proto_rawDescOnce.Do(func() {
		file_moneydashboard_v4_users_proto_rawDescData = protoimpl.X.CompressGZIP(file_moneydashboard_v4_users_proto_rawDescData)
	})
	return file_moneydashboard_v4_users_proto_rawDescData
}

var file_moneydashboard_v4_users_proto_msgTypes = make([]protoimpl.MessageInfo, 5)
var file_moneydashboard_v4_users_proto_goTypes = []any{
	(*User)(nil),                     // 0: moneydashboard.v4.User
	(*GetUserRequest)(nil),           // 1: moneydashboard.v4.GetUserRequest
	(*GetUserResponse)(nil),          // 2: moneydashboard.v4.GetUserResponse
	(*SetActiveProfileRequest)(nil),  // 3: moneydashboard.v4.SetActiveProfileRequest
	(*SetActiveProfileResponse)(nil), // 4: moneydashboard.v4.SetActiveProfileResponse
	(*Profile)(nil),                  // 5: moneydashboard.v4.Profile
}
var file_moneydashboard_v4_users_proto_depIdxs = []int32{
	5, // 0: moneydashboard.v4.User.active_profile:type_name -> moneydashboard.v4.Profile
	0, // 1: moneydashboard.v4.GetUserResponse.user:type_name -> moneydashboard.v4.User
	5, // 2: moneydashboard.v4.SetActiveProfileRequest.profile:type_name -> moneydashboard.v4.Profile
	1, // 3: moneydashboard.v4.MDUserService.GetUser:input_type -> moneydashboard.v4.GetUserRequest
	3, // 4: moneydashboard.v4.MDUserService.SetActiveProfile:input_type -> moneydashboard.v4.SetActiveProfileRequest
	2, // 5: moneydashboard.v4.MDUserService.GetUser:output_type -> moneydashboard.v4.GetUserResponse
	4, // 6: moneydashboard.v4.MDUserService.SetActiveProfile:output_type -> moneydashboard.v4.SetActiveProfileResponse
	5, // [5:7] is the sub-list for method output_type
	3, // [3:5] is the sub-list for method input_type
	3, // [3:3] is the sub-list for extension type_name
	3, // [3:3] is the sub-list for extension extendee
	0, // [0:3] is the sub-list for field type_name
}

func init() { file_moneydashboard_v4_users_proto_init() }
func file_moneydashboard_v4_users_proto_init() {
	if File_moneydashboard_v4_users_proto != nil {
		return
	}
	file_moneydashboard_v4_profiles_proto_init()
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_moneydashboard_v4_users_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   5,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_moneydashboard_v4_users_proto_goTypes,
		DependencyIndexes: file_moneydashboard_v4_users_proto_depIdxs,
		MessageInfos:      file_moneydashboard_v4_users_proto_msgTypes,
	}.Build()
	File_moneydashboard_v4_users_proto = out.File
	file_moneydashboard_v4_users_proto_rawDesc = nil
	file_moneydashboard_v4_users_proto_goTypes = nil
	file_moneydashboard_v4_users_proto_depIdxs = nil
}
