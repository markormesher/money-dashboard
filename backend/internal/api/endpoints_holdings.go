package api

import (
	"context"

	"connectrpc.com/connect"
	"github.com/google/uuid"
	"github.com/markormesher/money-dashboard/internal/api/conversion"
	mdv4 "github.com/markormesher/money-dashboard/internal/api_gen/moneydashboard/v4"
	"github.com/markormesher/money-dashboard/internal/conversiontools"
)

func (s *apiServer) GetHoldingById(ctx context.Context, req *connect.Request[mdv4.GetHoldingByIdRequest]) (*connect.Response[mdv4.GetHoldingByIdResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	id, err := uuid.Parse(req.Msg.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	holding, ok, err := s.core.GetHoldingById(ctx, id, user.ActiveProfile.ID)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	if !ok {
		return nil, connect.NewError(connect.CodeNotFound, nil)
	}

	res := connect.NewResponse(&mdv4.GetHoldingByIdResponse{
		Holding: conversion.HoldingFromCore(holding),
	})
	return res, nil
}

func (s *apiServer) GetAllHoldings(ctx context.Context, req *connect.Request[mdv4.GetAllHoldingsRequest]) (*connect.Response[mdv4.GetAllHoldingsResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	holdings, err := s.core.GetAllHoldingsForProfile(ctx, user.ActiveProfile.ID)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&mdv4.GetAllHoldingsResponse{
		Holdings: conversiontools.ConvertSlice(holdings, conversion.HoldingFromCore),
	})
	return res, nil
}

func (s *apiServer) UpsertHolding(ctx context.Context, req *connect.Request[mdv4.UpsertHoldingRequest]) (*connect.Response[mdv4.UpsertHoldingResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	holding := conversion.HoldingToCore(req.Msg.Holding)
	err = s.core.UpsertHolding(ctx, holding, user.ActiveProfile.ID)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&mdv4.UpsertHoldingResponse{})
	return res, nil
}
