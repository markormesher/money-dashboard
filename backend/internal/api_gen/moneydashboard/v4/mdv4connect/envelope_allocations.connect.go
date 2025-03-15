// Code generated by protoc-gen-connect-go. DO NOT EDIT.
//
// Source: moneydashboard/v4/envelope_allocations.proto

package mdv4connect

import (
	connect "connectrpc.com/connect"
	context "context"
	errors "errors"
	v4 "github.com/markormesher/money-dashboard/internal/api_gen/moneydashboard/v4"
	http "net/http"
	strings "strings"
)

// This is a compile-time assertion to ensure that this generated file and the connect package are
// compatible. If you get a compiler error that this constant is not defined, this code was
// generated with a version of connect newer than the one compiled into your binary. You can fix the
// problem by either regenerating this code with an older version of connect or updating the connect
// version compiled into your binary.
const _ = connect.IsAtLeastVersion1_13_0

const (
	// MDEnvelopeAllocationServiceName is the fully-qualified name of the MDEnvelopeAllocationService
	// service.
	MDEnvelopeAllocationServiceName = "moneydashboard.v4.MDEnvelopeAllocationService"
)

// These constants are the fully-qualified names of the RPCs defined in this package. They're
// exposed at runtime as Spec.Procedure and as the final two segments of the HTTP route.
//
// Note that these are different from the fully-qualified method names used by
// google.golang.org/protobuf/reflect/protoreflect. To convert from these constants to
// reflection-formatted method names, remove the leading slash and convert the remaining slash to a
// period.
const (
	// MDEnvelopeAllocationServiceGetEnvelopeAllocationByIdProcedure is the fully-qualified name of the
	// MDEnvelopeAllocationService's GetEnvelopeAllocationById RPC.
	MDEnvelopeAllocationServiceGetEnvelopeAllocationByIdProcedure = "/moneydashboard.v4.MDEnvelopeAllocationService/GetEnvelopeAllocationById"
	// MDEnvelopeAllocationServiceGetAllEnvelopeAllocationsProcedure is the fully-qualified name of the
	// MDEnvelopeAllocationService's GetAllEnvelopeAllocations RPC.
	MDEnvelopeAllocationServiceGetAllEnvelopeAllocationsProcedure = "/moneydashboard.v4.MDEnvelopeAllocationService/GetAllEnvelopeAllocations"
	// MDEnvelopeAllocationServiceUpsertEnvelopeAllocationProcedure is the fully-qualified name of the
	// MDEnvelopeAllocationService's UpsertEnvelopeAllocation RPC.
	MDEnvelopeAllocationServiceUpsertEnvelopeAllocationProcedure = "/moneydashboard.v4.MDEnvelopeAllocationService/UpsertEnvelopeAllocation"
)

// MDEnvelopeAllocationServiceClient is a client for the
// moneydashboard.v4.MDEnvelopeAllocationService service.
type MDEnvelopeAllocationServiceClient interface {
	GetEnvelopeAllocationById(context.Context, *connect.Request[v4.GetEnvelopeAllocationByIdRequest]) (*connect.Response[v4.GetEnvelopeAllocationByIdResponse], error)
	GetAllEnvelopeAllocations(context.Context, *connect.Request[v4.GetAllEnvelopeAllocationsRequest]) (*connect.Response[v4.GetAllEnvelopeAllocationsResponse], error)
	UpsertEnvelopeAllocation(context.Context, *connect.Request[v4.UpsertEnvelopeAllocationRequest]) (*connect.Response[v4.UpsertEnvelopeAllocationResponse], error)
}

