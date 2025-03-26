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
