package schema

import (
	"fmt"
	"time"
)

func ValidateDate(value time.Time) error {
	if value.Before(PlatformMinimumDate) {
		return fmt.Errorf("date must not be before the platform minimum date")
	}

	if value.After(PlatformMaximumDate) {
		return fmt.Errorf("date must not be after the platform maximum date")
	}

	return nil
}
