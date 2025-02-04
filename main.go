package main

import (
	// "util"
	"encoding/json"
	"fmt"
	"io"
	// "os"
	"path"

	// "io/fs"
	// "log"
	"net/http"
	// "github.com/sirupsen/logrus/hooks/writer"
	// "FolderIconsGenSet/util"
)

// !加个{}……
var curDirs = []string{}

// var curDirs = []fs.DirEntry{}

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
	// http.HandleFunc("/", sayhelloName)
	// !go没有箭头函数要这样写……
	const HTML_PATH = "./Frontend/dist"
	http.Handle("/", http.FileServer(http.Dir(HTML_PATH)))

	// http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
	// 	// writer.Write(fs.File("/Frontend/dist/index.html"))
	// 	// f, err := fs.ReadFile(http.Dir("."))
	// 	// if err != nil {
	// 	// 	log.Fatal(err)
	// 	// }
	// 	http.ServeFile(w, r, HTML_PATH)
	// })
	http.HandleFunc("/refresh", func(w http.ResponseWriter, r *http.Request) {
		var config Config
		yamlDecode("assets/config.yaml", &config)
		bytes, err := json.Marshal(config)
		if err != nil {
			fmt.Fprint(w, "Error: "+err.Error())
			return
		}
		// !这个时候就体现go结构体导出要大写的问题了……
		fmt.Fprint(w, string(bytes))
	})

	http.HandleFunc("/getDirs", func(w http.ResponseWriter, r *http.Request) {
		var request struct {
			Cwd string `json:"cwd"`
		}
		body, _ := io.ReadAll(r.Body)
		// if err != nil {
		// log.Fatal(err)
		// }
		defer r.Body.Close()

		// !不加&不会报错但是警告
		json.Unmarshal(body, &request)

		updateDir(request.Cwd)
		// updateDir(r.GetBody().dirs)
		// !log得极其不标准……
		dirsStr, _ := json.Marshal(curDirs)
		// if err != nil {
		// log.Fatal(err)
		// }
		fmt.Fprint(w, string(dirsStr))
	})
	http.HandleFunc("/generate", func(w http.ResponseWriter, r *http.Request) {
		var req struct {
			Dir              string `json:"dir"`
			Preset           string `json:"preset"`
			Content          string `json:"content"`
			DecorateIconPath string `json:"decorateIconPath"`
			BaseIconPath     string `json:"baseIconPath"`
			Formator         string `json:"formator"`
			FontSize         int    `json:"fontSize"`
			DecImgSize       int    `json:"decImgSize"`
			YOffset          int    `json:"yOffset"`
		}
		body, _ := io.ReadAll(r.Body)
		defer r.Body.Close()
		json.Unmarshal(body, &req)

		generateIcon(path.Base(req.Dir), req.Preset, req.Content, req.DecorateIconPath, req.BaseIconPath, req.Formator, req.FontSize, req.DecImgSize, req.YOffset)
		// w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
		// w.Header().Set("Pragma", "no-cache")
		// w.Header().Set("Expires", "0")
		fmt.Fprint(w, path.Base(req.Dir)+".ico")
	})
	http.ListenAndServe(":6002", nil)
}
