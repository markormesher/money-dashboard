package api

import (
	"context"

	"connectrpc.com/connect"
	"github.com/google/uuid"
	"github.com/markormesher/money-dashboard/internal/api/conversion"
	mdv4 "github.com/markormesher/money-dashboard/internal/api_gen/moneydashboard/v4"
	"github.com/markormesher/money-dashboard/internal/conversiontools"
)

func (s *apiServer) GetEnvelopeById(ctx context.Context, req *connect.Request[mdv4.GetEnvelopeByIdRequest]) (*connect.Response[mdv4.GetEnvelopeByIdResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	id, err := uuid.Parse(req.Msg.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	envelope, ok, err := s.core.GetEnvelopeById(ctx, *user.ActiveProfile, id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	if !ok {
		return nil, connect.NewError(connect.CodeNotFound, nil)
	}

	res := connect.NewResponse(&mdv4.GetEnvelopeByIdResponse{
		Envelope: conversion.EnvelopeFromCore(envelope),
	})
	return res, nil
}

func (s *apiServer) GetAllEnvelopes(ctx context.Context, req *connect.Request[mdv4.GetAllEnvelopesRequest]) (*connect.Response[mdv4.GetAllEnvelopesResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	envelopes, err := s.core.GetAllEnvelopes(ctx, *user.ActiveProfile)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&mdv4.GetAllEnvelopesResponse{
		Envelopes: conversiontools.ConvertSlice(envelopes, conversion.EnvelopeFromCore),
	})
	return res, nil
}

func (s *apiServer) UpsertEnvelope(ctx context.Context, req *connect.Request[mdv4.UpsertEnvelopeRequest]) (*connect.Response[mdv4.UpsertEnvelopeResponse], error) {
	user, err := s.getReqUser(ctx, req)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	envelope := conversion.EnvelopeToCore(req.Msg.Envelope)
	err = s.core.UpsertEnvelope(ctx, *user.ActiveProfile, envelope)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&mdv4.UpsertEnvelopeResponse{})
	return res, nil
}
