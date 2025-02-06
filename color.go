package main

import (
	"image/color"
	"strconv"
	"strings"
)

func hex2RGB(hex string) color.RGBA {
	hex = strings.TrimPrefix(hex, "#")
	if len(hex) != 6 {
		return color.RGBA{0, 0, 0, 255}
	}
	r, _ := strconv.ParseInt(hex[:2], 16, 16)
	g, _ := strconv.ParseInt(hex[2:4], 16, 16)
	b, _ := strconv.ParseInt(hex[4:], 16, 16)
	return color.RGBA{uint8(r), uint8(g), uint8(b), 255}
}
