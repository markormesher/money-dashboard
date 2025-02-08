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
