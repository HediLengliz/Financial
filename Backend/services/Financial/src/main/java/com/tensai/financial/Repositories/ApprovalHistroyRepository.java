package com.tensai.financial.Repositories;

import com.tensai.financial.Entities.ApprovalHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.sql.rowset.Joinable;
import java.util.List;

@Repository
public interface ApprovalHistroyRepository extends JpaRepository<ApprovalHistory, Long> {
    List<ApprovalHistory> findByApprovalId(Long approvalId);
}
