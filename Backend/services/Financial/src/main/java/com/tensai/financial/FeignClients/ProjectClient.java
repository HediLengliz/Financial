package com.tensai.financial.FeignClients;


import com.tensai.financial.DTOS.ProjectDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "project-service")
public interface ProjectClient {
    @GetMapping("/{projectId}")
    ProjectDTO getProjectById(@PathVariable UUID projectId);


}
