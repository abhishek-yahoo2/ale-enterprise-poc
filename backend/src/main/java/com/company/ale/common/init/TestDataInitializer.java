package com.company.ale.common.init;

import com.company.ale.documenttracker.domain.DocumentTracker;
import com.company.ale.documenttracker.domain.SubDocument;
import com.company.ale.documenttracker.domain.SubIdStatus;
import com.company.ale.documenttracker.repository.DocumentTrackerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

/**
 * Data Initializer for Development/Testing
 * Creates 50 test records in the document_tracker table on application startup
 * Profile: dev (only runs in development environment)
 */
@Configuration
@Profile("dev")
@RequiredArgsConstructor
public class TestDataInitializer {
    
    private final DocumentTrackerRepository documentTrackerRepository;
    private static final Random random = new Random();
    
    /**
     * Initialize test data on application startup
     * Creates 50 document tracker records with sub-documents
     */
    @Bean
    public ApplicationRunner initializeTestData() {
        return args -> {
            // Only initialize if no data exists
            if (documentTrackerRepository.count() == 0) {
                List<DocumentTracker> testData = generateTestData();
                documentTrackerRepository.saveAll(testData);
                System.out.println("Test data initialized: " + testData.size() + " documents created");
            }
        };
    }
    
    /**
     * Generate 50 test DocumentTracker records
     * Each record has 2-4 sub-documents with varying statuses
     */
    private List<DocumentTracker> generateTestData() {
        List<DocumentTracker> documents = new java.util.ArrayList<>();
        
        String[] documentTypes = {
            "INVOICE", "PO", "RECEIPT", "SHIPPING", "INSURANCE", 
            "LEGAL", "FINANCIAL", "COMPLIANCE", "REPORT", "CONTRACT"
        };
        
        String[] statusMessages = {
            "Processing completed successfully",
            "Document validated against rules",
            "Failed validation check",
            "Pending manual review",
            "Processing in progress",
            "Awaiting approval",
            "Document archived"
        };
        
        LocalDateTime baseDateTime = LocalDateTime.now().minusDays(30);
        
        for (int i = 1; i <= 50; i++) {
            String genId = String.format("GEN%08d", i);
            String documentType = documentTypes[random.nextInt(documentTypes.length)];
            LocalDateTime receivedAt = baseDateTime.plusDays(random.nextInt(30)).plusHours(random.nextInt(24));
            
            DocumentTracker doc = DocumentTracker.builder()
                .genId(genId)
                .documentType(documentType)
                .receivedAt(receivedAt)
                .createdAt(receivedAt)
                .createdBy("TEST_USER")
                .modifiedAt(LocalDateTime.now())
                .modifiedBy("TEST_USER")
                .build();
            
            // Add 2-4 sub-documents
            int subDocCount = 2 + random.nextInt(3);
            for (int j = 0; j < subDocCount; j++) {
                SubDocument subDoc = createTestSubDocument(genId, j + 1, statusMessages);
                doc.addSubDocument(subDoc);
            }
            
            documents.add(doc);
        }
        
        return documents;
    }
    
    /**
     * Create a test SubDocument with random status
     */
    private SubDocument createTestSubDocument(String genId, int subDocIndex, String[] statusMessages) {
        SubIdStatus[] statuses = SubIdStatus.values();
        SubIdStatus status = statuses[random.nextInt(statuses.length)];
        String message = statusMessages[random.nextInt(statusMessages.length)];
        LocalDateTime processedAt = LocalDateTime.now().minusHours(random.nextInt(72));
        
        return SubDocument.builder()
            .subId(genId + "_SUB_" + subDocIndex)
            .status(status)
            .statusMessage(message)
            .processedAt(processedAt)
            .createdAt(processedAt)
            .createdBy("TEST_USER")
            .modifiedAt(LocalDateTime.now())
            .modifiedBy("TEST_USER")
            .build();
    }
}
