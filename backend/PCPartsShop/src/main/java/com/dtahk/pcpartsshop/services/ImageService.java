package com.dtahk.pcpartsshop.services;

import com.dtahk.pcpartsshop.utils.UploadFileUtil;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

public interface ImageService {
    public Resource loadImage(String joinPath);

    public void saveImage(MultipartFile file, String joinPath);

    public void deleteImage(String joinPath);
}
