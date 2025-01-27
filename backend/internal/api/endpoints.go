package api

import (
	"context"

	"connectrpc.com/connect"
	mdv4 "github.com/markormesher/money-dashboard/internal/api_gen/moneydashboard/v4"
)

func (s *apiServer) GetCurrentUser(ctx context.Context, req *connect.Request[mdv4.GetCurrentUserRequest]) (*connect.Response[mdv4.GetCurrentUserResponse], error) {
	res := connect.NewResponse(&mdv4.GetCurrentUserResponse{
		User: &mdv4.User{
			ID: "abc123",
		},
	})
	return res, nil
}
