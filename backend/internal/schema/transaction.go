package schema

import (
	"fmt"
	"time"
	"unicode/utf8"

	"github.com/google/uuid"
	"github.com/govalues/decimal"
)

type Transaction struct {
	ID           uuid.UUID
	Date         time.Time
	BudgetDate   time.Time
	CreationDate time.Time
	Payee        string
	Notes        string
	Amount       decimal.Decimal
	UnitValue    decimal.Decimal
	Holding      *Holding
	Category     *Category
	Profile      *Profile
	Deleted      bool
}

func (t *Transaction) Validate() error {
	if t.Date.Before(PlatformMinimumDate) {
		return fmt.Errorf("date must not be before the platform minimum date")
	}

	if t.BudgetDate.Before(PlatformMinimumDate) {
		return fmt.Errorf("budget date must not be before the platform minimum date")
	}

	if t.CreationDate.Before(PlatformMinimumDate) {
		return fmt.Errorf("creation must not be before the platform minimum date")
	}

	if utf8.RuneCountInString(t.Payee) < 1 {
		return fmt.Errorf("payee must be at least 1 character")
	}

	if t.Holding == nil {
		return fmt.Errorf("transaction must be linked to a holding")
	}

	if t.Category == nil {
		return fmt.Errorf("transaction must be linked to a category")
	}

	return nil
}

type TransactionPage struct {
	Total            int32
	FilteredTotal    int32
	FilteredEntities []Transaction
}
