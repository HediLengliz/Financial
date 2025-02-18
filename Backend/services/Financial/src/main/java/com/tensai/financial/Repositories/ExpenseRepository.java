package com.tensai.financial.Repositories;

import com.tensai.financial.Entities.Expense;
import com.tensai.financial.Entities.Status;
import org.checkerframework.common.value.qual.EnsuresMinLenIf;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    @Query("SELECT e FROM Expense e WHERE e.status = ?1")
    Expense getExpenseByStatus(Status status);
    Optional<Expense> findByStatus(Status status);


    @Query("SELECT e FROM Expense e WHERE e.id = ?1")
    Expense getExpenseById(Long id);

    @Query("SELECT e FROM Expense e WHERE e.description = ?1")
    Expense getExpenseByDescription(String description);

    @Query("SELECT e FROM Expense e WHERE e.amount = ?1")
    Expense getExpenseByAmount(Double amount);


}
