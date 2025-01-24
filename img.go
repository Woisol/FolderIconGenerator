package main

import (
	// !这个ico原来是会加上去的……
	ico "github.com/biessek/golang-ico"
	// "github.com/mewkiz/pkg/imgutil"
	"github.com/nfnt/resize"

	// "github.com/mewkiz/pkg/imgutil"
	"image"
	"image/draw"
	"io/fs"
	"log"
	"os"
	"path/filepath"

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

// type Preset map[string]string

// type Preset interface{}

func generateIcon(dir fs.DirEntry, preset string, content string, decorateIconPath string, _baseIconPath string, _formator string, decImgSize int, yOffset int, fontSize int) {
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
		// config.presets = make([]Preset, 0)
		// config = yaml.Decoder(configFile)
		decoder := yaml.NewDecoder(configFile)
		err = decoder.Decode(&config)
		if err != nil {
			log.Fatal(err)
		}

		// preset, exists := config.presets["蓝色"]
		preset, exists := config.Presets[preset]
		// for key, value := range config.Presets {
		// 	fmt.Println(key, value)
		// }

		if exists == false {
			log.Println("Preset not found")
			if _baseIconPath == "" {
				log.Fatal("No preset or base icon provided")
			}
			baseIconPath = _baseIconPath
			formator = _formator

		}
		baseIconPath = preset.BaseIconPath
		formator = preset.Formator
	}

	_drawIcon(dir, baseIconPath, formator, content, decorateIconPath, decImgSize, yOffset, fontSize)

}

func _drawIcon(dir fs.DirEntry, baseIconPath string, formator string, content string, decorateIconPath string, decImgSize int, yOffset int, fontSize int) {
	// ** 检查path
	// !Open内部其实就是调用OpenFile……
	baseIcon, err_baseIconPath := os.Open(baseIconPath)
	decorateIcon, err_decorateIconpath := os.Open(decorateIconPath)
	// @todo 添加对网络url支持
	if err_baseIconPath != nil {
		log.Fatal("BaseIcon not found")
	}
	if err_decorateIconpath != nil {
		log.Fatal("DecorateIcon not found")
	}

	// ** 读取图片
	var baseImg, decImg image.Image
	var err_baseImg, err_decImg error
	if filepath.Ext(baseIconPath) == ".ico" {
		baseImg, err_baseImg = ico.Decode(baseIcon)
		decImg, err_decImg = ico.Decode(decorateIcon)
	} else {
		baseImg, _, err_baseImg = image.Decode(baseIcon)
		decImg, _, err_decImg = image.Decode(decorateIcon)
	}
	if err_baseImg != nil {
		log.Fatal(err_baseImg)
	}
	if err_decImg != nil {
		log.Fatal(err_decImg)
	}
	width := baseImg.Bounds().Dx()
	height := baseImg.Bounds().Dy()

	decImg = resize.Resize(uint(decImgSize), uint(decImgSize)/uint(decImg.Bounds().Dx())*uint(decImg.Bounds().Dy()), decImg, resize.Lanczos3)

	decWidth := decImg.Bounds().Dx()
	decHeight := decImg.Bounds().Dy()

	// decWidth := decImgSize
	// decHeight := decImg.Bounds().Dy() / decImg.Bounds().Dx() * decWidth

	// ** 计算字体大小@todo To Implement
	if fontSize == 0 {
		fontSize = int(float64(decImgSize) * 0.1)
	}
	// font := truetype.NewFont(gofont.Collection(), fontSize)

	genImg := image.NewRGBA(image.Rect(0, 0, width, height))
	draw.Draw(genImg, baseImg.Bounds(), baseImg, image.Point{}, draw.Src)
	draw.Draw(genImg, image.Rect((width-decWidth)/2, (height-decHeight)/2+yOffset, (width+decWidth)/2, (height+decHeight)/2+yOffset), decImg, image.Point{}, draw.Over)

	resImg, _ := os.Create(dir.Name() + ".ico")
	ico.Encode(resImg, genImg)

}

// func generateIconCustom(dir fs.DirEntry, content string, iconPath string) {

// }
