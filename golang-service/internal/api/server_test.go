package api

import (
	"io"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestServer(t *testing.T) {

	e := MakeDefaultServer()
	go func() {
		if err := e.Start(":11111"); err != nil {
			panic(err)
		}
	}()

	t.Run("endpoint=/health", func(t *testing.T) {
		req, err := http.Get("http://localhost:11111/health")
		assert.Nil(t, err)

		response, err := io.ReadAll(req.Body)
		assert.Nil(t, err)

		assert.Equal(t, "alive", string(response))
	})
}
