// Code generated by protoc-gen-connect-go. DO NOT EDIT.
//
// Source: moneydashboard/v4/envelope_transfers.proto

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
	// MDEnvelopeTransferServiceName is the fully-qualified name of the MDEnvelopeTransferService
	// service.
	MDEnvelopeTransferServiceName = "moneydashboard.v4.MDEnvelopeTransferService"
)

// These constants are the fully-qualified names of the RPCs defined in this package. They're
// exposed at runtime as Spec.Procedure and as the final two segments of the HTTP route.
//
// Note that these are different from the fully-qualified method names used by
// google.golang.org/protobuf/reflect/protoreflect. To convert from these constants to
// reflection-formatted method names, remove the leading slash and convert the remaining slash to a
// period.
const (
	// MDEnvelopeTransferServiceGetEnvelopeTransferByIdProcedure is the fully-qualified name of the
	// MDEnvelopeTransferService's GetEnvelopeTransferById RPC.
	MDEnvelopeTransferServiceGetEnvelopeTransferByIdProcedure = "/moneydashboard.v4.MDEnvelopeTransferService/GetEnvelopeTransferById"
	// MDEnvelopeTransferServiceGetEnvelopeTransferPageProcedure is the fully-qualified name of the
	// MDEnvelopeTransferService's GetEnvelopeTransferPage RPC.
	MDEnvelopeTransferServiceGetEnvelopeTransferPageProcedure = "/moneydashboard.v4.MDEnvelopeTransferService/GetEnvelopeTransferPage"
	// MDEnvelopeTransferServiceUpsertEnvelopeTransferProcedure is the fully-qualified name of the
	// MDEnvelopeTransferService's UpsertEnvelopeTransfer RPC.
	MDEnvelopeTransferServiceUpsertEnvelopeTransferProcedure = "/moneydashboard.v4.MDEnvelopeTransferService/UpsertEnvelopeTransfer"
	// MDEnvelopeTransferServiceDeleteEnvelopeTransferProcedure is the fully-qualified name of the
	// MDEnvelopeTransferService's DeleteEnvelopeTransfer RPC.
	MDEnvelopeTransferServiceDeleteEnvelopeTransferProcedure = "/moneydashboard.v4.MDEnvelopeTransferService/DeleteEnvelopeTransfer"
	// MDEnvelopeTransferServiceCloneEnvelopeTransfersProcedure is the fully-qualified name of the
	// MDEnvelopeTransferService's CloneEnvelopeTransfers RPC.
	MDEnvelopeTransferServiceCloneEnvelopeTransfersProcedure = "/moneydashboard.v4.MDEnvelopeTransferService/CloneEnvelopeTransfers"
)

// MDEnvelopeTransferServiceClient is a client for the moneydashboard.v4.MDEnvelopeTransferService
// service.
type MDEnvelopeTransferServiceClient interface {
	GetEnvelopeTransferById(context.Context, *connect.Request[v4.GetEnvelopeTransferByIdRequest]) (*connect.Response[v4.GetEnvelopeTransferByIdResponse], error)
	GetEnvelopeTransferPage(context.Context, *connect.Request[v4.GetEnvelopeTransferPageRequest]) (*connect.Response[v4.GetEnvelopeTransferPageResponse], error)
	UpsertEnvelopeTransfer(context.Context, *connect.Request[v4.UpsertEnvelopeTransferRequest]) (*connect.Response[v4.UpsertEnvelopeTransferResponse], error)
	DeleteEnvelopeTransfer(context.Context, *connect.Request[v4.DeleteEnvelopeTransferRequest]) (*connect.Response[v4.DeleteEnvelopeTransferResponse], error)
	CloneEnvelopeTransfers(context.Context, *connect.Request[v4.CloneEnvelopeTransfersRequest]) (*connect.Response[v4.CloneEnvelopeTransfersResponse], error)
}

