package api

import (
	"context"
	"fmt"

	"connectrpc.com/connect"
	"github.com/markormesher/money-dashboard/internal/schema"
)

func (s *apiServer) GetUser(ctx context.Context, req connect.AnyRequest) (schema.User, error) {
	extUsername := req.Header().Get("remote-user")
	extName := req.Header().Get("remote-name")

	if extUsername == "" || extName == "" {
		if s.core.Config.DevMode {
			extUsername = "demo-user"
			extName = "Demo User"
		} else {
			return schema.User{}, fmt.Errorf("no user details provided")
		}
	}

	user, err := s.core.GetOrCreateUser(ctx, extUsername, extName)
	if err != nil {
		return schema.User{}, err
	}

	return user, nil
}
