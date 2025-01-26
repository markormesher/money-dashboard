package core

import (
	"github.com/markormesher/money-dashboard/internal/config"
	"github.com/markormesher/money-dashboard/internal/database"
)

type Core struct {
	DB     *database.DB
	Config config.Config
}
