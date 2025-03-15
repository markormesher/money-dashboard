// Code generated by protoc-gen-connect-go. DO NOT EDIT.
//
// Source: moneydashboard/v4/reporting.proto

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
	// MDReportingServiceName is the fully-qualified name of the MDReportingService service.
	MDReportingServiceName = "moneydashboard.v4.MDReportingService"
)

// These constants are the fully-qualified names of the RPCs defined in this package. They're
// exposed at runtime as Spec.Procedure and as the final two segments of the HTTP route.
//
// Note that these are different from the fully-qualified method names used by
// google.golang.org/protobuf/reflect/protoreflect. To convert from these constants to
// reflection-formatted method names, remove the leading slash and convert the remaining slash to a
// period.
const (
	// MDReportingServiceGetHoldingBalancesProcedure is the fully-qualified name of the
	// MDReportingService's GetHoldingBalances RPC.
	MDReportingServiceGetHoldingBalancesProcedure = "/moneydashboard.v4.MDReportingService/GetHoldingBalances"
	// MDReportingServiceGetNonZeroMemoBalancesProcedure is the fully-qualified name of the
	// MDReportingService's GetNonZeroMemoBalances RPC.
	MDReportingServiceGetNonZeroMemoBalancesProcedure = "/moneydashboard.v4.MDReportingService/GetNonZeroMemoBalances"
)

// MDReportingServiceClient is a client for the moneydashboard.v4.MDReportingService service.
type MDReportingServiceClient interface {
	GetHoldingBalances(context.Context, *connect.Request[v4.GetHoldingBalancesRequest]) (*connect.Response[v4.GetHoldingBalancesResponse], error)
	GetNonZeroMemoBalances(context.Context, *connect.Request[v4.GetNonZeroMemoBalancesRequest]) (*connect.Response[v4.GetNonZeroMemoBalancesResponse], error)
}

// NewMDReportingServiceClient constructs a client for the moneydashboard.v4.MDReportingService
// service. By default, it uses the Connect protocol with the binary Protobuf Codec, asks for
// gzipped responses, and sends uncompressed requests. To use the gRPC or gRPC-Web protocols, supply
// the connect.WithGRPC() or connect.WithGRPCWeb() options.
//
// The URL supplied here should be the base URL for the Connect or gRPC server (for example,
// http://api.acme.com or https://acme.com/grpc).
func NewMDReportingServiceClient(httpClient connect.HTTPClient, baseURL string, opts ...connect.ClientOption) MDReportingServiceClient {
	baseURL = strings.TrimRight(baseURL, "/")
	mDReportingServiceMethods := v4.File_moneydashboard_v4_reporting_proto.Services().ByName("MDReportingService").Methods()
	return &mDReportingServiceClient{
		getHoldingBalances: connect.NewClient[v4.GetHoldingBalancesRequest, v4.GetHoldingBalancesResponse](
			httpClient,
			baseURL+MDReportingServiceGetHoldingBalancesProcedure,
			connect.WithSchema(mDReportingServiceMethods.ByName("GetHoldingBalances")),
			connect.WithClientOptions(opts...),
		),
		getNonZeroMemoBalances: connect.NewClient[v4.GetNonZeroMemoBalancesRequest, v4.GetNonZeroMemoBalancesResponse](
			httpClient,
			baseURL+MDReportingServiceGetNonZeroMemoBalancesProcedure,
			connect.WithSchema(mDReportingServiceMethods.ByName("GetNonZeroMemoBalances")),
			connect.WithClientOptions(opts...),
		),
	}
}

// mDReportingServiceClient implements MDReportingServiceClient.
type mDReportingServiceClient struct {
	getHoldingBalances     *connect.Client[v4.GetHoldingBalancesRequest, v4.GetHoldingBalancesResponse]
	getNonZeroMemoBalances *connect.Client[v4.GetNonZeroMemoBalancesRequest, v4.GetNonZeroMemoBalancesResponse]
}

