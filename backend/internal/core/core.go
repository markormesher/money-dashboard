package core

import (
	"github.com/markormesher/money-dashboard/internal/config"
	"github.com/markormesher/money-dashboard/internal/database"
	"github.com/markormesher/money-dashboard/internal/logging"
)

var l = logging.Logger

type Core struct {
	DB     *database.DB
	Config config.Config
}
