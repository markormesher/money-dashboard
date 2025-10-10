module github.com/markormesher/money-dashboard

go 1.25.2

require (
	connectrpc.com/connect v1.19.1
	github.com/google/uuid v1.6.0
	github.com/gorilla/mux v1.8.1
	github.com/govalues/decimal v0.1.36
	github.com/jackc/pgx/v5 v5.7.6
	google.golang.org/protobuf v1.36.10
)

require (
	github.com/BurntSushi/toml v1.4.1-0.20240526193622-a339e1f7089c // indirect
	github.com/dave/jennifer v1.6.0 // indirect
	github.com/jackc/pgpassfile v1.0.0 // indirect
	github.com/jackc/pgservicefile v0.0.0-20240606120523-5a60cdf6a761 // indirect
	github.com/jackc/puddle/v2 v2.2.2 // indirect
	github.com/jmattheis/goverter v1.8.0 // indirect
	github.com/kisielk/errcheck v1.9.0 // indirect
	golang.org/x/crypto v0.37.0 // indirect
	golang.org/x/exp/typeparams v0.0.0-20231108232855-2478ac86f678 // indirect
	golang.org/x/mod v0.23.0 // indirect
	golang.org/x/sync v0.13.0 // indirect
	golang.org/x/text v0.24.0 // indirect
	golang.org/x/tools v0.30.0 // indirect
	honnef.co/go/tools v0.6.1 // indirect
)

tool (
	github.com/jmattheis/goverter/cmd/goverter
	github.com/kisielk/errcheck
	honnef.co/go/tools/cmd/staticcheck
)
