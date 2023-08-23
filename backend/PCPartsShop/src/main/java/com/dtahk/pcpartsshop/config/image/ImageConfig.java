package com.dtahk.pcpartsshop.config.image;

import com.dtahk.pcpartsshop.utils.UploadFileUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class ImageConfig {
    @Bean
    public UploadFileUtil uploadImageUtil(){
        Path pathImage = Paths.get("src/main/resources/images/");
        return new UploadFileUtil(pathImage);
    }
}
