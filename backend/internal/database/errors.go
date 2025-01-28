package database

type ErrNoValues struct{}

func (e ErrNoValues) Error() string {
	return "the query returned no values"
}