// NewMDEnvelopeAllocationServiceClient constructs a client for the
// moneydashboard.v4.MDEnvelopeAllocationService service. By default, it uses the Connect protocol
// with the binary Protobuf Codec, asks for gzipped responses, and sends uncompressed requests. To
// use the gRPC or gRPC-Web protocols, supply the connect.WithGRPC() or connect.WithGRPCWeb()
// options.
//
// The URL supplied here should be the base URL for the Connect or gRPC server (for example,
// http://api.acme.com or https://acme.com/grpc).
func NewMDEnvelopeAllocationServiceClient(httpClient connect.HTTPClient, baseURL string, opts ...connect.ClientOption) MDEnvelopeAllocationServiceClient {
	baseURL = strings.TrimRight(baseURL, "/")
	mDEnvelopeAllocationServiceMethods := v4.File_moneydashboard_v4_envelope_allocations_proto.Services().ByName("MDEnvelopeAllocationService").Methods()
	return &mDEnvelopeAllocationServiceClient{
		getEnvelopeAllocationById: connect.NewClient[v4.GetEnvelopeAllocationByIdRequest, v4.GetEnvelopeAllocationByIdResponse](
			httpClient,
			baseURL+MDEnvelopeAllocationServiceGetEnvelopeAllocationByIdProcedure,
			connect.WithSchema(mDEnvelopeAllocationServiceMethods.ByName("GetEnvelopeAllocationById")),
			connect.WithClientOptions(opts...),
		),
		getAllEnvelopeAllocations: connect.NewClient[v4.GetAllEnvelopeAllocationsRequest, v4.GetAllEnvelopeAllocationsResponse](
			httpClient,
			baseURL+MDEnvelopeAllocationServiceGetAllEnvelopeAllocationsProcedure,
			connect.WithSchema(mDEnvelopeAllocationServiceMethods.ByName("GetAllEnvelopeAllocations")),
			connect.WithClientOptions(opts...),
		),
		upsertEnvelopeAllocation: connect.NewClient[v4.UpsertEnvelopeAllocationRequest, v4.UpsertEnvelopeAllocationResponse](
			httpClient,
			baseURL+MDEnvelopeAllocationServiceUpsertEnvelopeAllocationProcedure,
			connect.WithSchema(mDEnvelopeAllocationServiceMethods.ByName("UpsertEnvelopeAllocation")),
			connect.WithClientOptions(opts...),
		),
	}
}

// mDEnvelopeAllocationServiceClient implements MDEnvelopeAllocationServiceClient.
type mDEnvelopeAllocationServiceClient struct {
	getEnvelopeAllocationById *connect.Client[v4.GetEnvelopeAllocationByIdRequest, v4.GetEnvelopeAllocationByIdResponse]
	getAllEnvelopeAllocations *connect.Client[v4.GetAllEnvelopeAllocationsRequest, v4.GetAllEnvelopeAllocationsResponse]
	upsertEnvelopeAllocation  *connect.Client[v4.UpsertEnvelopeAllocationRequest, v4.UpsertEnvelopeAllocationResponse]
}

// GetEnvelopeAllocationById calls
// moneydashboard.v4.MDEnvelopeAllocationService.GetEnvelopeAllocationById.
func (c *mDEnvelopeAllocationServiceClient) GetEnvelopeAllocationById(ctx context.Context, req *connect.Request[v4.GetEnvelopeAllocationByIdRequest]) (*connect.Response[v4.GetEnvelopeAllocationByIdResponse], error) {
	return c.getEnvelopeAllocationById.CallUnary(ctx, req)
}

// GetAllEnvelopeAllocations calls
// moneydashboard.v4.MDEnvelopeAllocationService.GetAllEnvelopeAllocations.
func (c *mDEnvelopeAllocationServiceClient) GetAllEnvelopeAllocations(ctx context.Context, req *connect.Request[v4.GetAllEnvelopeAllocationsRequest]) (*connect.Response[v4.GetAllEnvelopeAllocationsResponse], error) {
	return c.getAllEnvelopeAllocations.CallUnary(ctx, req)
}

// UpsertEnvelopeAllocation calls
// moneydashboard.v4.MDEnvelopeAllocationService.UpsertEnvelopeAllocation.
func (c *mDEnvelopeAllocationServiceClient) UpsertEnvelopeAllocation(ctx context.Context, req *connect.Request[v4.UpsertEnvelopeAllocationRequest]) (*connect.Response[v4.UpsertEnvelopeAllocationResponse], error) {
	return c.upsertEnvelopeAllocation.CallUnary(ctx, req)
}

// MDEnvelopeAllocationServiceHandler is an implementation of the
// moneydashboard.v4.MDEnvelopeAllocationService service.
type MDEnvelopeAllocationServiceHandler interface {
	GetEnvelopeAllocationById(context.Context, *connect.Request[v4.GetEnvelopeAllocationByIdRequest]) (*connect.Response[v4.GetEnvelopeAllocationByIdResponse], error)
	GetAllEnvelopeAllocations(context.Context, *connect.Request[v4.GetAllEnvelopeAllocationsRequest]) (*connect.Response[v4.GetAllEnvelopeAllocationsResponse], error)
	UpsertEnvelopeAllocation(context.Context, *connect.Request[v4.UpsertEnvelopeAllocationRequest]) (*connect.Response[v4.UpsertEnvelopeAllocationResponse], error)
}

