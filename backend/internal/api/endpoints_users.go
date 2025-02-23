package api

import (
	"context"

	"connectrpc.com/connect"
	"github.com/markormesher/money-dashboard/internal/api/conversion"
	mdv4 "github.com/markormesher/money-dashboard/internal/api_gen/moneydashboard/v4"
)

func (s *apiServer) GetUser(ctx context.Context, req *connect.Request[mdv4.GetUserRequest]) (*connect.Response[mdv4.GetUserResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	res := connect.NewResponse(&mdv4.GetUserResponse{
		User: conversion.UserFromCore(user),
	})
	return res, nil
}

func (s *apiServer) SetActiveProfile(ctx context.Context, req *connect.Request[mdv4.SetActiveProfileRequest]) (*connect.Response[mdv4.SetActiveProfileResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	profile := conversion.ProfileToCore(req.Msg.Profile)
	err = s.core.SetActiveProfile(ctx, user, profile)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&mdv4.SetActiveProfileResponse{}), nil
}
