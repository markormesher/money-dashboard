package schema

import (
	"fmt"
	"unicode/utf8"

	"github.com/google/uuid"
)

type Category struct {
	ID                     uuid.UUID
	Name                   string
	IsMemo                 bool
	IsInterestIncome       bool
	IsDividendIncome       bool
	IsPensionContribution  bool
	IsCapitalEvent         bool
	IsCapitalEventFee      bool
	IsSyntheticAssetUpdate bool
	Profile                *Profile
	Active                 bool
}

func (c *Category) Validate() error {
	if utf8.RuneCountInString(c.Name) < 1 {
		return fmt.Errorf("category name must be at least 1 character")
	}

	mutuallyExclusiveFlags := []bool{
		c.IsMemo, c.IsInterestIncome, c.IsDividendIncome, c.IsCapitalEvent, c.IsCapitalEventFee, c.IsSyntheticAssetUpdate,
	}
	mutuallyExclusiveCount := 0
	for _, v := range mutuallyExclusiveFlags {
		if v {
			mutuallyExclusiveCount++
		}
	}
	if mutuallyExclusiveCount > 1 {
		return fmt.Errorf("category cannot use more than one mutually exclusive flag")
	}

	return nil
}
