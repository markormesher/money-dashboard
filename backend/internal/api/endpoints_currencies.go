package api

import (
	"context"

	"connectrpc.com/connect"
	"github.com/google/uuid"
	"github.com/markormesher/money-dashboard/internal/api/conversion"
	mdv4 "github.com/markormesher/money-dashboard/internal/api_gen/moneydashboard/v4"
	"github.com/markormesher/money-dashboard/internal/conversiontools"
)

func (s *apiServer) GetCurrencyById(ctx context.Context, req *connect.Request[mdv4.GetCurrencyByIdRequest]) (*connect.Response[mdv4.GetCurrencyByIdResponse], error) {
	_, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	id, err := uuid.Parse(req.Msg.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	currency, ok, err := s.core.GetCurrencyById(ctx, id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	if !ok {
		return nil, connect.NewError(connect.CodeNotFound, nil)
	}

	res := connect.NewResponse(&mdv4.GetCurrencyByIdResponse{
		Currency: conversion.CurrencyFromCore(currency),
	})
	return res, nil
}

func (s *apiServer) GetAllCurrencies(ctx context.Context, req *connect.Request[mdv4.GetAllCurrenciesRequest]) (*connect.Response[mdv4.GetAllCurrenciesResponse], error) {
	_, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	currencies, err := s.core.GetAllCurrencies(ctx)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&mdv4.GetAllCurrenciesResponse{
		Currencies: conversiontools.ConvertSlice(currencies, conversion.CurrencyFromCore),
	})
	return res, nil
}

func (s *apiServer) UpsertCurrency(ctx context.Context, req *connect.Request[mdv4.UpsertCurrencyRequest]) (*connect.Response[mdv4.UpsertCurrencyResponse], error) {
	_, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	currency := conversion.CurrencyToCore(req.Msg.Currency)
	err = s.core.UpsertCurrency(ctx, currency)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&mdv4.UpsertCurrencyResponse{})
	return res, nil
}

func (s *apiServer) GetLatestCurrencyRates(ctx context.Context, req *connect.Request[mdv4.GetLatestCurrencyRatesRequest]) (*connect.Response[mdv4.GetLatestCurrencyRatesResponse], error) {
	_, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	rates, err := s.core.GetLatestCurrencyRates(ctx)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&mdv4.GetLatestCurrencyRatesResponse{
		CurrencyRates: conversiontools.ConvertSlice(rates, conversion.CurrencyRateFromCore),
	})
	return res, nil
}

func (s *apiServer) UpsertCurrencyRate(ctx context.Context, req *connect.Request[mdv4.UpsertCurrencyRateRequest]) (*connect.Response[mdv4.UpsertCurrencyRateResponse], error) {
	secret := req.Header().Get("x-api-key")
	if secret != s.core.Config.ExternalDataSecret {
		return nil, connect.NewError(connect.CodeUnauthenticated, nil)
	}

	rate := conversion.CurrencyRateToCore(req.Msg.Rate)
	err := s.core.UpsertCurrencyRate(ctx, rate)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&mdv4.UpsertCurrencyRateResponse{})
	return res, nil
}
