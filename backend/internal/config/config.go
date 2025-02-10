package config

import (
	"fmt"
	"math/rand"
	"os"

	"github.com/markormesher/money-dashboard/internal/logging"
)

var l = logging.Logger

type Config struct {
	DevMode               bool
	PostgresConnectionStr string
	FrontendDistPath      string
	ExternalDataSecret    string
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

	externalDataSecret := os.Getenv("EXTERNAL_DATA_SECRET")
	if externalDataSecret == "" {
		if devMode {
			externalDataSecret = "foobar"
		} else {
			externalDataSecret = randomSecret()
			l.Warn("EXTERNAL_DATA_SECRET was not specified; a random secret has been generated", "externalDataSecret", externalDataSecret)
		}
	}

	return Config{
		DevMode:               devMode,
		PostgresConnectionStr: postgresConnectionStr,
		FrontendDistPath:      frontendDistPath,
		ExternalDataSecret:    externalDataSecret,
	}, nil
}

func randomSecret() string {
	letters := "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	b := make([]byte, 20)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}
