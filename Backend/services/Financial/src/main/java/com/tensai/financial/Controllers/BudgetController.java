package com.tensai.financial.Controllers;

import com.tensai.financial.DTOS.BudgetDTO;
import com.tensai.financial.Entities.*;
import com.tensai.financial.Repositories.BudgetRepository;
import com.tensai.financial.Services.BudgetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/financial/budgets")
@RequiredArgsConstructor
@Tag(name = "Budget Management", description = "managing budgets")
public class BudgetController{
    private final BudgetService budgetService;
    private final BudgetRepository budgetRepository;

    @GetMapping("/test")
    public String test() {
        return "Budget Controller works!";
    }
    @Operation(summary = "Get Project Budget", description = "Fetch budget details for a project")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Budget details retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Budget not found")
    })
    @GetMapping("/{projectId}")
    public ResponseEntity<BudgetDTO> getBudget(@PathVariable UUID projectId) {
        return ResponseEntity.ok(budgetService.getBudgetByProject(projectId));
    }
    @GetMapping("/ ")
    @Operation(summary = "Load All Budgets with Filters", description = "Fetches all budgets with optional filtering parameters.")
    public ResponseEntity<List<BudgetDTO>> loadBudgetsWithFilters(
            @RequestParam(value = "projectName", required = false) String projectName,
            @RequestParam(value = "spentAmount", required = false) BigDecimal spentAmount,
            @RequestParam(value = "remainingAmount", required = false) BigDecimal remainingAmount,
            @RequestParam(value = "createdAt", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate createdAt,
            @RequestParam(value = "updatedAt", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate updatedAt,
            @RequestParam(value = "transaction", required = false) String transactionStr,
            @RequestParam(value = "approval", required = false) String approvalStr,
            @RequestParam(value = "budgetStatus", required = false) String budgetStatusStr,
            @RequestParam(value = "status", required = false) String status) {

        List<BudgetDTO> filteredBudgets = budgetService.loadAllBudgetsWithFilters(projectName,spentAmount,remainingAmount,createdAt,updatedAt, transactionStr, approvalStr, budgetStatusStr, status);
        return ResponseEntity.ok(filteredBudgets);
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

    @PostMapping("/create")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Budget details created successfully"),
            @ApiResponse(responseCode = "404", description = "Budget not found")
    })
    @Operation(summary = "Create a budget", description = "Creates a new budget entry.")
    public ResponseEntity<BudgetDTO> createBudget(@RequestBody BudgetDTO budgetDTO) {
        // Always generate a new UUID for projectId
        budgetDTO.setProjectId(UUID.randomUUID());

        // Check if a budget already exists for the new projectId (should never happen due to new UUID)
        if (budgetRepository.findByProjectId(budgetDTO.getProjectId()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unexpected error: Duplicate project ID generated");
        }

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
    public ResponseEntity<BudgetDTO> updateBudget(@RequestBody BudgetDTO budgetDTO, @PathVariable Long id) {
        if (budgetDTO.getProjectId() == null) {
            budgetDTO.setProjectId(UUID.randomUUID()); // Generate a new UUID if not provided
        }
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
    @GetMapping("/forecast/{id}")
    @Operation(summary = "Forecast Project Budget", description = "Calculates the forecasted budget for a project based on past expenses.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Forecast calculated successfully"),
            @ApiResponse(responseCode = "404", description = "Project not found or no expenses available")
    })
    public ResponseEntity<Map<String, Object>> forecastProjectBudget(@PathVariable Long id) {
        BigDecimal forecast = budgetService.forecastProjectBudget(id);
        Map<String, Object> response = new HashMap<>();

        if (forecast != null) {
            response.put("forecast", forecast);
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "No past expenses available to forecast the budget.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

}
