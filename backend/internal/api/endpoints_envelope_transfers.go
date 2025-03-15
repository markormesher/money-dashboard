package api

import (
	"context"

	"connectrpc.com/connect"
	"github.com/google/uuid"
	"github.com/markormesher/money-dashboard/internal/api/conversion"
	mdv4 "github.com/markormesher/money-dashboard/internal/api_gen/moneydashboard/v4"
	"github.com/markormesher/money-dashboard/internal/conversiontools"
)

func (s *apiServer) GetEnvelopeTransferById(ctx context.Context, req *connect.Request[mdv4.GetEnvelopeTransferByIdRequest]) (*connect.Response[mdv4.GetEnvelopeTransferByIdResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	id, err := uuid.Parse(req.Msg.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	envelopeTransfer, ok, err := s.core.GetEnvelopeTransferById(ctx, *user.ActiveProfile, id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	if !ok {
		return nil, connect.NewError(connect.CodeNotFound, nil)
	}

	res := connect.NewResponse(&mdv4.GetEnvelopeTransferByIdResponse{
		EnvelopeTransfer: conversion.EnvelopeTransferFromCore(envelopeTransfer),
	})
	return res, nil
}

func (s *apiServer) GetEnvelopeTransferPage(ctx context.Context, req *connect.Request[mdv4.GetEnvelopeTransferPageRequest]) (*connect.Response[mdv4.GetEnvelopeTransferPageResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	page, err := s.core.GetEnvelopeTransferPage(ctx, *user.ActiveProfile, req.Msg.Page, req.Msg.PerPage, req.Msg.SearchPattern)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&mdv4.GetEnvelopeTransferPageResponse{
		Total:            page.Total,
		FilteredTotal:    page.FilteredTotal,
		FilteredEntities: conversiontools.ConvertSlice(page.FilteredEntities, conversion.EnvelopeTransferFromCore),
	})
	return res, nil
}

func (s *apiServer) UpsertEnvelopeTransfer(ctx context.Context, req *connect.Request[mdv4.UpsertEnvelopeTransferRequest]) (*connect.Response[mdv4.UpsertEnvelopeTransferResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	envelopeTransfer := conversion.EnvelopeTransferToCore(req.Msg.EnvelopeTransfer)
	err = s.core.UpsertEnvelopeTransfer(ctx, *user.ActiveProfile, envelopeTransfer)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&mdv4.UpsertEnvelopeTransferResponse{})
	return res, nil
}

func (s *apiServer) DeleteEnvelopeTransfer(ctx context.Context, req *connect.Request[mdv4.DeleteEnvelopeTransferRequest]) (*connect.Response[mdv4.DeleteEnvelopeTransferResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	id, err := uuid.Parse(req.Msg.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	err = s.core.DeleteEnvelopeTransfer(ctx, *user.ActiveProfile, id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&mdv4.DeleteEnvelopeTransferResponse{})
	return res, nil
}
