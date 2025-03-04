package com.tensai.financial.Controllers;

import com.tensai.financial.Services.ApprovalService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/financial/approval")
@RequiredArgsConstructor
@Tag(name = "Approval Management", description = "managing approvals")
public class ApprovalController {
    private final ApprovalService approvalService;

}
