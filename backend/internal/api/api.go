package api

import (
	"context"
	"net/http"

	"connectrpc.com/connect"
	mdv4 "github.com/markormesher/money-dashboard/internal/gen/moneydashboard/v4"
	"github.com/markormesher/money-dashboard/internal/gen/moneydashboard/v4/mdv4connect"
)

type apiServer struct{}

func NewApiServer() *apiServer {
	return &apiServer{}
}

func (s *apiServer) ConfigureMux(mux *http.ServeMux) {
	path, handler := mdv4connect.NewMDServiceHandler(s)
	mux.Handle(path, handler)
}

func (s *apiServer) GetCurrentUser(ctx context.Context, req *connect.Request[mdv4.GetCurrentUserRequest]) (*connect.Response[mdv4.GetCurrentUserResponse], error) {

	res := connect.NewResponse(&mdv4.GetCurrentUserResponse{
		User: &mdv4.User{
			Id: "abc123",
		},
	})
	return res, nil
}
