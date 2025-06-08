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

	if t.Date.After(PlatformMaximumDate) {
		return fmt.Errorf("date must not be after the platform maximum date")
	}

	if t.BudgetDate.Before(PlatformMinimumDate) {
		return fmt.Errorf("budget date must not be before the platform minimum date")
	}

	if t.BudgetDate.After(PlatformMaximumDate) {
		return fmt.Errorf("budget date must not be after the platform maximum date")
	}

	if t.CreationDate.Before(PlatformMinimumDate) {
		return fmt.Errorf("creation must not be before the platform minimum date")
	}

	if t.CreationDate.After(PlatformMaximumDate) {
		return fmt.Errorf("creation must not be after the platform maximum date")
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

	if t.UnitValue.IsNeg() {
		return fmt.Errorf("unit value must be positive")
	}

	if t.Category.IsCapitalEventFee && t.Amount.IsPos() {
		return fmt.Errorf("capital event fees must be negative")
	}

	if (t.Category.IsInterestIncome || t.Category.IsDividendIncome) && t.Holding.Currency == nil {
		return fmt.Errorf("category requires a cash-backed holding")
	}

	if t.Category.IsInterestIncome && t.Amount.IsNeg() {
		return fmt.Errorf("interest income must be positive")
	}

	if t.Category.IsDividendIncome && t.Amount.IsNeg() {
		return fmt.Errorf("dividend income must be positive")
	}

	return nil
}

type TransactionPage struct {
	Total            int32
	FilteredTotal    int32
	FilteredEntities []Transaction
}
