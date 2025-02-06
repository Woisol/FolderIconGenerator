package cn.funstack.foldericon.generator.service;

import cn.funstack.foldericon.generator.exception.ApiError;
import cn.funstack.foldericon.generator.exception.ApiException;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

/**
 * @FileName FileService
 * @Description
 * @Author yifan
 * @date 2025-02-06 14:51
 **/

@Service
public class FileService {

    public List<String> getDirs(String path) {
        File file = new File(path);
        if (!file.exists()) {
            throw new ApiException(ApiError.PATH_NOT_EXIST);
        }
        if (!file.isDirectory()) {
            throw new ApiException(ApiError.PATH_NOT_DIR);
        }
        List<String> dirs = new ArrayList<>();
        File[] files = file.listFiles();
        if (files != null) {
            for (File f : files) {
                if (f.isDirectory()) {
                    dirs.add(f.getName());
                }
            }
        }
        return dirs;
    }
}
