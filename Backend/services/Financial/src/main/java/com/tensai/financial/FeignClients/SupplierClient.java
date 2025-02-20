package com.tensai.financial.FeignClients;

import com.tensai.financial.DTOS.SupplierDTO;
import jakarta.ws.rs.GET;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "supplier-service", url = "http://supplier-service/api/suppliers")
public interface SupplierClient {
    @GetMapping("/{supplierId}")
    SupplierDTO getSupplierById(@PathVariable UUID supplierId);
}
