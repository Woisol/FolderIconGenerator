package cn.funstack.foldericon.generator.service;

import cn.funstack.foldericon.generator.config.ImageProps;
import cn.funstack.foldericon.generator.exception.ApiError;
import cn.funstack.foldericon.generator.exception.ApiException;
import cn.funstack.foldericon.generator.pojo.dto.SetIconDTO;
import cn.funstack.foldericon.generator.util.ImageUtil;
import org.apache.commons.imaging.ImageFormats;
import org.apache.commons.imaging.Imaging;
import org.springframework.stereotype.Service;

import javax.swing.*;
import javax.swing.filechooser.FileSystemView;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
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

    private final ImageProps imageProps;

    public FileService(ImageProps imageProps) {
        this.imageProps = imageProps;
    }

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

    public String getIcon(String path, String icoFileName) {
        File folder = new File(path);
        FileSystemView view = FileSystemView.getFileSystemView();
        Icon icon = view.getSystemIcon(folder);
        if (icon == null) {
            throw new ApiException(ApiError.ICON_CAN_NOT_GET);
        }
        BufferedImage bufferedImage = ImageUtil.iconToBufferedImage(icon);
        String iconPath = imageProps.getTempDirPath() + "/" + icoFileName;
        // 保存icon图像
        File outputFile = new File(iconPath);
        try {
            Imaging.writeImage(bufferedImage, outputFile, ImageFormats.ICO);
        } catch (IOException e) {
            e.printStackTrace();
            throw new ApiException(ApiError.WRITE_IMAGE_ERROR);
        }
        return "/image/temp/" + icoFileName;
    }

    public void setIcon(SetIconDTO setIconDTO) {
        String icoFilePath = imageProps.getOutputDirPath() + "/" + setIconDTO.getIcoFileName();
        File icoFile = new File(icoFilePath);
        if (!icoFile.exists()) {
            throw new ApiException(ApiError.PATH_NOT_EXIST);
        }
        File folder = new File(setIconDTO.getPath());
        if (!folder.exists()) {
            throw new ApiException(ApiError.PATH_NOT_EXIST);
        }
        if (!folder.isDirectory()) {
            throw new ApiException(ApiError.PATH_NOT_DIR);
        }
        String desktopIniContent = "[.ShellClassInfo]\nIconResource=" + icoFilePath + ",0";
        try {
            Files.write(Paths.get(setIconDTO.getPath(), "desktop.ini"), desktopIniContent.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
            // 设置 desktop.ini 和文件夹属性
            ProcessBuilder pb1 = new ProcessBuilder("attrib", "+s", "+h", setIconDTO.getPath() + "\\desktop.ini");
            ProcessBuilder pb2 = new ProcessBuilder("attrib", "+r", setIconDTO.getPath());

            pb1.start().waitFor();
            pb2.start().waitFor();
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            throw new ApiException(ApiError.SET_ICON_ERROR);
        }
    }

    public Boolean checkCwd(String path) {
        File file = new File(path);
        return file.exists() && file.isDirectory();
    }

}
