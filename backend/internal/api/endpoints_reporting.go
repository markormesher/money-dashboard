package api

import (
	"context"

	"connectrpc.com/connect"
	"github.com/markormesher/money-dashboard/internal/api/conversion"
	mdv4 "github.com/markormesher/money-dashboard/internal/api_gen/moneydashboard/v4"
	"github.com/markormesher/money-dashboard/internal/conversiontools"
	"github.com/markormesher/money-dashboard/internal/schema"
)

func (s *apiServer) GetHoldingBalances(ctx context.Context, req *connect.Request[mdv4.GetHoldingBalancesRequest]) (*connect.Response[mdv4.GetHoldingBalancesResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	balances, err := s.core.GetHoldingBalances(ctx, *user.ActiveProfile)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&mdv4.GetHoldingBalancesResponse{
		Balances: conversiontools.ConvertSlice(balances, conversion.HoldingBalanceFromCore),
	})
	return res, nil
}

func (s *apiServer) GetNonZeroMemoBalances(ctx context.Context, req *connect.Request[mdv4.GetNonZeroMemoBalancesRequest]) (*connect.Response[mdv4.GetNonZeroMemoBalancesResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	balances, err := s.core.GetNonZeroMemoBalances(ctx, *user.ActiveProfile)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&mdv4.GetNonZeroMemoBalancesResponse{
		Balances: conversiontools.ConvertSlice(balances, conversion.CategoryBalanceFromCore),
	})
	return res, nil
}

func (s *apiServer) GetEnvelopeBalances(ctx context.Context, req *connect.Request[mdv4.GetEnvelopeBalancesRequest]) (*connect.Response[mdv4.GetEnvelopeBalancesResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	balances, err := s.core.GetEnvelopeBalances(ctx, *user.ActiveProfile)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&mdv4.GetEnvelopeBalancesResponse{
		Balances: conversiontools.ConvertSlice(balances, conversion.EnvelopeBalanceFromCore),
	})
	return res, nil
}

func (s *apiServer) GetBalanceHistory(ctx context.Context, req *connect.Request[mdv4.GetBalanceHistoryRequest]) (*connect.Response[mdv4.GetBalanceHistoryResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	startDate := conversion.ConvertIntToTime(req.Msg.StartDate)
	if err := schema.ValidateDate(startDate); err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	endDate := conversion.ConvertIntToTime(req.Msg.EndDate)
	if err := schema.ValidateDate(endDate); err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	balances, err := s.core.GetBalanceHistory(ctx, *user.ActiveProfile, startDate, endDate)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&mdv4.GetBalanceHistoryResponse{
		Entries: conversiontools.ConvertSlice(balances, conversion.BalanceHistoryEntryFromCore),
	})
	return res, nil
}

func (s *apiServer) GetTaxReport(ctx context.Context, req *connect.Request[mdv4.GetTaxReportRequest]) (*connect.Response[mdv4.GetTaxReportResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	report, err := s.core.GetTaxReport(ctx, *user.ActiveProfile, int(req.Msg.GetTaxYear()))
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&mdv4.GetTaxReportResponse{
		TaxReport: conversion.TaxReportFromCore(report),
	})
	return res, nil
}
