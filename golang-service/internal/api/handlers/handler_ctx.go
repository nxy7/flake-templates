package handlers

import "golang-template/internal/storage"

type HandlerCtx struct {
	db storage.Storage
}

func CtxFromEnv() HandlerCtx {
	return HandlerCtx{}
}
