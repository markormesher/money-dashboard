// Code generated by protoc-gen-connect-go. DO NOT EDIT.
//
// Source: moneydashboard/v4/envelopes.proto

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
	// MDEnvelopeServiceName is the fully-qualified name of the MDEnvelopeService service.
	MDEnvelopeServiceName = "moneydashboard.v4.MDEnvelopeService"
)

// These constants are the fully-qualified names of the RPCs defined in this package. They're
// exposed at runtime as Spec.Procedure and as the final two segments of the HTTP route.
//
// Note that these are different from the fully-qualified method names used by
// google.golang.org/protobuf/reflect/protoreflect. To convert from these constants to
// reflection-formatted method names, remove the leading slash and convert the remaining slash to a
// period.
const (
	// MDEnvelopeServiceGetEnvelopeByIdProcedure is the fully-qualified name of the MDEnvelopeService's
	// GetEnvelopeById RPC.
	MDEnvelopeServiceGetEnvelopeByIdProcedure = "/moneydashboard.v4.MDEnvelopeService/GetEnvelopeById"
	// MDEnvelopeServiceGetAllEnvelopesProcedure is the fully-qualified name of the MDEnvelopeService's
	// GetAllEnvelopes RPC.
	MDEnvelopeServiceGetAllEnvelopesProcedure = "/moneydashboard.v4.MDEnvelopeService/GetAllEnvelopes"
	// MDEnvelopeServiceUpsertEnvelopeProcedure is the fully-qualified name of the MDEnvelopeService's
	// UpsertEnvelope RPC.
	MDEnvelopeServiceUpsertEnvelopeProcedure = "/moneydashboard.v4.MDEnvelopeService/UpsertEnvelope"
)

// MDEnvelopeServiceClient is a client for the moneydashboard.v4.MDEnvelopeService service.
type MDEnvelopeServiceClient interface {
	GetEnvelopeById(context.Context, *connect.Request[v4.GetEnvelopeByIdRequest]) (*connect.Response[v4.GetEnvelopeByIdResponse], error)
	GetAllEnvelopes(context.Context, *connect.Request[v4.GetAllEnvelopesRequest]) (*connect.Response[v4.GetAllEnvelopesResponse], error)
	UpsertEnvelope(context.Context, *connect.Request[v4.UpsertEnvelopeRequest]) (*connect.Response[v4.UpsertEnvelopeResponse], error)
}

// NewMDEnvelopeServiceClient constructs a client for the moneydashboard.v4.MDEnvelopeService
// service. By default, it uses the Connect protocol with the binary Protobuf Codec, asks for
// gzipped responses, and sends uncompressed requests. To use the gRPC or gRPC-Web protocols, supply
// the connect.WithGRPC() or connect.WithGRPCWeb() options.
//
// The URL supplied here should be the base URL for the Connect or gRPC server (for example,
// http://api.acme.com or https://acme.com/grpc).
func NewMDEnvelopeServiceClient(httpClient connect.HTTPClient, baseURL string, opts ...connect.ClientOption) MDEnvelopeServiceClient {
	baseURL = strings.TrimRight(baseURL, "/")
	mDEnvelopeServiceMethods := v4.File_moneydashboard_v4_envelopes_proto.Services().ByName("MDEnvelopeService").Methods()
	return &mDEnvelopeServiceClient{
		getEnvelopeById: connect.NewClient[v4.GetEnvelopeByIdRequest, v4.GetEnvelopeByIdResponse](
			httpClient,
			baseURL+MDEnvelopeServiceGetEnvelopeByIdProcedure,
			connect.WithSchema(mDEnvelopeServiceMethods.ByName("GetEnvelopeById")),
			connect.WithClientOptions(opts...),
		),
		getAllEnvelopes: connect.NewClient[v4.GetAllEnvelopesRequest, v4.GetAllEnvelopesResponse](
			httpClient,
			baseURL+MDEnvelopeServiceGetAllEnvelopesProcedure,
			connect.WithSchema(mDEnvelopeServiceMethods.ByName("GetAllEnvelopes")),
			connect.WithClientOptions(opts...),
		),
		upsertEnvelope: connect.NewClient[v4.UpsertEnvelopeRequest, v4.UpsertEnvelopeResponse](
			httpClient,
			baseURL+MDEnvelopeServiceUpsertEnvelopeProcedure,
			connect.WithSchema(mDEnvelopeServiceMethods.ByName("UpsertEnvelope")),
			connect.WithClientOptions(opts...),
		),
	}
}

// mDEnvelopeServiceClient implements MDEnvelopeServiceClient.
type mDEnvelopeServiceClient struct {
	getEnvelopeById *connect.Client[v4.GetEnvelopeByIdRequest, v4.GetEnvelopeByIdResponse]
	getAllEnvelopes *connect.Client[v4.GetAllEnvelopesRequest, v4.GetAllEnvelopesResponse]
	upsertEnvelope  *connect.Client[v4.UpsertEnvelopeRequest, v4.UpsertEnvelopeResponse]
}

// GetEnvelopeById calls moneydashboard.v4.MDEnvelopeService.GetEnvelopeById.
func (c *mDEnvelopeServiceClient) GetEnvelopeById(ctx context.Context, req *connect.Request[v4.GetEnvelopeByIdRequest]) (*connect.Response[v4.GetEnvelopeByIdResponse], error) {
	return c.getEnvelopeById.CallUnary(ctx, req)
}

