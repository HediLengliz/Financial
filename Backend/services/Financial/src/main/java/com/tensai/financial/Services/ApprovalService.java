package com.tensai.financial.Services;

import com.tensai.financial.Entities.Approval;
import com.tensai.financial.Repositories.ApprovalRepository;
import com.tensai.financial.Repositories.ExpenseRepository;
import com.tensai.financial.Repositories.InvoiceRepository;
import lombok.AllArgsConstructor;
import org.apache.catalina.Manager;
import org.springframework.boot.context.properties.bind.validation.BindValidationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
@Service
@AllArgsConstructor
public class ApprovalService implements  IApprovalService {
    private ApprovalRepository approvalRepository;
    private ExpenseRepository expenseRepository;
    private InvoiceRepository invoiceRepository;



    @Override
    public void requestExpenseApproval(Long InvoideId, Long id) {
//        ApprovalRequest approval = new ApprovalRequest(UUID.randomUUID(), id, id, "Pending");
//        approvalRequestRepository.save(approval);
    }

    @Override
    public void approveExpense(Long id, UUID managerId) {


    }
    public List<Approval> getAllApprovals() {
        return approvalRepository.findAll();
    }
}

