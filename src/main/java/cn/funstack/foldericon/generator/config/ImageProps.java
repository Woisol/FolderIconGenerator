package cn.funstack.foldericon.generator.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * @FileName ImageProps
 * @Description
 * @Author yifan
 * @date 2025-02-06 10:44
 **/

@Configuration
@ConfigurationProperties(prefix = "image")
@Data
public class ImageProps {

    private String icoDirPath;

    private String svgDirPath;

    private String outputDirPath;

}
