package handlers

import "golang-template/pkg/storage"

type HandlerCtx struct {
	db *storage.Storage
}

func FromEnv() HandlerCtx {
	return HandlerCtx{}
}
