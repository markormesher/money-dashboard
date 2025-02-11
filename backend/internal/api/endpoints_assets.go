package api

import (
	"context"

	"connectrpc.com/connect"
	"github.com/google/uuid"
	"github.com/markormesher/money-dashboard/internal/api/conversion"
	mdv4 "github.com/markormesher/money-dashboard/internal/api_gen/moneydashboard/v4"
	"github.com/markormesher/money-dashboard/internal/conversiontools"
)

func (s *apiServer) GetAssetById(ctx context.Context, req *connect.Request[mdv4.GetAssetByIdRequest]) (*connect.Response[mdv4.GetAssetByIdResponse], error) {
	_, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	id, err := uuid.Parse(req.Msg.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	asset, ok, err := s.core.GetAssetById(ctx, id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	if !ok {
		return nil, connect.NewError(connect.CodeNotFound, nil)
	}

	res := connect.NewResponse(&mdv4.GetAssetByIdResponse{
		Asset: conversion.AssetFromCore(asset),
	})
	return res, nil
}

func (s *apiServer) GetAllAssets(ctx context.Context, req *connect.Request[mdv4.GetAllAssetsRequest]) (*connect.Response[mdv4.GetAllAssetsResponse], error) {
	_, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	assets, err := s.core.GetAllAssets(ctx)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&mdv4.GetAllAssetsResponse{
		Assets: conversiontools.ConvertSlice(assets, conversion.AssetFromCore),
	})
	return res, nil
}

func (s *apiServer) UpsertAsset(ctx context.Context, req *connect.Request[mdv4.UpsertAssetRequest]) (*connect.Response[mdv4.UpsertAssetResponse], error) {
	_, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	asset := conversion.AssetToCore(req.Msg.Asset)
	err = s.core.UpsertAsset(ctx, asset)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&mdv4.UpsertAssetResponse{})
	return res, nil
}

func (s *apiServer) GetLatestAssetPrices(ctx context.Context, req *connect.Request[mdv4.GetLatestAssetPricesRequest]) (*connect.Response[mdv4.GetLatestAssetPricesResponse], error) {
	_, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	prices, err := s.core.GetLatestAssetPrices(ctx)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&mdv4.GetLatestAssetPricesResponse{
		AssetPrices: conversiontools.ConvertSlice(prices, conversion.AssetPriceFromCore),
	})
	return res, nil
}

func (s *apiServer) UpsertAssetPrice(ctx context.Context, req *connect.Request[mdv4.UpsertAssetPriceRequest]) (*connect.Response[mdv4.UpsertAssetPriceResponse], error) {
	secret := req.Header().Get("x-api-key")
	if secret != s.core.Config.ExternalDataSecret {
		return nil, connect.NewError(connect.CodeUnauthenticated, nil)
	}

	price := conversion.AssetPriceToCore(req.Msg.Price)
	err := s.core.UpsertAssetPrice(ctx, price)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&mdv4.UpsertAssetPriceResponse{})
	return res, nil
}
