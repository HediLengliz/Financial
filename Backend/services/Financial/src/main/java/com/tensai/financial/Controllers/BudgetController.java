package com.tensai.financial.Controllers;

import com.tensai.financial.DTOS.BudgetDTO;
import com.tensai.financial.Services.BudgetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/budgets")
@RequiredArgsConstructor
@Tag(name = "Budget Management", description = "managing budgets")
public class BudgetController{
    private final BudgetService budgetService;

    @GetMapping("/all")
    @Operation(summary = "Get all budgets", description = "Fetches a list of all budgets.")
    public ResponseEntity<List<BudgetDTO>> getAllBudgets() {
        return ResponseEntity.ok(budgetService.getAllBudgets());
    }

    @PostMapping("/create")
    @Operation(summary = "Create a budget", description = "Creates a new budget entry.")
    public ResponseEntity<BudgetDTO> createBudget(@RequestBody BudgetDTO budgetDTO) {
        return ResponseEntity.ok(budgetService.createBudget(budgetDTO));
    }
    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Delete a budget", description = "Deletes a budget entry.")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.ok().build();
    }
    @PutMapping("/update/{id}")
    @Operation(summary = "Update a budget", description = "Updates a budget entry.")
    public ResponseEntity<BudgetDTO> updateBudget(@RequestBody BudgetDTO budgetDTO, @PathVariable Long id) {
        return ResponseEntity.ok(budgetService.updateBudget(id, budgetDTO));
    }
    @GetMapping("/get/{id}")
    @Operation(summary = "Get a budget", description = "Fetches a budget entry.")
    public ResponseEntity<BudgetDTO> getBudget(@PathVariable Long id) {
        return ResponseEntity.ok(budgetService.getBudgetById(id));
    }

}
