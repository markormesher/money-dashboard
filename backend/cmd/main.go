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
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
)

var l = logging.Logger

func main() {
	// config
	cfg, err := config.GetConfig()
	if err != nil {
		l.Error("failed to load config", "error", err)
		os.Exit(1)
	}

	// db init
	pool, err := pgxpool.New(context.Background(), cfg.PostgresConnectionStr)
	if err != nil {
		l.Error("failed to init database connection pool", "error", err)
		os.Exit(1)
	}
	defer pool.Close()

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

	// core logic
	core := core.Core{
		Config: cfg,
		DB:     db,
	}
	apiServer := api.NewApiServer(&core)

	// server setup
	mux := mux.NewRouter()

	// auth
	// mux.Use(apiServer.AuthMiddleware)

	// backend server
	apiPath, apiHandler := mdv4connect.NewMDServiceHandler(apiServer)
	mux.PathPrefix(apiPath).Handler(apiHandler)

	// frontend server
	appServer := spa.SinglePageApp{
		ContentBase: cfg.FrontendDistPath,
		IndexPage:   "index.html",
	}
	mux.PathPrefix("/").Handler(appServer.Handler())

	http.ListenAndServe(
		"0.0.0.0:8080",
		h2c.NewHandler(mux, &http2.Server{}),
	)
}
