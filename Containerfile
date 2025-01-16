FROM docker.io/node:23.5.0-slim@sha256:7fdf54a2a5dc734af5b447021fdcc8c1c38a82c021a5c338efa0a38abb535a56 AS frontend-builder
WORKDIR /app

RUN corepack enable

COPY ./frontend/package.json ./frontend/pnpm-lock.yaml ./frontend
RUN cd frontend && pnpm install --frozen-lockfile

COPY ./frontend ./frontend
RUN cd frontend && pnpm build

# --

FROM docker.io/golang:1.23.4@sha256:7ea4c9dcb2b97ff8ee80a67db3d44f98c8ffa0d191399197007d8459c1453041 AS backend-builder
WORKDIR /app

COPY ./backend/go.mod ./backend/go.sum ./backend/
RUN cd backend && go mod download

COPY ./backend ./backend
RUN cd backend && go build -o ./build/main ./cmd

# --

FROM gcr.io/distroless/base-debian12@sha256:e9d0321de8927f69ce20e39bfc061343cce395996dfc1f0db6540e5145bc63a5
WORKDIR /app

LABEL image.registry=container-registry-tatsu.lan.tatsu.casa
LABEL image.name=project-census

ENV FRONTEND_DIST_PATH=/app/frontend/dist
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist
COPY --from=backend-builder /app/backend/build /app/backend/build

CMD ["/app/backend/build/main"]
