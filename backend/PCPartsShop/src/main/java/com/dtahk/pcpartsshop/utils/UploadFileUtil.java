package com.dtahk.pcpartsshop.utils;

import com.dtahk.pcpartsshop.exceptions.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.util.FileSystemUtils;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.file.*;
import java.util.stream.Stream;


@RequiredArgsConstructor
public class UploadFileUtil {
	public static final String CONTEXT_PATH = "http://localhost:8080/";
	public static final String URL = CONTEXT_PATH + "images/";
	private final Path root;
	public void save(InputStream inputStream, String joinPath) {
		try {
			Path filePath = root.resolve(joinPath);
			Path parentDir = filePath.getParent();
			if (parentDir != null && !Files.exists(parentDir)) {
				Files.createDirectories(parentDir);
			}
			Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
		} catch (IOException e) {
			throw new AppException("Couldn't save file!", HttpStatus.EXPECTATION_FAILED);
		}
	}

	public Resource load(String joinPath) {
		try {
			Path file = root.resolve(joinPath);
			Resource resource = new UrlResource(file.toUri());
			if (resource.exists() || resource.isReadable()) return resource;
			else {
				throw new RuntimeException("Could not read the file!");
			}
		} catch (MalformedURLException e) {
			throw new RuntimeException("Error: " + e.getMessage());
		}
	}

	public boolean delete(String filename) {
		try {
			Path file = root.resolve(filename);
			return Files.deleteIfExists(file);
		} catch (IOException e) {
			throw new RuntimeException("Error: " + e.getMessage());
		}
	}

	public void deleteAll() {
		FileSystemUtils.deleteRecursively(root.toFile());
	}

	public Stream<Path> loadAll() {
		try {
			return Files.walk(root, 1).filter(path -> !path.equals(root)).map(root::relativize);
		} catch (IOException e) {
			throw new RuntimeException("Could not load the files!");
		}
	}
}

