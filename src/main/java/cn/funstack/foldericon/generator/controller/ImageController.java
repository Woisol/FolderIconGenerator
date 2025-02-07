package cn.funstack.foldericon.generator.controller;

import cn.funstack.foldericon.generator.pojo.dto.CompositionImageDTO;
import cn.funstack.foldericon.generator.pojo.vo.ImageConfigVO;
import cn.funstack.foldericon.generator.service.ImageService;
import org.springframework.web.bind.annotation.*;

/**
 * @FileName ImageController
 * @Description
 * @Author yifan
 * @date 2025-02-06 14:51
 **/

@RestController
@RequestMapping("/image")
public class ImageController {

    private final ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @GetMapping("/config")
    public ImageConfigVO getConfig() {
        return imageService.getConfig();
    }

    @PostMapping("/composition")
    public String getCompositionImage(@RequestBody CompositionImageDTO compositionImageDTO) {
        return imageService.getCompositionImage(compositionImageDTO);
    }

}
