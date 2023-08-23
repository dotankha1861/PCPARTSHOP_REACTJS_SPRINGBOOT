package com.dtahk.pcpartsshop.controllers;

import com.dtahk.pcpartsshop.exceptions.AppException;
import com.dtahk.pcpartsshop.services.ImageService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
@RequestMapping("/images")
@RequiredArgsConstructor
public class ImageController {
    public static final String URL_NOT_EXIST = "Url doesn't exist";
    private final ImageService imageService;

    @GetMapping("/**")
    public ResponseEntity<Resource> downloadImage (HttpServletRequest httpRequest){
        String[] paths = httpRequest.getRequestURL().toString().split("/images/");
        if(paths.length != 2) throw new AppException(URL_NOT_EXIST, HttpStatus.NOT_FOUND);
        Resource image = imageService.loadImage(paths[1] + ".jpg");
        return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(image);
    }
}
