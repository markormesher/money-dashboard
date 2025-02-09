package api

import (
	"context"

	"connectrpc.com/connect"
	"github.com/markormesher/money-dashboard/internal/api/conversion"
	mdv4 "github.com/markormesher/money-dashboard/internal/api_gen/moneydashboard/v4"
	"github.com/markormesher/money-dashboard/internal/conversiontools"
)

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
