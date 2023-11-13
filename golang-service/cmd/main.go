package main

import (
	"fmt"
	"golang-template/pkg/api"
)

func main() {
	fmt.Println("This is golang service starter template")
	fmt.Println("You might want to change module name to something more descriptive")

	s := api.MakeDefaultServer()
	s.Start(":1234")
}
