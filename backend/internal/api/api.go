package api

import (
	"net/http"

	mdv4 "github.com/markormesher/money-dashboard/internal/api_gen/moneydashboard/v4"
	"github.com/markormesher/money-dashboard/internal/api_gen/moneydashboard/v4/mdv4connect"
	"github.com/markormesher/money-dashboard/internal/core"
	"github.com/markormesher/money-dashboard/internal/schema"
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

// goverter:converter
// goverter:output:format function
// goverter:output:file ./conversion/generated.go
// goverter:output:package github.com/markormesher/money-dashboard/internal/api/conversion
// goverter:extend github.com/markormesher/money-dashboard/internal/uuidtools:ConvertStringUUIDToNormal
// goverter:extend github.com/markormesher/money-dashboard/internal/uuidtools:ConvertNormalUUIDToString
type converterSpec interface {
	UserToCore(source *mdv4.User) *schema.User

	// goverter:ignore state sizeCache unknownFields
	UserFromCore(source schema.User) *mdv4.User
}
