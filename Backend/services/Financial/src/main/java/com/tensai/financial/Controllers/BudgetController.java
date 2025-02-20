package com.tensai.financial.Controllers;

import com.tensai.financial.DTOS.BudgetDTO;
import com.tensai.financial.Entities.Approval;
import com.tensai.financial.Entities.Status;
import com.tensai.financial.Entities.Transaction;
import com.tensai.financial.Services.BudgetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/budgets")
@RequiredArgsConstructor
@Tag(name = "Budget Management", description = "managing budgets")
public class BudgetController{
    private final BudgetService budgetService;
    @Operation(summary = "Get Project Budget", description = "Fetch budget details for a project")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Budget details retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Budget not found")
    })
    @GetMapping("/{projectId}")
    public ResponseEntity<BudgetDTO> getBudget(@PathVariable UUID projectId) {
        return ResponseEntity.ok(budgetService.getBudgetByProject(projectId));
    }

    @GetMapping("/all")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Budget details retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Budget not found")
    })
    @Operation(summary = "Get all budgets", description = "Fetches a list of all budgets.")
    public ResponseEntity<List<BudgetDTO>> getAllBudgets() {
        return ResponseEntity.ok(budgetService.getAllBudgets());
    }

    @PostMapping("/create/{status}/{transaction}/{approval}")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Budget details created successfully"),
            @ApiResponse(responseCode = "404", description = "Budget not found")
    })
    @Operation(summary = "Create a budget", description = "Creates a new budget entry.")
    public ResponseEntity<BudgetDTO> createBudget(@RequestBody BudgetDTO budgetDTO, @PathVariable Status status, @PathVariable Transaction transaction, @PathVariable Approval approval) {
        budgetDTO.setStatus(status);
        budgetDTO.setTransaction(transaction);
        budgetDTO.setApproval(approval);
        return ResponseEntity.ok(budgetService.createBudget(budgetDTO));
    }
    @DeleteMapping("/delete/{id}")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Budget deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Budget not found")
    })
    @Operation(summary = "Delete a budget", description = "Deletes a budget entry.")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.ok().build();
    }
    @PutMapping("/update/{id}")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Budget updated with project id successfully"),
            @ApiResponse(responseCode = "404", description = "Budget not found")
    })
    @Operation(summary = "Update a budget", description = "Updates a budget entry.")
    public ResponseEntity<BudgetDTO> updateBudget(@RequestBody BudgetDTO budgetDTO, @PathVariable UUID id) {
        return ResponseEntity.ok(budgetService.updateBudget(id, budgetDTO));
    }
    @GetMapping("/get/{id}")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Budget details by id retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Budget not found")
    })
    @Operation(summary = "Get a budget", description = "Fetches a budget entry.")
    public ResponseEntity<BudgetDTO> getBudget(@PathVariable Long id) {
        return ResponseEntity.ok(budgetService.getBudgetById(id));
    }
    @GetMapping("/getByStatus/{status}")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Budget details by status retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Budget not found")
    })
    @Operation(summary = "Get a budget by status", description = "Fetches a budget entry by status.")
    public ResponseEntity<BudgetDTO> getBudgetByStatus(@PathVariable Status status) {
        return ResponseEntity.ok(budgetService.getBudgetByStatus(status));
    }

}
