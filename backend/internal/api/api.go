package api

import (
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
