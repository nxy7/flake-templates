package handlers

import "golang-template/internal/storage"

type HandlerCtx struct {
	db *storage.Storage
}

func FromEnv() HandlerCtx {
	return HandlerCtx{}
}
