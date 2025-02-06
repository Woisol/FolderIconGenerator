package cn.funstack.foldericon.generator.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * @FileName ResourceConfig
 * @Description
 * @Author yifan
 * @date 2025-02-06 16:10
 **/

@Configuration
public class ResourceConfig implements WebMvcConfigurer {

    private final ImageProps imageProps;

    public ResourceConfig(ImageProps imageProps) {
        this.imageProps = imageProps;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/image/output/**")
                .addResourceLocations("file:/"+imageProps.getOutputDirPath());
    }

}