// NewMDEnvelopeTransferServiceClient constructs a client for the
// moneydashboard.v4.MDEnvelopeTransferService service. By default, it uses the Connect protocol
// with the binary Protobuf Codec, asks for gzipped responses, and sends uncompressed requests. To
// use the gRPC or gRPC-Web protocols, supply the connect.WithGRPC() or connect.WithGRPCWeb()
// options.
//
// The URL supplied here should be the base URL for the Connect or gRPC server (for example,
// http://api.acme.com or https://acme.com/grpc).
func NewMDEnvelopeTransferServiceClient(httpClient connect.HTTPClient, baseURL string, opts ...connect.ClientOption) MDEnvelopeTransferServiceClient {
	baseURL = strings.TrimRight(baseURL, "/")
	mDEnvelopeTransferServiceMethods := v4.File_moneydashboard_v4_envelope_transfers_proto.Services().ByName("MDEnvelopeTransferService").Methods()
	return &mDEnvelopeTransferServiceClient{
		getEnvelopeTransferById: connect.NewClient[v4.GetEnvelopeTransferByIdRequest, v4.GetEnvelopeTransferByIdResponse](
			httpClient,
			baseURL+MDEnvelopeTransferServiceGetEnvelopeTransferByIdProcedure,
			connect.WithSchema(mDEnvelopeTransferServiceMethods.ByName("GetEnvelopeTransferById")),
			connect.WithClientOptions(opts...),
		),
		getEnvelopeTransferPage: connect.NewClient[v4.GetEnvelopeTransferPageRequest, v4.GetEnvelopeTransferPageResponse](
			httpClient,
			baseURL+MDEnvelopeTransferServiceGetEnvelopeTransferPageProcedure,
			connect.WithSchema(mDEnvelopeTransferServiceMethods.ByName("GetEnvelopeTransferPage")),
			connect.WithClientOptions(opts...),
		),
		upsertEnvelopeTransfer: connect.NewClient[v4.UpsertEnvelopeTransferRequest, v4.UpsertEnvelopeTransferResponse](
			httpClient,
			baseURL+MDEnvelopeTransferServiceUpsertEnvelopeTransferProcedure,
			connect.WithSchema(mDEnvelopeTransferServiceMethods.ByName("UpsertEnvelopeTransfer")),
			connect.WithClientOptions(opts...),
		),
		deleteEnvelopeTransfer: connect.NewClient[v4.DeleteEnvelopeTransferRequest, v4.DeleteEnvelopeTransferResponse](
			httpClient,
			baseURL+MDEnvelopeTransferServiceDeleteEnvelopeTransferProcedure,
			connect.WithSchema(mDEnvelopeTransferServiceMethods.ByName("DeleteEnvelopeTransfer")),
			connect.WithClientOptions(opts...),
		),
		cloneEnvelopeTransfers: connect.NewClient[v4.CloneEnvelopeTransfersRequest, v4.CloneEnvelopeTransfersResponse](
			httpClient,
			baseURL+MDEnvelopeTransferServiceCloneEnvelopeTransfersProcedure,
			connect.WithSchema(mDEnvelopeTransferServiceMethods.ByName("CloneEnvelopeTransfers")),
			connect.WithClientOptions(opts...),
		),
	}
}

// mDEnvelopeTransferServiceClient implements MDEnvelopeTransferServiceClient.
type mDEnvelopeTransferServiceClient struct {
	getEnvelopeTransferById *connect.Client[v4.GetEnvelopeTransferByIdRequest, v4.GetEnvelopeTransferByIdResponse]
	getEnvelopeTransferPage *connect.Client[v4.GetEnvelopeTransferPageRequest, v4.GetEnvelopeTransferPageResponse]
	upsertEnvelopeTransfer  *connect.Client[v4.UpsertEnvelopeTransferRequest, v4.UpsertEnvelopeTransferResponse]
	deleteEnvelopeTransfer  *connect.Client[v4.DeleteEnvelopeTransferRequest, v4.DeleteEnvelopeTransferResponse]
	cloneEnvelopeTransfers  *connect.Client[v4.CloneEnvelopeTransfersRequest, v4.CloneEnvelopeTransfersResponse]
}

// GetEnvelopeTransferById calls
// moneydashboard.v4.MDEnvelopeTransferService.GetEnvelopeTransferById.
func (c *mDEnvelopeTransferServiceClient) GetEnvelopeTransferById(ctx context.Context, req *connect.Request[v4.GetEnvelopeTransferByIdRequest]) (*connect.Response[v4.GetEnvelopeTransferByIdResponse], error) {
	return c.getEnvelopeTransferById.CallUnary(ctx, req)
}

// GetEnvelopeTransferPage calls
// moneydashboard.v4.MDEnvelopeTransferService.GetEnvelopeTransferPage.
func (c *mDEnvelopeTransferServiceClient) GetEnvelopeTransferPage(ctx context.Context, req *connect.Request[v4.GetEnvelopeTransferPageRequest]) (*connect.Response[v4.GetEnvelopeTransferPageResponse], error) {
	return c.getEnvelopeTransferPage.CallUnary(ctx, req)
}

