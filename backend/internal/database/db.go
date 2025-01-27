package database

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/markormesher/money-dashboard/internal/database_gen"
	"github.com/markormesher/money-dashboard/internal/schema"
)

type DBConn interface {
	Begin(context.Context) (pgx.Tx, error)
	Exec(context.Context, string, ...interface{}) (pgconn.CommandTag, error)
	Query(context.Context, string, ...interface{}) (pgx.Rows, error)
	QueryRow(context.Context, string, ...interface{}) pgx.Row
}

type DB struct {
	conn    DBConn
	queries database_gen.Queries
}

func New(conn DBConn) *DB {
	return &DB{
		conn:    conn,
		queries: *database_gen.New(conn),
	}
}

// goverter:converter
// goverter:output:format function
// goverter:output:file ./conversion/generated.go
// goverter:output:package github.com/markormesher/money-dashboard/internal/database/conversion
// goverter:extend github.com/markormesher/money-dashboard/internal/uuidtools:ConvertPostgresUUIDToNormal
// goverter:extend github.com/markormesher/money-dashboard/internal/uuidtools:ConvertNormalUUIDToPostgres
type converterSpec interface {
	UserToCore(source database_gen.Usr) schema.User
	UserFromCore(source schema.User) database_gen.Usr
}
