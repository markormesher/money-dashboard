package api

import (
	"context"

	"connectrpc.com/connect"
	"github.com/google/uuid"
	"github.com/markormesher/money-dashboard/internal/api/conversion"
	mdv4 "github.com/markormesher/money-dashboard/internal/api_gen/moneydashboard/v4"
	"github.com/markormesher/money-dashboard/internal/conversiontools"
)

func (s *apiServer) GetProfileById(ctx context.Context, req *connect.Request[mdv4.GetProfileByIdRequest]) (*connect.Response[mdv4.GetProfileByIdResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	id, err := uuid.Parse(req.Msg.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	profile, ok, err := s.core.GetProfileById(ctx, user, id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	if !ok {
		return nil, connect.NewError(connect.CodeNotFound, nil)
	}

	res := connect.NewResponse(&mdv4.GetProfileByIdResponse{
		Profile: conversion.ProfileFromCore(profile),
	})
	return res, nil
}

func (s *apiServer) GetAllProfiles(ctx context.Context, req *connect.Request[mdv4.GetAllProfilesRequest]) (*connect.Response[mdv4.GetAllProfilesResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	profiles, err := s.core.GetAllProfiles(ctx, user)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&mdv4.GetAllProfilesResponse{
		Profiles: conversiontools.ConvertSlice(profiles, conversion.ProfileFromCore),
	}), nil
}

func (s *apiServer) UpsertProfile(ctx context.Context, req *connect.Request[mdv4.UpsertProfileRequest]) (*connect.Response[mdv4.UpsertProfileResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	holding := conversion.ProfileToCore(req.Msg.Profile)
	err = s.core.UpsertProfile(ctx, user, holding)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&mdv4.UpsertProfileResponse{})
	return res, nil
}
