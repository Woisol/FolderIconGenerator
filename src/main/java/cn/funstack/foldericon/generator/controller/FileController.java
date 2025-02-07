package cn.funstack.foldericon.generator.controller;

import cn.funstack.foldericon.generator.pojo.dto.SetIconDTO;
import cn.funstack.foldericon.generator.service.FileService;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/cwd")
    public Boolean checkCwd(@RequestParam String path) {
        return fileService.checkCwd(path);
    }

    @GetMapping("/dirs")
    public List<String> getDirs(@RequestParam String path) {
        return fileService.getDirs(path);
    }

    @GetMapping("/icon")
    public String getIcon(@RequestParam String path, @RequestParam String icoFileName) {
        return fileService.getIcon(path, icoFileName);
    }

    @PostMapping("/icon")
    public void setIcon(@RequestBody SetIconDTO setIconDTO) {
        fileService.setIcon(setIconDTO);
    }

}