// UpsertEnvelopeTransfer calls moneydashboard.v4.MDEnvelopeTransferService.UpsertEnvelopeTransfer.
func (c *mDEnvelopeTransferServiceClient) UpsertEnvelopeTransfer(ctx context.Context, req *connect.Request[v4.UpsertEnvelopeTransferRequest]) (*connect.Response[v4.UpsertEnvelopeTransferResponse], error) {
	return c.upsertEnvelopeTransfer.CallUnary(ctx, req)
}

// DeleteEnvelopeTransfer calls moneydashboard.v4.MDEnvelopeTransferService.DeleteEnvelopeTransfer.
func (c *mDEnvelopeTransferServiceClient) DeleteEnvelopeTransfer(ctx context.Context, req *connect.Request[v4.DeleteEnvelopeTransferRequest]) (*connect.Response[v4.DeleteEnvelopeTransferResponse], error) {
	return c.deleteEnvelopeTransfer.CallUnary(ctx, req)
}

// CloneEnvelopeTransfers calls moneydashboard.v4.MDEnvelopeTransferService.CloneEnvelopeTransfers.
func (c *mDEnvelopeTransferServiceClient) CloneEnvelopeTransfers(ctx context.Context, req *connect.Request[v4.CloneEnvelopeTransfersRequest]) (*connect.Response[v4.CloneEnvelopeTransfersResponse], error) {
	return c.cloneEnvelopeTransfers.CallUnary(ctx, req)
}

// MDEnvelopeTransferServiceHandler is an implementation of the
// moneydashboard.v4.MDEnvelopeTransferService service.
type MDEnvelopeTransferServiceHandler interface {
	GetEnvelopeTransferById(context.Context, *connect.Request[v4.GetEnvelopeTransferByIdRequest]) (*connect.Response[v4.GetEnvelopeTransferByIdResponse], error)
	GetEnvelopeTransferPage(context.Context, *connect.Request[v4.GetEnvelopeTransferPageRequest]) (*connect.Response[v4.GetEnvelopeTransferPageResponse], error)
	UpsertEnvelopeTransfer(context.Context, *connect.Request[v4.UpsertEnvelopeTransferRequest]) (*connect.Response[v4.UpsertEnvelopeTransferResponse], error)
	DeleteEnvelopeTransfer(context.Context, *connect.Request[v4.DeleteEnvelopeTransferRequest]) (*connect.Response[v4.DeleteEnvelopeTransferResponse], error)
	CloneEnvelopeTransfers(context.Context, *connect.Request[v4.CloneEnvelopeTransfersRequest]) (*connect.Response[v4.CloneEnvelopeTransfersResponse], error)
}

