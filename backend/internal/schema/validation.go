package schema

import (
	"fmt"
	"time"
)

func ValidateDate(value time.Time) error {
	if value.Before(PlatformMinimumDate) {
		return fmt.Errorf("date must not be before the platform minimum date")
	}

	return nil
}
