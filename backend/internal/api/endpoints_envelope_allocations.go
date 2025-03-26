package api

import (
	"context"

	"connectrpc.com/connect"
	"github.com/google/uuid"
	"github.com/markormesher/money-dashboard/internal/api/conversion"
	mdv4 "github.com/markormesher/money-dashboard/internal/api_gen/moneydashboard/v4"
	"github.com/markormesher/money-dashboard/internal/conversiontools"
)

func (s *apiServer) GetEnvelopeAllocationById(ctx context.Context, req *connect.Request[mdv4.GetEnvelopeAllocationByIdRequest]) (*connect.Response[mdv4.GetEnvelopeAllocationByIdResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	id, err := uuid.Parse(req.Msg.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	account, ok, err := s.core.GetEnvelopeAllocationById(ctx, *user.ActiveProfile, id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	if !ok {
		return nil, connect.NewError(connect.CodeNotFound, nil)
	}

	res := connect.NewResponse(&mdv4.GetEnvelopeAllocationByIdResponse{
		EnvelopeAllocation: conversion.EnvelopeAllocationFromCore(account),
	})
	return res, nil
}

func (s *apiServer) GetAllEnvelopeAllocations(ctx context.Context, req *connect.Request[mdv4.GetAllEnvelopeAllocationsRequest]) (*connect.Response[mdv4.GetAllEnvelopeAllocationsResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	accounts, err := s.core.GetAllEnvelopeAllocations(ctx, *user.ActiveProfile)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&mdv4.GetAllEnvelopeAllocationsResponse{
		EnvelopeAllocations: conversiontools.ConvertSlice(accounts, conversion.EnvelopeAllocationFromCore),
	})
	return res, nil
}

func (s *apiServer) UpsertEnvelopeAllocation(ctx context.Context, req *connect.Request[mdv4.UpsertEnvelopeAllocationRequest]) (*connect.Response[mdv4.UpsertEnvelopeAllocationResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	account := conversion.EnvelopeAllocationToCore(req.Msg.EnvelopeAllocation)
	err = s.core.UpsertEnvelopeAllocation(ctx, *user.ActiveProfile, account)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&mdv4.UpsertEnvelopeAllocationResponse{})
	return res, nil
}
