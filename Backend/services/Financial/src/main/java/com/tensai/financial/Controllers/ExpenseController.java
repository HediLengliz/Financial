package com.tensai.financial.Controllers;

import com.tensai.financial.DTOS.BudgetDTO;
import com.tensai.financial.DTOS.ExpenseDTO;
import com.tensai.financial.Entities.Status;
import com.tensai.financial.Services.BudgetService;
import com.tensai.financial.Services.ExpenseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/financial/expenses")
@RequiredArgsConstructor
@Tag(name = "Expense Management", description = "managing expenses")
public class ExpenseController {
    private static final Logger logger = LoggerFactory.getLogger(ExpenseController.class);

    @Autowired
    private  ExpenseService expenseService;
    @Autowired
    private final BudgetService budgetService;
    @GetMapping("/load-with-filters")
    @Operation(summary = "Load All Expenses with Filters", description = "Fetches all expenses with optional filtering parameters.")
    public ResponseEntity<List<ExpenseDTO>> loadExpensesWithFilters(
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "amount", required = false) BigDecimal amount,
            @RequestParam(value = "createdAt", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate createdAt,
            @RequestParam(value = "updatedAt", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate updatedAt,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "project_id", required = false) UUID project_id) {

        // Log incoming parameters for debugging
        logger.info("Received filter parameters - description: {}, amount: {}, createdAt: {}, updatedAt: {}, category: {}, status: {}",
                description, amount, createdAt, updatedAt, category, status);

        try {
            List<ExpenseDTO> filteredExpenses = expenseService.loadAllExpensesWithFilters(
                    description, amount, createdAt, updatedAt, category, status, project_id);
            return ResponseEntity.ok(filteredExpenses);
        } catch (Exception e) {
            logger.error("Error filtering expenses: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid filter parameters: " + e.getMessage(), e);
        }
    }
    @GetMapping("/all")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Expense retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid expense request")
    })
    @Operation(summary = "Get all expenses", description = "Fetches a list of all expenses.")
    public ResponseEntity<List<ExpenseDTO>> getAllExpenses() {
        return ResponseEntity.ok(expenseService.getAllExpenses());
    }

    @PostMapping("/create")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Expense created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid expense request")
    })
    @Operation(summary = "Create an expense", description = "Creates a new expense entry.")
    public ResponseEntity<ExpenseDTO> createExpense(@RequestBody ExpenseDTO expenseDTO) {
        if (expenseDTO.getProject_id() == null) {
            expenseDTO.setProject_id(UUID.randomUUID()); // Generate a new UUID if not provided
        }
//        if (expenseDTO.getSupplier_id() == null) {
//            expenseDTO.setSupplier_id(UUID.randomUUID()); // Generate a new UUID if not provided
//        }
        ExpenseDTO createdExpense = expenseService.createExpense(expenseDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdExpense); // Return 201 status
    }
    @DeleteMapping("/delete/{id}")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Expense deleted successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid expense request")
    })
    @Operation(summary = "Delete an expense", description = "Deletes an expense entry.")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.ok().build();
    }
    @PutMapping("/update/{id}")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Expense updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid expense request")
    })
    @Operation(summary = "Update an expense", description = "Updates an expense entry.")
    public ResponseEntity<ExpenseDTO> updateExpense(@RequestBody ExpenseDTO expenseDTO, @PathVariable Long id) {
        return ResponseEntity.ok(expenseService.updateExpense(id, expenseDTO));
    }
    @GetMapping("/get/{id}")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Expense retrieved with id successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid expense request")
    })
    @Operation(summary = "Get an expense", description = "Fetches an expense entry.")
    public ResponseEntity<ExpenseDTO> getExpense(@PathVariable Long id) {
        return ResponseEntity.ok(expenseService.getExpenseById(id));
    }
    @GetMapping("/getByStatus/{status}")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Expense retrieved with status successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid expense request")
    })
    @Operation(summary = "Get an expense by status", description = "Fetches an expense entry by status.")
    public ResponseEntity<List<ExpenseDTO>>getExpenseByStatus(@PathVariable Status status) {
        return ResponseEntity.ok(expenseService.getExpenseByStatus(status));
    }

    @GetMapping("/projects/{project_id}/budget")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Budget retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Budget not found for the given project ID")
    })
    @Operation(summary = "Get budget by project ID", description = "Fetches the budget associated with the provided project ID.")
    public ResponseEntity<BudgetDTO> getBudgetByProjectId(@PathVariable UUID project_id) {
        BudgetDTO budget = budgetService.getBudgetByProject(project_id);
        return ResponseEntity.ok(budget);
    }
}
