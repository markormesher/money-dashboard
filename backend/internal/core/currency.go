package core

import (
	"context"

	"github.com/markormesher/money-dashboard/internal/schema"
)

// don't change this!
const gbpCurrencyId = "b3092a40-1802-46fd-9967-11c7ac3522c5"

func (c *Core) GetAllCurrencies(ctx context.Context) ([]schema.Currency, error) {
	return c.DB.GetAllCurrencies(ctx)
}
