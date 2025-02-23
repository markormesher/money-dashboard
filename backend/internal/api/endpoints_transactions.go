package api

import (
	"context"

	"connectrpc.com/connect"
	"github.com/google/uuid"
	"github.com/markormesher/money-dashboard/internal/api/conversion"
	mdv4 "github.com/markormesher/money-dashboard/internal/api_gen/moneydashboard/v4"
	"github.com/markormesher/money-dashboard/internal/conversiontools"
)

func (s *apiServer) GetTransactionById(ctx context.Context, req *connect.Request[mdv4.GetTransactionByIdRequest]) (*connect.Response[mdv4.GetTransactionByIdResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	id, err := uuid.Parse(req.Msg.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	transaction, ok, err := s.core.GetTransactionById(ctx, *user.ActiveProfile, id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	if !ok {
		return nil, connect.NewError(connect.CodeNotFound, nil)
	}

	res := connect.NewResponse(&mdv4.GetTransactionByIdResponse{
		Transaction: conversion.TransactionFromCore(transaction),
	})
	return res, nil
}

func (s *apiServer) GetTransactionPage(ctx context.Context, req *connect.Request[mdv4.GetTransactionPageRequest]) (*connect.Response[mdv4.GetTransactionPageResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	page, err := s.core.GetTransactionPage(ctx, *user.ActiveProfile, req.Msg.Page, req.Msg.PerPage, req.Msg.SearchPattern)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&mdv4.GetTransactionPageResponse{
		Total:            page.Total,
		FilteredTotal:    page.FilteredTotal,
		FilteredEntities: conversiontools.ConvertSlice(page.FilteredEntities, conversion.TransactionFromCore),
	})
	return res, nil
}

func (s *apiServer) UpsertTransaction(ctx context.Context, req *connect.Request[mdv4.UpsertTransactionRequest]) (*connect.Response[mdv4.UpsertTransactionResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	transaction := conversion.TransactionToCore(req.Msg.Transaction)
	err = s.core.UpsertTransaction(ctx, *user.ActiveProfile, transaction)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&mdv4.UpsertTransactionResponse{})
	return res, nil
}

func (s *apiServer) DeleteTransaction(ctx context.Context, req *connect.Request[mdv4.DeleteTransactionRequest]) (*connect.Response[mdv4.DeleteTransactionResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	id, err := uuid.Parse(req.Msg.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	err = s.core.DeleteTransaction(ctx, *user.ActiveProfile, id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&mdv4.DeleteTransactionResponse{})
	return res, nil
}
