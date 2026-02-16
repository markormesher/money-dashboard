module github.com/markormesher/money-dashboard

go 1.25.3

require (
	connectrpc.com/connect v1.19.1
	github.com/google/uuid v1.6.0
	github.com/gorilla/mux v1.8.1
	github.com/govalues/decimal v0.1.36
	github.com/jackc/pgx/v5 v5.8.0
	google.golang.org/protobuf v1.36.11
)

require (
	github.com/BurntSushi/toml v1.4.1-0.20240526193622-a339e1f7089c // indirect
	github.com/dave/jennifer v1.6.0 // indirect
	github.com/jackc/pgpassfile v1.0.0 // indirect
	github.com/jackc/pgservicefile v0.0.0-20240606120523-5a60cdf6a761 // indirect
	github.com/jackc/puddle/v2 v2.2.2 // indirect
	github.com/jmattheis/goverter v1.9.3 // indirect
	github.com/kisielk/errcheck v1.9.0 // indirect
	golang.org/x/exp/typeparams v0.0.0-20231108232855-2478ac86f678 // indirect
	golang.org/x/mod v0.31.0 // indirect
	golang.org/x/sync v0.19.0 // indirect
	golang.org/x/text v0.29.0 // indirect
	golang.org/x/tools v0.40.1-0.20260108161641-ca281cf95054 // indirect
	honnef.co/go/tools v0.7.0 // indirect
)

tool (
	github.com/jmattheis/goverter/cmd/goverter
	github.com/kisielk/errcheck
	honnef.co/go/tools/cmd/staticcheck
)
