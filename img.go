package main

import (
	"fmt"
	"image"
	"image/draw"
	"image/png"
	"io/fs"
	"log"
	"os"

	"gopkg.in/yaml.v3"
)

type Config struct {
	presets []Preset `yaml:"presets"`
	// presets map[string]Preset `yaml:"presets"`
}
type Preset struct {
	baseIconPath string `yaml:"baseIconPath"`
	formator     string `yaml:"formator"`
}

func generateIcon(dir fs.DirEntry, preset string, content string, decorateIconPath string, _baseIconPath string, _formator string, decImgSize float64, fontSize int) {
	var baseIconPath string
	var formator string
	if preset == "" {
		// **不使用预设
		if _baseIconPath == "" {
			log.Fatal("No preset or base icon provided")
		}
		baseIconPath = _baseIconPath
		formator = _formator
	} else {
		// **使用预设
		configFile, err := os.Open("assets/config.yaml")
		if err != nil {
			log.Fatal(err)
		}
		defer configFile.Close()
		var config Config
		config.presets = make([]Preset, 0)
		// config = yaml.Decoder(configFile);
		decoder := yaml.NewDecoder(configFile)
		err = decoder.Decode(&config)
		if err != nil {
			log.Fatal(err)
		}

		// preset, exists := config.presets["蓝色"]
		// preset, exists := config.presets[preset]
		for key, value := range config.presets {
			fmt.Println(key, value)
		}

		// if exists == false {
		// 	log.Println("Preset not found")
		// 	if _baseIconPath == "" {
		// 		log.Fatal("No preset or base icon provided")
		// 	}
		// 	baseIconPath = _baseIconPath
		// 	formator = _formator

		// }
		// baseIconPath = preset.baseIconPath
		// formator = preset.formator
	}

	// ** 检查path
	baseIcon, err_baseIconPath := os.Open(baseIconPath)
	decorateIcon, err_decorateIconpath := os.Open(decorateIconPath)
	// @todo 添加对网络url支持
	if err_baseIconPath != nil {
		log.Fatal("BaseIcon not found")
	}
	if err_decorateIconpath == nil {
		log.Fatal("DecorateIcon not found")
	}

	_drawIcon(dir, baseIcon, formator, content, decorateIcon, decImgSize, fontSize)

}

func _drawIcon(dir fs.DirEntry, baseIcon fs.File, formator string, content string, decorateIcon fs.File, decImgSize float64, fontSize int) {
	// ** 读取图片
	baseImg, _, err_baseImg := image.Decode(baseIcon)
	decImg, _, err_decImg := image.Decode(decorateIcon)
	if err_baseImg != nil {
		log.Fatal(err_baseImg)
	}
	if err_decImg != nil {
		log.Fatal(err_decImg)
	}
	width := baseImg.Bounds().Dx()
	height := baseImg.Bounds().Dy()

	// ** 计算字体大小
	if fontSize == 0 {
		fontSize = int(decImgSize * 0.1)
	}
	// font := truetype.NewFont(gofont.Collection(), fontSize)

	genImg := image.NewRGBA(image.Rect(0, 0, width, height))
	draw.Draw(genImg, baseImg.Bounds(), image.White, image.Point{}, draw.Src)
	draw.Draw(genImg, decImg.Bounds(), decImg, image.Point{}, draw.Over)

	resImg, _ := os.Create(dir.Name() + ".png")
	png.Encode(resImg, genImg)

}

// func generateIconCustom(dir fs.DirEntry, content string, iconPath string) {

// }
