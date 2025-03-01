package api

import (
	"context"

	"connectrpc.com/connect"
	"github.com/markormesher/money-dashboard/internal/api/conversion"
	mdv4 "github.com/markormesher/money-dashboard/internal/api_gen/moneydashboard/v4"
	"github.com/markormesher/money-dashboard/internal/conversiontools"
)

func (s *apiServer) GetLatestRates(ctx context.Context, req *connect.Request[mdv4.GetLatestRatesRequest]) (*connect.Response[mdv4.GetLatestRatesResponse], error) {
	_, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	rates, err := s.core.GetLatestRates(ctx)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&mdv4.GetLatestRatesResponse{
		Rates: conversiontools.ConvertSlice(rates, conversion.RateFromCore),
	})
	return res, nil
}

func (s *apiServer) UpsertRate(ctx context.Context, req *connect.Request[mdv4.UpsertRateRequest]) (*connect.Response[mdv4.UpsertRateResponse], error) {
	secret := req.Header().Get("x-api-key")
	if secret != s.core.Config.ExternalDataSecret {
		return nil, connect.NewError(connect.CodeUnauthenticated, nil)
	}

	rate := conversion.RateToCore(req.Msg.Rate)
	err := s.core.UpsertRate(ctx, rate)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&mdv4.UpsertRateResponse{})
	return res, nil
}
