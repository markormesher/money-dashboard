package config

import (
	"fmt"
	"os"

	"github.com/markormesher/money-dashboard/internal/logging"
)

var l = logging.Logger

type Config struct {
	DevMode               bool
	PostgresConnectionStr string
	FrontendDistPath      string
}

func GetConfig() (Config, error) {
	devMode := os.Getenv("DEV_MODE") != ""

	postgresConnectionStr := os.Getenv("POSTGRES_CONNECTION_STRING")
	if postgresConnectionStr == "" {
		return Config{}, fmt.Errorf("postgres connection string not specified")
	}

	frontendDistPath := os.Getenv("FRONTEND_DIST_PATH")
	if frontendDistPath == "" {
		return Config{}, fmt.Errorf("frontend path not specified")
	}

	return Config{
		DevMode:               devMode,
		PostgresConnectionStr: postgresConnectionStr,
		FrontendDistPath:      frontendDistPath,
	}, nil
}