// NewMDEnvelopeAllocationServiceHandler builds an HTTP handler from the service implementation. It
// returns the path on which to mount the handler and the handler itself.
//
// By default, handlers support the Connect, gRPC, and gRPC-Web protocols with the binary Protobuf
// and JSON codecs. They also support gzip compression.
func NewMDEnvelopeAllocationServiceHandler(svc MDEnvelopeAllocationServiceHandler, opts ...connect.HandlerOption) (string, http.Handler) {
	mDEnvelopeAllocationServiceMethods := v4.File_moneydashboard_v4_envelope_allocations_proto.Services().ByName("MDEnvelopeAllocationService").Methods()
	mDEnvelopeAllocationServiceGetEnvelopeAllocationByIdHandler := connect.NewUnaryHandler(
		MDEnvelopeAllocationServiceGetEnvelopeAllocationByIdProcedure,
		svc.GetEnvelopeAllocationById,
		connect.WithSchema(mDEnvelopeAllocationServiceMethods.ByName("GetEnvelopeAllocationById")),
		connect.WithHandlerOptions(opts...),
	)
	mDEnvelopeAllocationServiceGetAllEnvelopeAllocationsHandler := connect.NewUnaryHandler(
		MDEnvelopeAllocationServiceGetAllEnvelopeAllocationsProcedure,
		svc.GetAllEnvelopeAllocations,
		connect.WithSchema(mDEnvelopeAllocationServiceMethods.ByName("GetAllEnvelopeAllocations")),
		connect.WithHandlerOptions(opts...),
	)
	mDEnvelopeAllocationServiceUpsertEnvelopeAllocationHandler := connect.NewUnaryHandler(
		MDEnvelopeAllocationServiceUpsertEnvelopeAllocationProcedure,
		svc.UpsertEnvelopeAllocation,
		connect.WithSchema(mDEnvelopeAllocationServiceMethods.ByName("UpsertEnvelopeAllocation")),
		connect.WithHandlerOptions(opts...),
	)
	return "/moneydashboard.v4.MDEnvelopeAllocationService/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case MDEnvelopeAllocationServiceGetEnvelopeAllocationByIdProcedure:
			mDEnvelopeAllocationServiceGetEnvelopeAllocationByIdHandler.ServeHTTP(w, r)
		case MDEnvelopeAllocationServiceGetAllEnvelopeAllocationsProcedure:
			mDEnvelopeAllocationServiceGetAllEnvelopeAllocationsHandler.ServeHTTP(w, r)
		case MDEnvelopeAllocationServiceUpsertEnvelopeAllocationProcedure:
			mDEnvelopeAllocationServiceUpsertEnvelopeAllocationHandler.ServeHTTP(w, r)
		default:
			http.NotFound(w, r)
		}
	})
}

// UnimplementedMDEnvelopeAllocationServiceHandler returns CodeUnimplemented from all methods.
type UnimplementedMDEnvelopeAllocationServiceHandler struct{}

func (UnimplementedMDEnvelopeAllocationServiceHandler) GetEnvelopeAllocationById(context.Context, *connect.Request[v4.GetEnvelopeAllocationByIdRequest]) (*connect.Response[v4.GetEnvelopeAllocationByIdResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, errors.New("moneydashboard.v4.MDEnvelopeAllocationService.GetEnvelopeAllocationById is not implemented"))
}

func (UnimplementedMDEnvelopeAllocationServiceHandler) GetAllEnvelopeAllocations(context.Context, *connect.Request[v4.GetAllEnvelopeAllocationsRequest]) (*connect.Response[v4.GetAllEnvelopeAllocationsResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, errors.New("moneydashboard.v4.MDEnvelopeAllocationService.GetAllEnvelopeAllocations is not implemented"))
}

func (UnimplementedMDEnvelopeAllocationServiceHandler) UpsertEnvelopeAllocation(context.Context, *connect.Request[v4.UpsertEnvelopeAllocationRequest]) (*connect.Response[v4.UpsertEnvelopeAllocationResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, errors.New("moneydashboard.v4.MDEnvelopeAllocationService.UpsertEnvelopeAllocation is not implemented"))
}
