package com.tensai.projets.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

@Service
public class FileStorageService {
    private final Path fileStorageLocation;
    private Cloudinary cloudinary;

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    public FileStorageService() {
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @PostConstruct
    public void init() {
        cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret));
    }

    public String storeFileLocaly(MultipartFile file) {
        try {
            // Remove the extension from the public_id
            String originalFileName = file.getOriginalFilename();
            String fileNameWithoutExtension = originalFileName != null ?
                    originalFileName.substring(0, originalFileName.lastIndexOf('.')) : "image";
            String fileName = System.currentTimeMillis() + "_" + fileNameWithoutExtension;
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("resource_type", "image", "folder", "project-reports", "public_id", fileName));
            String publicId = (String) uploadResult.get("public_id");
            System.out.println("Stored file with public_id: " + publicId);
            return publicId;
        } catch (Exception ex) {
            throw new RuntimeException("Could not store file " + file.getOriginalFilename(), ex);
        }
    }



    public String storeFile(byte[] fileBytes, String fileName) {
        try {
            String finalFileName = System.currentTimeMillis() + "_" + fileName;
            Map uploadResult = cloudinary.uploader().upload(fileBytes,
                    ObjectUtils.asMap("resource_type", "auto", "folder", "project-reports", "public_id", finalFileName));
            return (String) uploadResult.get("public_id");
        } catch (Exception ex) {
            throw new RuntimeException("Could not store file " + fileName, ex);
        }
    }

    public Resource loadImage(String publicId) {
        try {
            String cloudinaryUrl = getFileUrl(publicId);
            return new UrlResource(cloudinaryUrl);
        } catch (Exception ex) {
            throw new RuntimeException("File not found " + publicId, ex);
        }
    }

    public void deleteFile(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", "image"));
            Path filePath = this.fileStorageLocation.resolve(publicId).normalize();
            Files.deleteIfExists(filePath);
        } catch (Exception ex) {
            throw new RuntimeException("Could not delete file " + publicId, ex);
        }
    }

    public String getFileUrl(String publicId) {
        // Append .jpg to the URL to ensure the frontend can handle it
        String url = cloudinary.url()
                .resourceType("image")
                .secure(true)
                .generate(publicId) + ".jpg";
        System.out.println("Generated URL for public_id " + publicId + ": " + url);
        return url;
    }
}