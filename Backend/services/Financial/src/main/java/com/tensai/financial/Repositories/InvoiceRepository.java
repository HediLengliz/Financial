package com.tensai.financial.Repositories;

import com.tensai.financial.Entities.ApprovalStatus;
import com.tensai.financial.Entities.Expense;
import com.tensai.financial.Entities.Invoice;
import com.tensai.financial.Entities.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    Optional<Invoice> findByStatus(Status status);

    @Query("SELECT e FROM Invoice e WHERE " +
            "(:invoiceNumber IS NULL OR e.invoiceNumber LIKE %:invoiceNumber%) " +
            "AND (:amount IS NULL OR e.amount = :amount) " +
            "AND (:totalAmount IS NULL OR e.totalAmount = :totalAmount) " +
            "AND (:issued_by IS NULL OR e.issued_by LIKE %:issued_by%) " +
            "AND (:issued_to IS NULL OR e.issued_to LIKE %:issued_to%) " +
            "AND (:issueDate IS NULL OR e.issueDate = :issueDate) " +
            "AND (:tax IS NULL OR e.tax = :tax) " +
            "AND (:dueDate IS NULL OR e.dueDate = :dueDate) " +
            "AND (:created_at IS NULL OR e.created_at = :created_at) " +
            "AND (:status IS NULL OR e.status = :status) " +
            "AND (:approvalStatus IS NULL OR e.approvalStatus = :approvalStatus)")
    List<Invoice> findAllByFilters(
            @Param("invoiceNumber") String invoiceNumber,
            @Param("amount") BigDecimal amount,
            @Param("totalAmount") BigDecimal totalAmount,
            @Param("issued_by") String issued_by,
            @Param("issued_to") String issued_to,
            @Param("issueDate") LocalDate issueDate,
            @Param("tax") BigDecimal tax,
            @Param("dueDate") LocalDate dueDate,
            @Param("created_at") LocalDate created_at,
            @Param("status") Status status,
            @Param("approvalStatus") ApprovalStatus approvalStatus);
}