// NewMDEnvelopeTransferServiceHandler builds an HTTP handler from the service implementation. It
// returns the path on which to mount the handler and the handler itself.
//
// By default, handlers support the Connect, gRPC, and gRPC-Web protocols with the binary Protobuf
// and JSON codecs. They also support gzip compression.
func NewMDEnvelopeTransferServiceHandler(svc MDEnvelopeTransferServiceHandler, opts ...connect.HandlerOption) (string, http.Handler) {
	mDEnvelopeTransferServiceMethods := v4.File_moneydashboard_v4_envelope_transfers_proto.Services().ByName("MDEnvelopeTransferService").Methods()
	mDEnvelopeTransferServiceGetEnvelopeTransferByIdHandler := connect.NewUnaryHandler(
		MDEnvelopeTransferServiceGetEnvelopeTransferByIdProcedure,
		svc.GetEnvelopeTransferById,
		connect.WithSchema(mDEnvelopeTransferServiceMethods.ByName("GetEnvelopeTransferById")),
		connect.WithHandlerOptions(opts...),
	)
	mDEnvelopeTransferServiceGetEnvelopeTransferPageHandler := connect.NewUnaryHandler(
		MDEnvelopeTransferServiceGetEnvelopeTransferPageProcedure,
		svc.GetEnvelopeTransferPage,
		connect.WithSchema(mDEnvelopeTransferServiceMethods.ByName("GetEnvelopeTransferPage")),
		connect.WithHandlerOptions(opts...),
	)
	mDEnvelopeTransferServiceUpsertEnvelopeTransferHandler := connect.NewUnaryHandler(
		MDEnvelopeTransferServiceUpsertEnvelopeTransferProcedure,
		svc.UpsertEnvelopeTransfer,
		connect.WithSchema(mDEnvelopeTransferServiceMethods.ByName("UpsertEnvelopeTransfer")),
		connect.WithHandlerOptions(opts...),
	)
	mDEnvelopeTransferServiceDeleteEnvelopeTransferHandler := connect.NewUnaryHandler(
		MDEnvelopeTransferServiceDeleteEnvelopeTransferProcedure,
		svc.DeleteEnvelopeTransfer,
		connect.WithSchema(mDEnvelopeTransferServiceMethods.ByName("DeleteEnvelopeTransfer")),
		connect.WithHandlerOptions(opts...),
	)
	mDEnvelopeTransferServiceCloneEnvelopeTransfersHandler := connect.NewUnaryHandler(
		MDEnvelopeTransferServiceCloneEnvelopeTransfersProcedure,
		svc.CloneEnvelopeTransfers,
		connect.WithSchema(mDEnvelopeTransferServiceMethods.ByName("CloneEnvelopeTransfers")),
		connect.WithHandlerOptions(opts...),
	)
	return "/moneydashboard.v4.MDEnvelopeTransferService/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case MDEnvelopeTransferServiceGetEnvelopeTransferByIdProcedure:
			mDEnvelopeTransferServiceGetEnvelopeTransferByIdHandler.ServeHTTP(w, r)
		case MDEnvelopeTransferServiceGetEnvelopeTransferPageProcedure:
			mDEnvelopeTransferServiceGetEnvelopeTransferPageHandler.ServeHTTP(w, r)
		case MDEnvelopeTransferServiceUpsertEnvelopeTransferProcedure:
			mDEnvelopeTransferServiceUpsertEnvelopeTransferHandler.ServeHTTP(w, r)
		case MDEnvelopeTransferServiceDeleteEnvelopeTransferProcedure:
			mDEnvelopeTransferServiceDeleteEnvelopeTransferHandler.ServeHTTP(w, r)
		case MDEnvelopeTransferServiceCloneEnvelopeTransfersProcedure:
			mDEnvelopeTransferServiceCloneEnvelopeTransfersHandler.ServeHTTP(w, r)
		default:
			http.NotFound(w, r)
		}
	})
}

// UnimplementedMDEnvelopeTransferServiceHandler returns CodeUnimplemented from all methods.
type UnimplementedMDEnvelopeTransferServiceHandler struct{}

func (UnimplementedMDEnvelopeTransferServiceHandler) GetEnvelopeTransferById(context.Context, *connect.Request[v4.GetEnvelopeTransferByIdRequest]) (*connect.Response[v4.GetEnvelopeTransferByIdResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, errors.New("moneydashboard.v4.MDEnvelopeTransferService.GetEnvelopeTransferById is not implemented"))
}

func (UnimplementedMDEnvelopeTransferServiceHandler) GetEnvelopeTransferPage(context.Context, *connect.Request[v4.GetEnvelopeTransferPageRequest]) (*connect.Response[v4.GetEnvelopeTransferPageResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, errors.New("moneydashboard.v4.MDEnvelopeTransferService.GetEnvelopeTransferPage is not implemented"))
}

func (UnimplementedMDEnvelopeTransferServiceHandler) UpsertEnvelopeTransfer(context.Context, *connect.Request[v4.UpsertEnvelopeTransferRequest]) (*connect.Response[v4.UpsertEnvelopeTransferResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, errors.New("moneydashboard.v4.MDEnvelopeTransferService.UpsertEnvelopeTransfer is not implemented"))
}

func (UnimplementedMDEnvelopeTransferServiceHandler) DeleteEnvelopeTransfer(context.Context, *connect.Request[v4.DeleteEnvelopeTransferRequest]) (*connect.Response[v4.DeleteEnvelopeTransferResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, errors.New("moneydashboard.v4.MDEnvelopeTransferService.DeleteEnvelopeTransfer is not implemented"))
}

func (UnimplementedMDEnvelopeTransferServiceHandler) CloneEnvelopeTransfers(context.Context, *connect.Request[v4.CloneEnvelopeTransfersRequest]) (*connect.Response[v4.CloneEnvelopeTransfersResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, errors.New("moneydashboard.v4.MDEnvelopeTransferService.CloneEnvelopeTransfers is not implemented"))
}
