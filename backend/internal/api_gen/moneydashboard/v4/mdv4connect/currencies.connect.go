// Code generated by protoc-gen-connect-go. DO NOT EDIT.
//
// Source: moneydashboard/v4/currencies.proto

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
	// MDCurrencyServiceName is the fully-qualified name of the MDCurrencyService service.
	MDCurrencyServiceName = "moneydashboard.v4.MDCurrencyService"
)

// These constants are the fully-qualified names of the RPCs defined in this package. They're
// exposed at runtime as Spec.Procedure and as the final two segments of the HTTP route.
//
// Note that these are different from the fully-qualified method names used by
// google.golang.org/protobuf/reflect/protoreflect. To convert from these constants to
// reflection-formatted method names, remove the leading slash and convert the remaining slash to a
// period.
const (
	// MDCurrencyServiceGetCurrencyByIdProcedure is the fully-qualified name of the MDCurrencyService's
	// GetCurrencyById RPC.
	MDCurrencyServiceGetCurrencyByIdProcedure = "/moneydashboard.v4.MDCurrencyService/GetCurrencyById"
	// MDCurrencyServiceGetAllCurrenciesProcedure is the fully-qualified name of the MDCurrencyService's
	// GetAllCurrencies RPC.
	MDCurrencyServiceGetAllCurrenciesProcedure = "/moneydashboard.v4.MDCurrencyService/GetAllCurrencies"
	// MDCurrencyServiceUpsertCurrencyProcedure is the fully-qualified name of the MDCurrencyService's
	// UpsertCurrency RPC.
	MDCurrencyServiceUpsertCurrencyProcedure = "/moneydashboard.v4.MDCurrencyService/UpsertCurrency"
)

// MDCurrencyServiceClient is a client for the moneydashboard.v4.MDCurrencyService service.
type MDCurrencyServiceClient interface {
	GetCurrencyById(context.Context, *connect.Request[v4.GetCurrencyByIdRequest]) (*connect.Response[v4.GetCurrencyByIdResponse], error)
	GetAllCurrencies(context.Context, *connect.Request[v4.GetAllCurrenciesRequest]) (*connect.Response[v4.GetAllCurrenciesResponse], error)
	UpsertCurrency(context.Context, *connect.Request[v4.UpsertCurrencyRequest]) (*connect.Response[v4.UpsertCurrencyResponse], error)
}

// NewMDCurrencyServiceClient constructs a client for the moneydashboard.v4.MDCurrencyService
// service. By default, it uses the Connect protocol with the binary Protobuf Codec, asks for
// gzipped responses, and sends uncompressed requests. To use the gRPC or gRPC-Web protocols, supply
// the connect.WithGRPC() or connect.WithGRPCWeb() options.
//
// The URL supplied here should be the base URL for the Connect or gRPC server (for example,
// http://api.acme.com or https://acme.com/grpc).
func NewMDCurrencyServiceClient(httpClient connect.HTTPClient, baseURL string, opts ...connect.ClientOption) MDCurrencyServiceClient {
	baseURL = strings.TrimRight(baseURL, "/")
	mDCurrencyServiceMethods := v4.File_moneydashboard_v4_currencies_proto.Services().ByName("MDCurrencyService").Methods()
	return &mDCurrencyServiceClient{
		getCurrencyById: connect.NewClient[v4.GetCurrencyByIdRequest, v4.GetCurrencyByIdResponse](
			httpClient,
			baseURL+MDCurrencyServiceGetCurrencyByIdProcedure,
			connect.WithSchema(mDCurrencyServiceMethods.ByName("GetCurrencyById")),
			connect.WithClientOptions(opts...),
		),
		getAllCurrencies: connect.NewClient[v4.GetAllCurrenciesRequest, v4.GetAllCurrenciesResponse](
			httpClient,
			baseURL+MDCurrencyServiceGetAllCurrenciesProcedure,
			connect.WithSchema(mDCurrencyServiceMethods.ByName("GetAllCurrencies")),
			connect.WithClientOptions(opts...),
		),
		upsertCurrency: connect.NewClient[v4.UpsertCurrencyRequest, v4.UpsertCurrencyResponse](
			httpClient,
			baseURL+MDCurrencyServiceUpsertCurrencyProcedure,
			connect.WithSchema(mDCurrencyServiceMethods.ByName("UpsertCurrency")),
			connect.WithClientOptions(opts...),
		),
	}
}

// mDCurrencyServiceClient implements MDCurrencyServiceClient.
type mDCurrencyServiceClient struct {
	getCurrencyById  *connect.Client[v4.GetCurrencyByIdRequest, v4.GetCurrencyByIdResponse]
	getAllCurrencies *connect.Client[v4.GetAllCurrenciesRequest, v4.GetAllCurrenciesResponse]
	upsertCurrency   *connect.Client[v4.UpsertCurrencyRequest, v4.UpsertCurrencyResponse]
}

