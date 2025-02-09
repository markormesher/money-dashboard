package main

import (
	"context"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/markormesher/money-dashboard/internal/api"
	"github.com/markormesher/money-dashboard/internal/api_gen/moneydashboard/v4/mdv4connect"
	"github.com/markormesher/money-dashboard/internal/config"
	"github.com/markormesher/money-dashboard/internal/core"
	"github.com/markormesher/money-dashboard/internal/database"
	"github.com/markormesher/money-dashboard/internal/logging"
	"github.com/markormesher/money-dashboard/internal/spa"
)

var l = logging.Logger

func main() {
	// config
	cfg, err := config.GetConfig()
	if err != nil {
		l.Error("failed to load config", "error", err)
		os.Exit(1)
	}

	// db
	pool, db := setupDB(cfg)
	defer pool.Close()

	// core logic
	core := core.Core{
		Config: cfg,
		DB:     db,
	}

	// server router
	mux := mux.NewRouter()

	// backend server
	apiServer := api.NewApiServer(&core)

	var apiPath string
	var apiHandler http.Handler

	apiPath, apiHandler = mdv4connect.NewMDCurrencyServiceHandler(apiServer)
	mux.PathPrefix(apiPath).Handler(apiHandler)

	apiPath, apiHandler = mdv4connect.NewMDUserServiceHandler(apiServer)
	mux.PathPrefix(apiPath).Handler(apiHandler)

	// frontend server
	spaServer := spa.SinglePageApp{
		ContentBase: cfg.FrontendDistPath,
		IndexPage:   "index.html",
	}
	mux.PathPrefix("/").Handler(spaServer.Handler())

	// actual HTTP server
	err = http.ListenAndServe("0.0.0.0:8080", mux)
	if err != nil {
		l.Error("failed to start server", "error", err)
		os.Exit(1)
	}
}

func setupDB(cfg config.Config) (*pgxpool.Pool, *database.DB) {
	pool, err := pgxpool.New(context.Background(), cfg.PostgresConnectionStr)
	if err != nil {
		l.Error("failed to init database connection pool", "error", err)
		os.Exit(1)
	}

	l.Info("checking database connectivity")
	attemptsLeft := 5
	for {
		err = pool.Ping(context.Background())
		if err != nil {
			l.Error("failed to connect to database", "error", err)
			if attemptsLeft > 0 {
				l.Info("retrying in 2 seconds")
				time.Sleep(time.Duration(2) * time.Second)
			} else {
				os.Exit(1)
			}
		}
		break
	}
	l.Info("database connectivity okay")

	db := database.New(pool)

	l.Info("migrating database")
	err = db.Migrate(context.Background(), "/app/sql/migrations")
	if err != nil {
		l.Error("failed to mirgate database", "error", err)
		os.Exit(1)
	}
	l.Info("database migration completed")

	return pool, db
}
