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
	generateIcon(curDirs[0], "蓝色", "AAAA", "", "", "", 100, 10, 20)
	// generateIcon(curDirs[0], "蓝色", "Download", "", "D:/D Icons/Old/download.ico", "", 100, 10, 10)
	//
}
