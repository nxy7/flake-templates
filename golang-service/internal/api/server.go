package api

import (
	"golang-template/internal/api/handlers"

	"github.com/labstack/echo/v4"
)

// Returns server using default handler created from env variables
func MakeDefaultServer() *echo.Echo {
	h := handlers.CtxFromEnv()
	return MakeServer(h)
}

func MakeServer(h handlers.HandlerCtx) *echo.Echo {
	e := echo.New()

	e.GET("/health", h.HandleHealth)

	return e

}
