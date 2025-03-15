package api

import (
	"context"

	"connectrpc.com/connect"
	"github.com/markormesher/money-dashboard/internal/api/conversion"
	mdv4 "github.com/markormesher/money-dashboard/internal/api_gen/moneydashboard/v4"
	"github.com/markormesher/money-dashboard/internal/conversiontools"
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
