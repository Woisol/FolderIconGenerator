package cn.funstack.foldericon.generator.controller;

import cn.funstack.foldericon.generator.service.FileService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @FileName FileController
 * @Description
 * @Author yifan
 * @date 2025-02-06 14:51
 **/

@RestController
@RequestMapping("/file")
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @GetMapping("/dirs")
    public List<String> getDirs(@RequestParam String path) {
        return fileService.getDirs(path);
    }

}
