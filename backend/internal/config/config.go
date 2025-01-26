package config

import (
	"fmt"
	"os"

	"github.com/markormesher/money-dashboard/internal/logging"
)

var l = logging.Logger

type Config struct {
	PostgresConnectionStr string
	FrontendDistPath      string
}

func GetConfig() (Config, error) {
	postgresConnectionStr := os.Getenv("POSTGRES_CONNECTION_STRING")
	if postgresConnectionStr == "" {
		return Config{}, fmt.Errorf("postgres connection string not specified")
	}

	frontendDistPath := os.Getenv("FRONTEND_DIST_PATH")
	if frontendDistPath == "" {
		// take a guess that we're running in dev mode
		frontendDistPath = "../frontend/dist"
	}

	return Config{
		PostgresConnectionStr: postgresConnectionStr,
		FrontendDistPath:      frontendDistPath,
	}, nil
}
