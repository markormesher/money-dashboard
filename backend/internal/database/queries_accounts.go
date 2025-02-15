package database

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/markormesher/money-dashboard/internal/database/conversion"
	"github.com/markormesher/money-dashboard/internal/database_gen"
	"github.com/markormesher/money-dashboard/internal/schema"
)

func (db *DB) GetAccountById(ctx context.Context, id uuid.UUID, profileID uuid.UUID) (schema.Account, bool, error) {
	row, err := db.queries.GetAccountById(ctx, database_gen.GetAccountByIdParams{
		AccountID: id,
		ProfileID: profileID,
	})
	if errors.Is(err, pgx.ErrNoRows) {
		return schema.Account{}, false, nil
	} else if err != nil {
		return schema.Account{}, false, err
	}

	account := conversion.AccountToCore(row.Account)
	profile := conversion.ProfileToCore(row.Profile)
	account.Profile = &profile

	return account, true, nil
}

func (db *DB) GetAllAccountsForProfile(ctx context.Context, profileID uuid.UUID) ([]schema.Account, error) {
	rows, err := db.queries.GetAllAccountsForProfile(ctx, profileID)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	accounts := make([]schema.Account, len(rows))
	for i, row := range rows {
		account := conversion.AccountToCore(row.Account)
		profile := conversion.ProfileToCore(row.Profile)
		account.Profile = &profile

		accounts[i] = account
	}

	return accounts, nil
}

func (db *DB) UpsertAccount(ctx context.Context, account schema.Account, profileID uuid.UUID) error {
	return db.queries.UpsertAccount(ctx, database_gen.UpsertAccountParams{
		ID:                   account.ID,
		Name:                 account.Name,
		Notes:                account.Notes,
		IsIsa:                account.IsIsa,
		IsPension:            account.IsPension,
		ExcludeFromEnvelopes: account.ExcludeFromEnvelopes,
		Active:               account.Active,
		ProfileID:            profileID,
	})
}
