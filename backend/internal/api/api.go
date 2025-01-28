package api

import (
	"net/http"

	"github.com/markormesher/money-dashboard/internal/api_gen/moneydashboard/v4/mdv4connect"
	"github.com/markormesher/money-dashboard/internal/core"
)

type apiServer struct {
	core *core.Core
}

func NewApiServer(c *core.Core) *apiServer {
	return &apiServer{
		core: c,
	}
}

func (s *apiServer) ConfigureMux(mux *http.ServeMux) {
	path, handler := mdv4connect.NewMDServiceHandler(s)
	mux.Handle(path, handler)
}
