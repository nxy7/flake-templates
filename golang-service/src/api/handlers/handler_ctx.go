package handlers

import "golang-template/src/storage"

type HandlerCtx struct {
	db *storage.Storage
}

func FromEnv() HandlerCtx {
	return HandlerCtx{}
}
