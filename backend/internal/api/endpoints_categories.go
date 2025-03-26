package api

import (
	"context"

	"connectrpc.com/connect"
	"github.com/google/uuid"
	"github.com/markormesher/money-dashboard/internal/api/conversion"
	mdv4 "github.com/markormesher/money-dashboard/internal/api_gen/moneydashboard/v4"
	"github.com/markormesher/money-dashboard/internal/conversiontools"
)

func (s *apiServer) GetCategoryById(ctx context.Context, req *connect.Request[mdv4.GetCategoryByIdRequest]) (*connect.Response[mdv4.GetCategoryByIdResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	id, err := uuid.Parse(req.Msg.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	category, ok, err := s.core.GetCategoryById(ctx, *user.ActiveProfile, id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	if !ok {
		return nil, connect.NewError(connect.CodeNotFound, nil)
	}

	res := connect.NewResponse(&mdv4.GetCategoryByIdResponse{
		Category: conversion.CategoryFromCore(category),
	})
	return res, nil
}

func (s *apiServer) GetAllCategories(ctx context.Context, req *connect.Request[mdv4.GetAllCategoriesRequest]) (*connect.Response[mdv4.GetAllCategoriesResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	categories, err := s.core.GetAllCategories(ctx, *user.ActiveProfile)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&mdv4.GetAllCategoriesResponse{
		Categories: conversiontools.ConvertSlice(categories, conversion.CategoryFromCore),
	})
	return res, nil
}

func (s *apiServer) UpsertCategory(ctx context.Context, req *connect.Request[mdv4.UpsertCategoryRequest]) (*connect.Response[mdv4.UpsertCategoryResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	category := conversion.CategoryToCore(req.Msg.Category)
	err = s.core.UpsertCategory(ctx, *user.ActiveProfile, category)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&mdv4.UpsertCategoryResponse{})
	return res, nil
}
