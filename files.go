// !01-21终于解决vsc调试以及多文件问题……
package main

// package main

import (
	// "fmt"
	// "io/fs"
	"io"
	"log"
	"os"

	// "path"

	"gopkg.in/yaml.v3"
)

type Config struct {
	// presets []Preset `yaml:"presets"`
	// presets map[string]Preset `yaml:"presets"`
	// !极其神奇……此处必须要大写，也不是要求不同，删去一个字母依然无法读取
	Presets map[string]Preset `yaml:"presets"`
}
type Preset struct {
	BaseIconPath string `yaml:"baseIconPath"`
	Formator     string `yaml:"formator"`
}

func updateDir(cwd string) {
	// !……和js一样反过来的……
	// ! = "D:/"不支持默认参数/可选参数……啊啊？
	if cwd == "" {
		cwd = "D:/"
	}
	// curDirs := []fs.DirEntry{}
	curDirs = nil
	// !……所以居然是用nil来重置……
	dirs, _ := os.ReadDir(cwd)
	// if err != nil {
	// log.Fatal(err)
	// !Fatal本身包含了return
	// return
	// }
	for _, dir := range dirs {
		// fmt.Println(dir.Name())
		if dir.IsDir() {
			curDirs = append(curDirs, dir.Name())
		}
	}
	// fmt.Print(curDirs)
}
func yamlDecode(path string, config *Config) {
	file, err := os.Open(path)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	decoder := yaml.NewDecoder(file)
	err = decoder.Decode(config)
	if err != nil {
		log.Fatal(err)
	}
}

//	func jsonEncode(content io.Reader){
//		// decoder := json.NewDecoder(content)
//		// var output
//		// err := decoder.Decode(output)
//		// if err != nil {
//		// 	log.Fatal(err)
//		// }
//		// return output
//		return json.Marshal(content)
//	}
func _desktopIni(iconPath string) string {
	return `[.ShellClassInfo]
IconResource=` + iconPath + `
[ViewState]
Mode=
Vid=
FolderType=Generic`
}
func copyFile(src, dst string) error {
	sourceFile, err := os.Open(src)
	if err != nil {
		return err
	}
	defer sourceFile.Close()

	destinationFile, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer destinationFile.Close()

	_, err = io.Copy(destinationFile, sourceFile)
	if err != nil {
		return err
	}

	// err = os.Chmod(dst, sourceFile.Stat().Mode())
	// if err != nil {
	// 	return err
	// }

	return nil
}
func createDesktopIni(dir string, iconPath string) {
	var ini *os.File
	var err error
	iniPath := dir + "/desktop.ini"
	_, err_stat := os.Stat(iniPath)
	if err_stat == nil {
		ini, err = os.Open(iniPath)
	} else {
		ini, err = os.Create(iniPath)
	}
	if err != nil {
		log.Println("ERR: " + err.Error())
	}
	ini.WriteString(_desktopIni(iconPath))
	defer ini.Close()
	// err := os.WriteFile(iniPath, []byte(_desktopIni(iconPath)), 0644)
	// if err != nil {
	// 	log.Println("ERR: " + err.Error())
	// }
}
func setIcon(dir string, icoPath string, genPath string) {
	err := copyFile(icoPath, genPath)
	if err != nil {
		log.Println("ERR: " + err.Error())
	}
	createDesktopIni(dir, genPath)

}
