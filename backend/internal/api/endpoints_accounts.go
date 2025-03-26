package api

import (
	"context"

	"connectrpc.com/connect"
	"github.com/google/uuid"
	"github.com/markormesher/money-dashboard/internal/api/conversion"
	mdv4 "github.com/markormesher/money-dashboard/internal/api_gen/moneydashboard/v4"
	"github.com/markormesher/money-dashboard/internal/conversiontools"
)

func (s *apiServer) GetAccountById(ctx context.Context, req *connect.Request[mdv4.GetAccountByIdRequest]) (*connect.Response[mdv4.GetAccountByIdResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	id, err := uuid.Parse(req.Msg.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	account, ok, err := s.core.GetAccountById(ctx, *user.ActiveProfile, id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	if !ok {
		return nil, connect.NewError(connect.CodeNotFound, nil)
	}

	res := connect.NewResponse(&mdv4.GetAccountByIdResponse{
		Account: conversion.AccountFromCore(account),
	})
	return res, nil
}

func (s *apiServer) GetAllAccounts(ctx context.Context, req *connect.Request[mdv4.GetAllAccountsRequest]) (*connect.Response[mdv4.GetAllAccountsResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	accounts, err := s.core.GetAllAccounts(ctx, *user.ActiveProfile)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&mdv4.GetAllAccountsResponse{
		Accounts: conversiontools.ConvertSlice(accounts, conversion.AccountFromCore),
	})
	return res, nil
}

func (s *apiServer) UpsertAccount(ctx context.Context, req *connect.Request[mdv4.UpsertAccountRequest]) (*connect.Response[mdv4.UpsertAccountResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	account := conversion.AccountToCore(req.Msg.Account)
	err = s.core.UpsertAccount(ctx, *user.ActiveProfile, account)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&mdv4.UpsertAccountResponse{})
	return res, nil
}
