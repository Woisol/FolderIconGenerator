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

// const HTML_PATH = "./Frontend/dist"

const HTML_PATH = "./web"

// const HTML_PATH = "."

func main() {
	// yamlTest()
	// updateDir("")
	// generateIcon(curDirs[0], "蓝色", "", "D:/D Icons/Old/download.ico", "", "", 30, 80, 10)
	// generateIcon(curDirs[0], "蓝色", "Downloads", "", "", "", 30, 80, 10)
	// generateIcon(curDirs[0], "蓝色", "Downloads", "D:/D Icons/Old/download.ico", "", "", 30, 80, 10)
	// http.HandleFunc("/", sayhelloName)
	// !go没有箭头函数要这样写……
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
			FontColor        string `json:"fontColor"`
			YOffset          int    `json:"yOffset"`
			// GenPath          string `json:"genPath"`
		}
		body, _ := io.ReadAll(r.Body)
		defer r.Body.Close()
		json.Unmarshal(body, &req)

		generateIcon(path.Base(req.Dir), req.Preset, req.Content, req.DecorateIconPath, req.BaseIconPath, req.Formator, req.FontSize, req.FontColor, req.DecImgSize, req.YOffset)
		// ~~主要在于vite的缓存问题不需要加实际也无用
		// w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
		// w.Header().Set("Pragma", "no-cache")
		// w.Header().Set("Expires", "0")
		fmt.Fprint(w, ".cache/"+path.Base(req.Dir)+".ico")
	})
	http.HandleFunc("/set", func(w http.ResponseWriter, r *http.Request) {
		var req struct {
			Dir     string `json:"dir"`
			GenPath string `json:"genPath"`
		}
		body, _ := io.ReadAll(r.Body)
		defer r.Body.Close()
		json.Unmarshal(body, &req)

		setIcon(req.Dir, HTML_PATH+"/"+".cache"+"/"+path.Base(req.Dir)+".ico", req.GenPath+"/"+path.Base(req.Dir)+".ico")
		fmt.Fprint(w, "成功设置"+req.Dir+"的图标")
	})
	http.ListenAndServe(":6002", nil)
}
