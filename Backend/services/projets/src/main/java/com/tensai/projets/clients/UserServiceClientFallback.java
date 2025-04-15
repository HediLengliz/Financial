package com.tensai.projets.clients;


import com.tensai.projets.dtos.UserResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class UserServiceClientFallback implements UserServiceClient {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceClientFallback.class);

    @Override
    public UserResponse getUserById(Long id) {
        logger.warn("User Microservice is unavailable. Returning mock data for user ID: {}", id);
        UserResponse mockUser = new UserResponse();
        mockUser.setId(id);
        mockUser.setUsername("mockuser_" + id);
        mockUser.setEmail("mockuser_" + id + "@example.com");
        mockUser.setFirstName("Mock");
        mockUser.setLastName("User");
        mockUser.setRole("USER");
        return mockUser;
    }

    @Override
    public UserResponse getUserByUsername(String username) {
        logger.warn("User Microservice is unavailable. Returning mock data for username: {}", username);
        UserResponse mockUser = new UserResponse();
        mockUser.setId(999L); // Mock ID
        mockUser.setUsername(username);
        mockUser.setEmail(username + "@example.com");
        mockUser.setFirstName("Mock");
        mockUser.setLastName("User");
        mockUser.setRole("USER");
        return mockUser;
    }
}
