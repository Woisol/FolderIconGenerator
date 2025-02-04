package main

import (
	// "util"
	"io/fs"
	"net/http"

	"github.com/sirupsen/logrus/hooks/writer"
	// "FolderIconsGenSet/util"
)

var curDirs = []fs.DirEntry{}

func sayhelloName(w http.ResponseWriter, r *http.Request) {
	// !from https://learnku.com/docs/build-web-application-with-golang/032-go-builds-a-web-server/3169
	r.ParseForm() // 解析参数，默认是不会解析的
	// fmt.Println(r.Form)  // 这些信息是输出到服务器端的打印信息
	// fmt.Println("path", r.URL.Path)
	// fmt.Println("scheme", r.URL.Scheme)
	// fmt.Println(r.Form["url_long"])
	// for k, v := range r.Form {
	// 	fmt.Println("key:", k)
	// 	fmt.Println("val:", strings.Join(v, ""))
	// }
	fmt.Fprintf(w, "Hello astaxie!") // 这个写入到 w 的是输出到客户端的
}
func main() {
	// yamlTest()
	// updateDir("")
	// generateIcon(curDirs[0], "蓝色", "", "D:/D Icons/Old/download.ico", "", "", 30, 80, 10)
	// generateIcon(curDirs[0], "蓝色", "Downloads", "", "", "", 30, 80, 10)
	// generateIcon(curDirs[0], "蓝色", "Downloads", "D:/D Icons/Old/download.ico", "", "", 30, 80, 10)
	http.HandleFunc("/", sayhelloName)
	http.ListenAndServe(":80", nil)
	// !go没有箭头函数要这样写……
	http.HandleFunc("/", func(writer http.ResponseWriter, res http.Request) {
		writer.Write(fs.File("/Frontend/public/"))
	})
}
