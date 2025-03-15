package core

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/markormesher/money-dashboard/internal/schema"
)

func (c *Core) GetEnvelopeTransferById(ctx context.Context, profile schema.Profile, id uuid.UUID) (schema.EnvelopeTransfer, bool, error) {
	return c.DB.GetEnvelopeTransferById(ctx, id, profile.ID)
}

func (c *Core) GetEnvelopeTransferPage(ctx context.Context, profile schema.Profile, page int32, perPage int32, searchPattern string) (schema.EnvelopeTransferPage, error) {
	total, err := c.DB.GetEnvelopeTransferPageTotal(ctx, profile.ID)
	if err != nil {
		return schema.EnvelopeTransferPage{}, err
	}

	filteredTotal, err := c.DB.GetEnvelopeTransferPageFilteredTotal(ctx, profile.ID, searchPattern)
	if err != nil {
		return schema.EnvelopeTransferPage{}, err
	}

	filteredEntites, err := c.DB.GetEnvelopeTransferPageFilteredEntities(ctx, profile.ID, page, perPage, searchPattern)
	if err != nil {
		return schema.EnvelopeTransferPage{}, err
	}

	return schema.EnvelopeTransferPage{
		Total:            total,
		FilteredTotal:    filteredTotal,
		FilteredEntities: filteredEntites,
	}, nil
}

func (c *Core) UpsertEnvelopeTransfer(ctx context.Context, profile schema.Profile, envelopeTransfer schema.EnvelopeTransfer) error {
	if err := envelopeTransfer.Validate(); err != nil {
		return fmt.Errorf("invalid value: %w", err)
	}

	if envelopeTransfer.ID == uuid.Nil {
		envelopeTransfer.ID = uuid.New()
	} else {
		_, ok, err := c.GetEnvelopeTransferById(ctx, profile, envelopeTransfer.ID)
		if err != nil {
			return err
		} else if !ok {
			return fmt.Errorf("no such envelope transfer")
		}
	}

	return c.DB.UpsertEnvelopeTransfer(ctx, envelopeTransfer, profile.ID)
}

func (c *Core) DeleteEnvelopeTransfer(ctx context.Context, profile schema.Profile, id uuid.UUID) error {
	_, ok, err := c.GetEnvelopeTransferById(ctx, profile, id)
	if err != nil {
		return err
	} else if !ok {
		return fmt.Errorf("no such envelope transfer")
	}

	return c.DB.DeleteEnvelopeTransfer(ctx, id, profile.ID)
}