// GetHoldingBalances calls moneydashboard.v4.MDReportingService.GetHoldingBalances.
func (c *mDReportingServiceClient) GetHoldingBalances(ctx context.Context, req *connect.Request[v4.GetHoldingBalancesRequest]) (*connect.Response[v4.GetHoldingBalancesResponse], error) {
	return c.getHoldingBalances.CallUnary(ctx, req)
}

// GetNonZeroMemoBalances calls moneydashboard.v4.MDReportingService.GetNonZeroMemoBalances.
func (c *mDReportingServiceClient) GetNonZeroMemoBalances(ctx context.Context, req *connect.Request[v4.GetNonZeroMemoBalancesRequest]) (*connect.Response[v4.GetNonZeroMemoBalancesResponse], error) {
	return c.getNonZeroMemoBalances.CallUnary(ctx, req)
}

// MDReportingServiceHandler is an implementation of the moneydashboard.v4.MDReportingService
// service.
type MDReportingServiceHandler interface {
	GetHoldingBalances(context.Context, *connect.Request[v4.GetHoldingBalancesRequest]) (*connect.Response[v4.GetHoldingBalancesResponse], error)
	GetNonZeroMemoBalances(context.Context, *connect.Request[v4.GetNonZeroMemoBalancesRequest]) (*connect.Response[v4.GetNonZeroMemoBalancesResponse], error)
}

// NewMDReportingServiceHandler builds an HTTP handler from the service implementation. It returns
// the path on which to mount the handler and the handler itself.
//
// By default, handlers support the Connect, gRPC, and gRPC-Web protocols with the binary Protobuf
// and JSON codecs. They also support gzip compression.
func NewMDReportingServiceHandler(svc MDReportingServiceHandler, opts ...connect.HandlerOption) (string, http.Handler) {
	mDReportingServiceMethods := v4.File_moneydashboard_v4_reporting_proto.Services().ByName("MDReportingService").Methods()
	mDReportingServiceGetHoldingBalancesHandler := connect.NewUnaryHandler(
		MDReportingServiceGetHoldingBalancesProcedure,
		svc.GetHoldingBalances,
		connect.WithSchema(mDReportingServiceMethods.ByName("GetHoldingBalances")),
		connect.WithHandlerOptions(opts...),
	)
	mDReportingServiceGetNonZeroMemoBalancesHandler := connect.NewUnaryHandler(
		MDReportingServiceGetNonZeroMemoBalancesProcedure,
		svc.GetNonZeroMemoBalances,
		connect.WithSchema(mDReportingServiceMethods.ByName("GetNonZeroMemoBalances")),
		connect.WithHandlerOptions(opts...),
	)
	return "/moneydashboard.v4.MDReportingService/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case MDReportingServiceGetHoldingBalancesProcedure:
			mDReportingServiceGetHoldingBalancesHandler.ServeHTTP(w, r)
		case MDReportingServiceGetNonZeroMemoBalancesProcedure:
			mDReportingServiceGetNonZeroMemoBalancesHandler.ServeHTTP(w, r)
		default:
			http.NotFound(w, r)
		}
	})
}

// UnimplementedMDReportingServiceHandler returns CodeUnimplemented from all methods.
type UnimplementedMDReportingServiceHandler struct{}

func (UnimplementedMDReportingServiceHandler) GetHoldingBalances(context.Context, *connect.Request[v4.GetHoldingBalancesRequest]) (*connect.Response[v4.GetHoldingBalancesResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, errors.New("moneydashboard.v4.MDReportingService.GetHoldingBalances is not implemented"))
}

func (UnimplementedMDReportingServiceHandler) GetNonZeroMemoBalances(context.Context, *connect.Request[v4.GetNonZeroMemoBalancesRequest]) (*connect.Response[v4.GetNonZeroMemoBalancesResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, errors.New("moneydashboard.v4.MDReportingService.GetNonZeroMemoBalances is not implemented"))
}
