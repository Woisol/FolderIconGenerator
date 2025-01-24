package main

import (
	"log"
	"os"

	"gopkg.in/yaml.v3"
)

type TestStruct struct {
	// presets []Preset `yaml:"presets"`
	// presets map[string]Preset `yaml:"presets"`
	// t1 map[string]string `yaml:"t1"`
	t1 struct {
		t2 struct {
			t3 string `yaml:"t3"`
			t4 string `yaml:"t4"`
		} `yaml:"t2"`
	} `yaml:"t1"`
}

func yamlTest() {
	yamlFile, err := os.Open("assets/test.yaml")
	if err != nil {
		panic(err)
	}
	defer yamlFile.Close()
	yamlDec := yaml.NewDecoder(yamlFile)
	// var yamlContent TestStruct
	// !这样就可以正常读取，那估计是注解的问题……
	var yamlContent map[string]interface{}
	// !可以证实类型不对会导致decode失败，但是应该会报错才对的……
	// var yamlContent string
	err = yamlDec.Decode(&yamlContent)
	if err != nil {
		log.Fatal(err)
	}

	// **尝试官方文档的用法
	// !一样的……应该还是在于yaml注解
	// yamlFile, err := os.ReadFile("assets/test.yaml")
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// var yamlContent TestStruct
	// err = yaml.Unmarshal([]byte(yamlFile), &yamlContent)
	log.Println(yamlContent)
	log.Println(yamlContent["t1"])
	log.Println(yamlContent["array"])
}
