package com.tensai.financial.FeignClients;

import com.tensai.financial.DTOS.ManagerDTO;
import com.tensai.financial.DTOS.ProjectDTO;
import lombok.Getter;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "manager-service")
public interface ManagerClient {
    @GetMapping("/{manager}")
    ManagerDTO getManagerById(@PathVariable UUID managerId);

}
