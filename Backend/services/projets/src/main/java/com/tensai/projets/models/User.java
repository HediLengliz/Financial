package com.tensai.projets.models;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private boolean availability;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false, unique = true)
    private String email;

    private String firstName;
    private String lastName;

    // Store the Cloudinary public_id for the profile picture
    @Column(name = "profile_picture")
    private String profilePicture;

    @OneToMany(mappedBy = "projectManager", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Project> projects = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Workflow> workflows = new ArrayList<>();

    public void updateFromJwt(Jwt jwt) {
        this.email = jwt.getClaimAsString("email");
        this.name = jwt.getClaimAsString("preferred_username");
        this.firstName = jwt.getClaimAsString("given_name");
        this.lastName = jwt.getClaimAsString("family_name");

        Map<String, Object> realmAccess = jwt.getClaim("realm_access");
        List<String> roles = (List<String>) realmAccess.get("roles");
        this.role = roles.contains("PROJECT_MANAGER") ? "PROJECT_MANAGER" : "PROJECT_OWNER";
    }

    public boolean getAvailability() {
        return availability;
    }
}