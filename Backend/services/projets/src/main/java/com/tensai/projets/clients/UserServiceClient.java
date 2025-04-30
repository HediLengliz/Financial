//package com.tensai.projets.clients;
//
//
//import com.tensai.projets.dtos.UserResponse;
//import org.springframework.cloud.openfeign.FeignClient;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//
//@FeignClient(name = "user-service", fallback = UserServiceClientFallback.class)
//public interface UserServiceClient {
//
//    @GetMapping("/api/users/{id}")
//    UserResponse getUserById(@PathVariable("id") Long id);
//
//    @GetMapping("/api/users/username/{username}")
//    UserResponse getUserByUsername(@PathVariable("username") String username);
//}
