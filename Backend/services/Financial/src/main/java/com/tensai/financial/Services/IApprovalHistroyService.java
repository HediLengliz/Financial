package com.tensai.financial.Services;

import com.tensai.financial.Entities.ApprovalHistory;

import java.util.List;

public interface IApprovalHistroyService {
    void logHistory(Long approvalId, String action, String performedBy);
    List<ApprovalHistory> getHistoryByApprovalId(Long approvalId);
}
