package com.dtahk.pcpartsshop.services.impl;

import com.dtahk.pcpartsshop.exceptions.AppException;
import com.dtahk.pcpartsshop.services.ImageService;
import com.dtahk.pcpartsshop.utils.UploadFileUtil;
import lombok.AllArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@AllArgsConstructor
public class ImageServiceImpl implements ImageService {
    public static final String SAVE_IMAGE_FAILED = "Lưu ảnh thất bại";
    private final UploadFileUtil uploadFilUtil;

    @Override
    public Resource loadImage(String joinPath) {
        return uploadFilUtil.load(joinPath);
    }

    @Override
    public void saveImage(MultipartFile file, String joinPath) {
        try {
            uploadFilUtil.save(file.getInputStream(), joinPath);
        } catch (IOException e) {
            throw new AppException(SAVE_IMAGE_FAILED, HttpStatus.EXPECTATION_FAILED);
        }
    }

    @Override
    public void deleteImage(String joinPath) {
        uploadFilUtil.delete(joinPath);
    }
}
