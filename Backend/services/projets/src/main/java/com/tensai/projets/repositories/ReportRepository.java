package com.tensai.projets.repositories;

import com.tensai.projets.models.Report;
import com.tensai.projets.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    // Find all reports for a specific project
    List<Report> findByWhichProjectIsLinkedToId(Long projectId);

    // Find all reports created by a specific user
    List<Report> findByWhoCreatedIt(User user);

    // Find the latest report for a specific project
    Report findTopByWhichProjectIsLinkedToIdOrderByCreatedAtDesc(Long projectId);
}