// GetCurrencyById calls moneydashboard.v4.MDCurrencyService.GetCurrencyById.
func (c *mDCurrencyServiceClient) GetCurrencyById(ctx context.Context, req *connect.Request[v4.GetCurrencyByIdRequest]) (*connect.Response[v4.GetCurrencyByIdResponse], error) {
	return c.getCurrencyById.CallUnary(ctx, req)
}

// GetAllCurrencies calls moneydashboard.v4.MDCurrencyService.GetAllCurrencies.
func (c *mDCurrencyServiceClient) GetAllCurrencies(ctx context.Context, req *connect.Request[v4.GetAllCurrenciesRequest]) (*connect.Response[v4.GetAllCurrenciesResponse], error) {
	return c.getAllCurrencies.CallUnary(ctx, req)
}

// UpsertCurrency calls moneydashboard.v4.MDCurrencyService.UpsertCurrency.
func (c *mDCurrencyServiceClient) UpsertCurrency(ctx context.Context, req *connect.Request[v4.UpsertCurrencyRequest]) (*connect.Response[v4.UpsertCurrencyResponse], error) {
	return c.upsertCurrency.CallUnary(ctx, req)
}

// MDCurrencyServiceHandler is an implementation of the moneydashboard.v4.MDCurrencyService service.
type MDCurrencyServiceHandler interface {
	GetCurrencyById(context.Context, *connect.Request[v4.GetCurrencyByIdRequest]) (*connect.Response[v4.GetCurrencyByIdResponse], error)
	GetAllCurrencies(context.Context, *connect.Request[v4.GetAllCurrenciesRequest]) (*connect.Response[v4.GetAllCurrenciesResponse], error)
	UpsertCurrency(context.Context, *connect.Request[v4.UpsertCurrencyRequest]) (*connect.Response[v4.UpsertCurrencyResponse], error)
}

// NewMDCurrencyServiceHandler builds an HTTP handler from the service implementation. It returns
// the path on which to mount the handler and the handler itself.
//
// By default, handlers support the Connect, gRPC, and gRPC-Web protocols with the binary Protobuf
// and JSON codecs. They also support gzip compression.
func NewMDCurrencyServiceHandler(svc MDCurrencyServiceHandler, opts ...connect.HandlerOption) (string, http.Handler) {
	mDCurrencyServiceMethods := v4.File_moneydashboard_v4_currencies_proto.Services().ByName("MDCurrencyService").Methods()
	mDCurrencyServiceGetCurrencyByIdHandler := connect.NewUnaryHandler(
		MDCurrencyServiceGetCurrencyByIdProcedure,
		svc.GetCurrencyById,
		connect.WithSchema(mDCurrencyServiceMethods.ByName("GetCurrencyById")),
		connect.WithHandlerOptions(opts...),
	)
	mDCurrencyServiceGetAllCurrenciesHandler := connect.NewUnaryHandler(
		MDCurrencyServiceGetAllCurrenciesProcedure,
		svc.GetAllCurrencies,
		connect.WithSchema(mDCurrencyServiceMethods.ByName("GetAllCurrencies")),
		connect.WithHandlerOptions(opts...),
	)
	mDCurrencyServiceUpsertCurrencyHandler := connect.NewUnaryHandler(
		MDCurrencyServiceUpsertCurrencyProcedure,
		svc.UpsertCurrency,
		connect.WithSchema(mDCurrencyServiceMethods.ByName("UpsertCurrency")),
		connect.WithHandlerOptions(opts...),
	)
	return "/moneydashboard.v4.MDCurrencyService/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case MDCurrencyServiceGetCurrencyByIdProcedure:
			mDCurrencyServiceGetCurrencyByIdHandler.ServeHTTP(w, r)
		case MDCurrencyServiceGetAllCurrenciesProcedure:
			mDCurrencyServiceGetAllCurrenciesHandler.ServeHTTP(w, r)
		case MDCurrencyServiceUpsertCurrencyProcedure:
			mDCurrencyServiceUpsertCurrencyHandler.ServeHTTP(w, r)
		default:
			http.NotFound(w, r)
		}
	})
}

// UnimplementedMDCurrencyServiceHandler returns CodeUnimplemented from all methods.
type UnimplementedMDCurrencyServiceHandler struct{}

func (UnimplementedMDCurrencyServiceHandler) GetCurrencyById(context.Context, *connect.Request[v4.GetCurrencyByIdRequest]) (*connect.Response[v4.GetCurrencyByIdResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, errors.New("moneydashboard.v4.MDCurrencyService.GetCurrencyById is not implemented"))
}

func (UnimplementedMDCurrencyServiceHandler) GetAllCurrencies(context.Context, *connect.Request[v4.GetAllCurrenciesRequest]) (*connect.Response[v4.GetAllCurrenciesResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, errors.New("moneydashboard.v4.MDCurrencyService.GetAllCurrencies is not implemented"))
}

func (UnimplementedMDCurrencyServiceHandler) UpsertCurrency(context.Context, *connect.Request[v4.UpsertCurrencyRequest]) (*connect.Response[v4.UpsertCurrencyResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, errors.New("moneydashboard.v4.MDCurrencyService.UpsertCurrency is not implemented"))
}
