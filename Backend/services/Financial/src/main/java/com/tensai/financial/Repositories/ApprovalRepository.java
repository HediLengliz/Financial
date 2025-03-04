package com.tensai.financial.Repositories;

import com.tensai.financial.Entities.Approval;
import com.tensai.financial.Entities.ApprovalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface ApprovalRepository extends JpaRepository<Approval, Long> {
    List<Approval> findByStatus(ApprovalStatus status);

}
