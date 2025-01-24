package main

import (
	// "util"
	"io/fs"
	// "FolderIconsGenSet/util"
)

var curDirs = []fs.DirEntry{}

func main() {
	// yamlTest()
	updateDir("")
	generateIcon(curDirs[0], "蓝色", "", "D:/D Icons/Old/download.ico", "", "", 50, 10)
}
