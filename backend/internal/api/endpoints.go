package api

import (
	"context"

	"connectrpc.com/connect"
	"github.com/markormesher/money-dashboard/internal/api/conversion"
	mdv4 "github.com/markormesher/money-dashboard/internal/api_gen/moneydashboard/v4"
)

func (s *apiServer) GetCurrentUser(ctx context.Context, req *connect.Request[mdv4.GetCurrentUserRequest]) (*connect.Response[mdv4.GetCurrentUserResponse], error) {
	user, err := s.GetUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	res := connect.NewResponse(&mdv4.GetCurrentUserResponse{
		User: conversion.UserFromCore(user),
	})
	return res, nil
}
