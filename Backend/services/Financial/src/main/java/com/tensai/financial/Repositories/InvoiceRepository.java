package com.tensai.financial.Repositories;

import com.tensai.financial.Entities.Invoice;
import com.tensai.financial.Entities.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    Optional<Invoice> findByStatus(Status status);
}
