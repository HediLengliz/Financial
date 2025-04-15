package com.tensai.projets.repositories;

import com.tensai.projets.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByRole(String role);
    List<User> findByRoleAndAvailability(String role, boolean availability);
    Optional<User> findByEmail(String email);
    List<User> findByAvailability(boolean availability);
    // For available collaborators// For collaborator assignment// e.g., find all project managers
//    Optional<User> findBySub(String sub);  // Add this method

}