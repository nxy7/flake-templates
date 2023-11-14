package handlers

import "github.com/labstack/echo/v4"

func (h *HandlerCtx) GetUser(c echo.Context) error {
	u := h.db.GetUser()
	return c.String(200, u)
}
