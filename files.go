// !01-21终于解决vsc调试以及多文件问题……
package main

// package main

import (
	"fmt"
	// "io/fs"
	"log"
	"os"
)

func updateDir(cwd string) {
	// !……和js一样反过来的……
	// ! = "D:/"不支持默认参数/可选参数……啊啊？
	if cwd == "" {
		cwd = "D:/"
	}
	// curDirs := []fs.DirEntry{}
	curDirs = nil
	// !……所以居然是用nil来重置……
	dirs, err := os.ReadDir(cwd)
	if err != nil {
		log.Fatal(err)
		// !Fatal本身包含了return
		// return
	}
	for _, dir := range dirs {
		// fmt.Println(dir.Name())
		if dir.IsDir() {
			curDirs = append(curDirs, dir)
		}
	}
	fmt.Print(curDirs)

}
