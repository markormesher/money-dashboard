package conversiontools

func ConvertSlice[F, T any](source []F, f func(F) T) []T {
	if source == nil {
		return nil
	}

	output := make([]T, len(source))
	for i, v := range source {
		fv := f(v)
		output[i] = fv
	}

	return output
}

func ConvertSlicePtr[F, T any](source []F, f func(*F) *T) []*T {
	if source == nil {
		return nil
	}

	output := make([]*T, len(source))
	for i, v := range source {
		fv := f(&v)
		output[i] = fv
	}

	return output
}
