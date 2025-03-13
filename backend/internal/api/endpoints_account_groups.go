package api

import (
	"context"

	"connectrpc.com/connect"
	"github.com/google/uuid"
	"github.com/markormesher/money-dashboard/internal/api/conversion"
	mdv4 "github.com/markormesher/money-dashboard/internal/api_gen/moneydashboard/v4"
	"github.com/markormesher/money-dashboard/internal/conversiontools"
)

func (s *apiServer) GetAccountGroupById(ctx context.Context, req *connect.Request[mdv4.GetAccountGroupByIdRequest]) (*connect.Response[mdv4.GetAccountGroupByIdResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	id, err := uuid.Parse(req.Msg.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	accountGroup, ok, err := s.core.GetAccountGroupById(ctx, *user.ActiveProfile, id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	if !ok {
		return nil, connect.NewError(connect.CodeNotFound, nil)
	}

	res := connect.NewResponse(&mdv4.GetAccountGroupByIdResponse{
		AccountGroup: conversion.AccountGroupFromCore(accountGroup),
	})
	return res, nil
}

func (s *apiServer) GetAllAccountGroups(ctx context.Context, req *connect.Request[mdv4.GetAllAccountGroupsRequest]) (*connect.Response[mdv4.GetAllAccountGroupsResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	accountGroups, err := s.core.GetAllAccountGroups(ctx, *user.ActiveProfile)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&mdv4.GetAllAccountGroupsResponse{
		AccountGroups: conversiontools.ConvertSlice(accountGroups, conversion.AccountGroupFromCore),
	})
	return res, nil
}

func (s *apiServer) UpsertAccountGroup(ctx context.Context, req *connect.Request[mdv4.UpsertAccountGroupRequest]) (*connect.Response[mdv4.UpsertAccountGroupResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	accountGroup := conversion.AccountGroupToCore(req.Msg.AccountGroup)
	err = s.core.UpsertAccountGroup(ctx, *user.ActiveProfile, accountGroup)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&mdv4.UpsertAccountGroupResponse{})
	return res, nil
}
