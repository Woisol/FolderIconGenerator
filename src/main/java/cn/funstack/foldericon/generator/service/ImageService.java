package cn.funstack.foldericon.generator.service;

import cn.funstack.foldericon.generator.config.ImageProps;
import cn.funstack.foldericon.generator.exception.ApiError;
import cn.funstack.foldericon.generator.exception.ApiException;
import cn.funstack.foldericon.generator.pojo.dto.CompositionImageDTO;
import cn.funstack.foldericon.generator.pojo.vo.ImageConfigVO;
import cn.funstack.foldericon.generator.util.ImageComposer;
import org.apache.batik.transcoder.TranscoderException;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * @FileName ImageService
 * @Description
 * @Author yifan
 * @date 2025-02-06 14:51
 **/

@Service
public class ImageService {

    private final ImageProps imageProps;

    public ImageService(ImageProps imageProps) {
        this.imageProps = imageProps;
    }

    public ImageConfigVO getConfig() {
        List<String> icoFileNames = new ArrayList<>();
        List<String> svgFileNames = new ArrayList<>();
        File icoDir = new File(imageProps.getIcoDirPath());
        File svgDir = new File(imageProps.getSvgDirPath());
        if (icoDir.exists() && icoDir.isDirectory()) {
            File[] files = icoDir.listFiles();
            if (files != null) {
                for (File file : files) {
                    if (file.isFile()) {
                        icoFileNames.add(file.getName());
                    }
                }
            }
        }
        if (svgDir.exists() && svgDir.isDirectory()) {
            File[] files = svgDir.listFiles();
            if (files != null) {
                for (File file : files) {
                    if (file.isFile()) {
                        svgFileNames.add(file.getName());
                    }
                }
            }
        }
        return new ImageConfigVO(icoFileNames, svgFileNames);
    }

    public String getCompositionImage(CompositionImageDTO compositionImageDTO) {
        try {
            ImageComposer.composeImages(
                    imageProps.getIcoDirPath() + "/" + compositionImageDTO.getIcoFileName(),
                    imageProps.getSvgDirPath() + "/" + compositionImageDTO.getSvgFileName(),
                    compositionImageDTO.getSvgSize(), compositionImageDTO.getSvgSize(),
                    compositionImageDTO.getSvgX(), compositionImageDTO.getSvgY(),
                    compositionImageDTO.getText(), compositionImageDTO.getTextSize(),
                    compositionImageDTO.getTextX(), compositionImageDTO.getTextY(),
                    imageProps.getOutputDirPath() + "/" + compositionImageDTO.getOutputFileName()
            );
        } catch (IOException | TranscoderException e) {
            throw new ApiException(ApiError.IMAGE_COMPOSE_ERROR);
        }
        return "/image/output/"+compositionImageDTO.getOutputFileName();
    }
}
