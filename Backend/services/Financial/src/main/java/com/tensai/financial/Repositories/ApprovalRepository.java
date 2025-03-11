package com.tensai.financial.Repositories;

import com.tensai.financial.Entities.Approval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ApprovalRepository extends JpaRepository<Approval, Long> {
    Optional<Approval> findByExpenseId(Long expenseId);
    Optional<Approval> findByInvoiceId(Long invoiceId);
    Optional<Approval> findByProjectId(UUID projectId);
}