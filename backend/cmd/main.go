package main

import (
	"net/http"
	"os"

	"github.com/markormesher/money-dashboard/internal/api"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
)

func main() {
	// configure the api server
	mux := http.NewServeMux()
	apiServer := api.NewApiServer()
	apiServer.ConfigureMux(mux)

	// catch-all: serve the frontend
	frontendPath := os.Getenv("FRONTEND_DIST_PATH")
	if frontendPath == "" {
		// take a guess that we're running in dev mode
		frontendPath = "../frontend/dist"
	}
	mux.Handle("/", http.FileServer(http.Dir(frontendPath)))

	http.ListenAndServe(
		"0.0.0.0:8080",
		h2c.NewHandler(mux, &http2.Server{}),
	)
}
