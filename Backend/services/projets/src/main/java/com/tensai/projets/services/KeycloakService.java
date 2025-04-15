package com.tensai.projets.services;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import javax.annotation.PostConstruct;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class KeycloakService {

    @Value("${keycloak.auth-server-url}")
    private String authServerUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.resource}")
    private String clientId;

    @Value("${keycloak.credentials.secret}")
    private String clientSecret;

    private Keycloak keycloak;
    private final RestTemplate restTemplate;

    public KeycloakService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @PostConstruct
    public void init() {
        keycloak = KeycloakBuilder.builder()
                .serverUrl(authServerUrl)
                .realm("master")
                .clientId("admin-cli")
                .username("admin")
                .password("admin")
                .build();
    }

    public void createUser(String username, String email, String password, String role,String firstName,String lastName) {
        RealmResource realmResource = keycloak.realm(realm);

        // Create user in Keycloak
        UserRepresentation user = new UserRepresentation();
        user.setUsername(username);
        user.setEmail(email);
        user.setEnabled(true);
        user.setEmailVerified(true);
        user.setFirstName(firstName);
        user.setLastName(lastName);

        // Set password
        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(password);
        credential.setTemporary(false);
        user.setCredentials(Collections.singletonList(credential));

        // Create user
        realmResource.users().create(user);

        // Find the created user
        List<UserRepresentation> users = realmResource.users().search(username, true);
        if (!users.isEmpty()) {
            String userId = users.get(0).getId();

            // Assign role
            RoleRepresentation roleRepresentation = realmResource.roles().get(role).toRepresentation();
            realmResource.users().get(userId).roles().realmLevel().add(Collections.singletonList(roleRepresentation));
        }
    }

    public Map<String, Object> authenticate(String username, String password) {
        String tokenUrl = authServerUrl + "/realms/" + realm + "/protocol/openid-connect/token";

        // Prepare request body
        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("grant_type", "password");
        requestBody.add("client_id", clientId);
        requestBody.add("client_secret", clientSecret);
        requestBody.add("username", username);
        requestBody.add("password", password);

        // Set headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        // Send request to Keycloak
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);

        return response.getBody();
    }
    public void logout(String refreshToken) {
        String logoutUrl = authServerUrl + "/realms/" + realm + "/protocol/openid-connect/logout";

        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("client_id", clientId);
        requestBody.add("client_secret", clientSecret);
        requestBody.add("refresh_token", refreshToken);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(requestBody, headers);
        restTemplate.postForEntity(logoutUrl, request, Void.class);
    }
}