// GetAllEnvelopes calls moneydashboard.v4.MDEnvelopeService.GetAllEnvelopes.
func (c *mDEnvelopeServiceClient) GetAllEnvelopes(ctx context.Context, req *connect.Request[v4.GetAllEnvelopesRequest]) (*connect.Response[v4.GetAllEnvelopesResponse], error) {
	return c.getAllEnvelopes.CallUnary(ctx, req)
}

// UpsertEnvelope calls moneydashboard.v4.MDEnvelopeService.UpsertEnvelope.
func (c *mDEnvelopeServiceClient) UpsertEnvelope(ctx context.Context, req *connect.Request[v4.UpsertEnvelopeRequest]) (*connect.Response[v4.UpsertEnvelopeResponse], error) {
	return c.upsertEnvelope.CallUnary(ctx, req)
}

// MDEnvelopeServiceHandler is an implementation of the moneydashboard.v4.MDEnvelopeService service.
type MDEnvelopeServiceHandler interface {
	GetEnvelopeById(context.Context, *connect.Request[v4.GetEnvelopeByIdRequest]) (*connect.Response[v4.GetEnvelopeByIdResponse], error)
	GetAllEnvelopes(context.Context, *connect.Request[v4.GetAllEnvelopesRequest]) (*connect.Response[v4.GetAllEnvelopesResponse], error)
	UpsertEnvelope(context.Context, *connect.Request[v4.UpsertEnvelopeRequest]) (*connect.Response[v4.UpsertEnvelopeResponse], error)
}

// NewMDEnvelopeServiceHandler builds an HTTP handler from the service implementation. It returns
// the path on which to mount the handler and the handler itself.
//
// By default, handlers support the Connect, gRPC, and gRPC-Web protocols with the binary Protobuf
// and JSON codecs. They also support gzip compression.
func NewMDEnvelopeServiceHandler(svc MDEnvelopeServiceHandler, opts ...connect.HandlerOption) (string, http.Handler) {
	mDEnvelopeServiceMethods := v4.File_moneydashboard_v4_envelopes_proto.Services().ByName("MDEnvelopeService").Methods()
	mDEnvelopeServiceGetEnvelopeByIdHandler := connect.NewUnaryHandler(
		MDEnvelopeServiceGetEnvelopeByIdProcedure,
		svc.GetEnvelopeById,
		connect.WithSchema(mDEnvelopeServiceMethods.ByName("GetEnvelopeById")),
		connect.WithHandlerOptions(opts...),
	)
	mDEnvelopeServiceGetAllEnvelopesHandler := connect.NewUnaryHandler(
		MDEnvelopeServiceGetAllEnvelopesProcedure,
		svc.GetAllEnvelopes,
		connect.WithSchema(mDEnvelopeServiceMethods.ByName("GetAllEnvelopes")),
		connect.WithHandlerOptions(opts...),
	)
	mDEnvelopeServiceUpsertEnvelopeHandler := connect.NewUnaryHandler(
		MDEnvelopeServiceUpsertEnvelopeProcedure,
		svc.UpsertEnvelope,
		connect.WithSchema(mDEnvelopeServiceMethods.ByName("UpsertEnvelope")),
		connect.WithHandlerOptions(opts...),
	)
	return "/moneydashboard.v4.MDEnvelopeService/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case MDEnvelopeServiceGetEnvelopeByIdProcedure:
			mDEnvelopeServiceGetEnvelopeByIdHandler.ServeHTTP(w, r)
		case MDEnvelopeServiceGetAllEnvelopesProcedure:
			mDEnvelopeServiceGetAllEnvelopesHandler.ServeHTTP(w, r)
		case MDEnvelopeServiceUpsertEnvelopeProcedure:
			mDEnvelopeServiceUpsertEnvelopeHandler.ServeHTTP(w, r)
		default:
			http.NotFound(w, r)
		}
	})
}

// UnimplementedMDEnvelopeServiceHandler returns CodeUnimplemented from all methods.
type UnimplementedMDEnvelopeServiceHandler struct{}

func (UnimplementedMDEnvelopeServiceHandler) GetEnvelopeById(context.Context, *connect.Request[v4.GetEnvelopeByIdRequest]) (*connect.Response[v4.GetEnvelopeByIdResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, errors.New("moneydashboard.v4.MDEnvelopeService.GetEnvelopeById is not implemented"))
}

func (UnimplementedMDEnvelopeServiceHandler) GetAllEnvelopes(context.Context, *connect.Request[v4.GetAllEnvelopesRequest]) (*connect.Response[v4.GetAllEnvelopesResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, errors.New("moneydashboard.v4.MDEnvelopeService.GetAllEnvelopes is not implemented"))
}

func (UnimplementedMDEnvelopeServiceHandler) UpsertEnvelope(context.Context, *connect.Request[v4.UpsertEnvelopeRequest]) (*connect.Response[v4.UpsertEnvelopeResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, errors.New("moneydashboard.v4.MDEnvelopeService.UpsertEnvelope is not implemented"))
}
