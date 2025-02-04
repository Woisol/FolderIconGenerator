package main

import (
	// !这个ico原来是会加上去的……
	ico "github.com/biessek/golang-ico"
	"github.com/fogleman/gg"
	"golang.org/x/image/font"

	// !go graph……估计是比较重量级的库了……
	// "github.com/fogleman/gg"
	// "github.com/mewkiz/pkg/imgutil"

	"github.com/nfnt/resize"
	// "github.com/mewkiz/pkg/imgutil"
	"image"
	"image/color"
	"image/draw"

	// "io/fs"
	"log"
	"os"
	"path/filepath"
	// "gopkg.in/yaml.v3"
)

// type Preset map[string]string

// type Preset interface{}

func generateIcon(dir string, preset, content, decorateIconPath, _baseIconPath, _formator string, fontSize, decImgSize, yOffset int) {
	var baseIconPath string
	var formator string
	if preset == "" {
		// **不使用预设
		if _baseIconPath == "" {
			log.Println("No preset or base icon provided")
			return

		}
		baseIconPath = _baseIconPath
		formator = _formator
	} else {
		// **使用预设
		var config Config
		// config.presets = make([]Preset, 0)
		// config = yaml.Decoder(configFile)
		yamlDecode("assets/config.yaml", &config)

		// preset, exists := config.presets["蓝色"]
		preset, exists := config.Presets[preset]
		// for key, value := range config.Presets {
		// 	fmt.Println(key, value)
		// }

		if exists == false {
			log.Println("Preset not found")
			if _baseIconPath == "" {
				log.Println("No preset or base icon provided")
				return
			}
			baseIconPath = _baseIconPath
			formator = _formator

		}
		baseIconPath = preset.BaseIconPath
		formator = preset.Formator
	}

	_drawIcon(dir, baseIconPath, formator, content, decorateIconPath, fontSize, decImgSize, yOffset)

}

// !重要参考https://blog.csdn.net/qq_40585384/article/details/124762939
// @todo 添加颜色选项
func _drawIcon(dir string, baseIconPath, formator, content, decorateIconPath string, fontSize, decImgSize, yOffset int) {
	// ** 检查path
	// !Open内部其实就是调用OpenFile……
	baseIcon, err_baseIconPath := os.Open(baseIconPath)
	decorateIcon, _ := os.Open(decorateIconPath)
	// err_decorateIconpath
	// @todo 添加对网络url支持
	if err_baseIconPath != nil {
		// log.Fatal("BaseIcon not found")
	}
	// if err_decorateIconpath != nil {
	// 	log.Fatal("DecorateIcon not found")
	// }

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
	width := baseImg.Bounds().Dx()
	height := baseImg.Bounds().Dy()

	var decWidth, decHeight int

	if err_decImg != nil {
		log.Println("WARN: Decoration Image not found ", err_decImg)
		// !……也不能连写吗……
		// decWidth = decHeight = 0;
		decWidth = 0
		decHeight = 0
	} else {
		decWidth = decImgSize
		// !注意整除的问题
		decHeight = int(float64(decImgSize) / float64(decImg.Bounds().Dx()) * float64(decImg.Bounds().Dy()))
		log.Println("Decoration Image found, size: ", decImg.Bounds().Dx(), "x", decImg.Bounds().Dy())

		decImg = resize.Resize(uint(decWidth), uint(decHeight), decImg, resize.Lanczos3)
	}

	// decWidth := decImgSize
	// decHeight := decImg.Bounds().Dy() / decImg.Bounds().Dx() * decWidth

	// ** 计算字体大小@todo To Implement
	if fontSize == 0 {
		fontSize = decImgSize / 10
	}
	// font := truetype.NewFont(gofont.Collection(), fontSize)

	genImg := image.NewRGBA(image.Rect(0, 0, width, height))
	// ** 背景
	draw.Draw(genImg, baseImg.Bounds(), baseImg, image.Point{}, draw.Src)

	icoTextOffset := 0
	if decorateIconPath != "" && err_decImg == nil {
		if content != "" {
			icoTextOffset = fontSize / 2
		}
		// ** 绘制图标
		draw.Draw(genImg, image.Rect((width-decWidth)/2, (height-decHeight)/2-icoTextOffset+yOffset, (width+decWidth)/2, (height+decHeight)/2-icoTextOffset+yOffset), decImg, image.Point{}, draw.Over)
	}
	// if content != "" && decorateIconPath != "" {
	// 	icoTextOffset = fontSize / 2
	// } else {
	// 	if decorateIconPath != ""
	// 		draw.Draw(genImg, image.Rect((width-decWidth)/2, (height-decHeight)/2-icoTextOffset+yOffset, (width+decWidth)/2, (height+decHeight)/2-icoTextOffset+yOffset), decImg, image.Point{}, draw.Over)
	// }

	// ** 绘制文字
	drawString(genImg, content, fontSize, float64(width)/2, float64((height+decHeight)/2+icoTextOffset+yOffset))

	outImg, _ := os.Create(HTML_PATH + "/" + dir + ".ico")
	ico.Encode(outImg, genImg)

}

// ** 文字绘制函数，默认居中定位
func drawString(genImg *image.RGBA, content string, fontSize int, x, y float64) {
	// !Read和Open还是不太一样的
	// ~~https://www.cnblogs.com/mfrank/p/14175084.html，gg默认只支持ttf不支持otf……
	var font font.Face
	var err error
	font, err = gg.LoadFontFace("assets/font.ttf", float64(fontSize))
	if err != nil {
		log.Println("WARN: ttf not found, try to use otf font")
		font, err = gg.LoadFontFace("assets/font.otf", float64(fontSize))
		if err != nil {
			log.Fatal("Font not found")
		}
	}
	// ftypeContext := freetype.NewContext()
	// ftypeContext.SetClip(genImg.Bounds())
	// ftypeContext.SetDst(genImg)
	// // !也不能连写……
	// // .setSrc
	// ftypeContext.SetSrc(image.Black)
	// // !默认值
	// // ftypeContext.SetDPI(72)

	// ftypeContext.SetFont(font)
	// ftypeContext.SetFontSize(float64(fontSize))
	// // ftypeContext.
	// // !https://www.cnblogs.com/mfrank/p/14162815.html
	// ftypeContext.DrawString(content, freetype.Pt(x-len(content)/2.0*fontSize, y))

	// !用ForRGBA就在现有图片上继续修改不需要把前面的也用gg重写了……
	ggContext := gg.NewContextForRGBA(genImg)
	ggContext.SetColor(color.Black)
	ggContext.SetFontFace(font)
	ggContext.DrawStringAnchored(content, x, y, 0.5, 0.5)

}

// func measureString(c *freetype.Context, content string) (int, int) {
// 	width := 0
// 	height := 0
// 	prevC := rune(-1)
// 	for _, c := range content {
// 		kern, err := c.Font.HMetric(c, prevC)
// 		if err == nil {
// 			width += int(kern.Advance)
// 		}
// 		prevC = c
// 	}

// 	// 计算文字的高度
// 	height = int(c.PointToPixel(c.Font.Size))

// 	return width, height
// }

// func generateIconCustom(dir fs.DirEntry, content string, iconPath string) {
// }
