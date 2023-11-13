package handlers

import "github.com/labstack/echo/v4"

func (h *HandlerCtx) HandleHealth(c echo.Context) error {
	return c.String(200, "alive")
}
