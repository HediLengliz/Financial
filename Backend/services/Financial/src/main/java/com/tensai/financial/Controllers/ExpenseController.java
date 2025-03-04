package com.tensai.financial.Controllers;

import com.tensai.financial.DTOS.ExpenseDTO;
import com.tensai.financial.Entities.Status;
import com.tensai.financial.Services.ExpenseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/financial/expenses")
@RequiredArgsConstructor
@Tag(name = "Expense Management", description = "managing expenses")
public class ExpenseController {
    @Autowired
    private  ExpenseService expenseService;

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
        return ResponseEntity.ok(expenseService.createExpense(expenseDTO));
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
    public ResponseEntity<ExpenseDTO> getExpenseByStatus(@PathVariable Status status) {
        return ResponseEntity.ok(expenseService.getExpenseByStatus(status));
    }
}
