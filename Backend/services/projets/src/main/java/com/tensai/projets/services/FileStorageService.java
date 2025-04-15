package com.tensai.projets.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.IOException;
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
        // Initialize Cloudinary
        cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret));
    }

    // Existing method for storing MultipartFile (used for project images)
    public String storeFile(MultipartFile file) {
        try {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation);

            // Upload to Cloudinary
            Map uploadResult = cloudinary.uploader().upload(targetLocation.toFile(),
                    ObjectUtils.asMap("resource_type", "auto", "folder", "project-reports"));
            String publicId = (String) uploadResult.get("public_id");

            return publicId; // Return the public ID to store in your database
        } catch (Exception ex) {
            throw new RuntimeException("Could not store file " + file.getOriginalFilename(), ex);
        }
    }

    // Updated method for storing byte array (PDFs) in Cloudinary
    public String storeFile(byte[] fileBytes, String fileName) {
        try {
            String finalFileName = System.currentTimeMillis() + "_" + fileName;
            // Upload to Cloudinary directly from byte array
            Map uploadResult = cloudinary.uploader().upload(fileBytes,
                    ObjectUtils.asMap("resource_type", "auto", "folder", "project-reports", "public_id", finalFileName));
            String publicId = (String) uploadResult.get("public_id");

            return publicId; // Return the public ID to store in your database
        } catch (Exception ex) {
            throw new RuntimeException("Could not store file " + fileName, ex);
        }
    }

    public Resource loadImage(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found " + fileName);
            }
        } catch (Exception ex) {
            throw new RuntimeException("File not found " + fileName, ex);
        }
    }

    public void deleteFile(String publicId) {
        try {
            // Delete from Cloudinary
            cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", "raw"));

            // Delete from local storage (if applicable)
            Path filePath = this.fileStorageLocation.resolve(publicId).normalize();
            Files.deleteIfExists(filePath);
        } catch (Exception ex) {
            throw new RuntimeException("Could not delete file " + publicId, ex);
        }
    }

    // Method to get the URL of a file in Cloudinary
    public String getFileUrl(String publicId) {
        return cloudinary.url().resourceType("raw").generate(publicId);
    }
}