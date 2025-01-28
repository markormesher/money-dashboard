package database

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/markormesher/money-dashboard/internal/database_gen"
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
