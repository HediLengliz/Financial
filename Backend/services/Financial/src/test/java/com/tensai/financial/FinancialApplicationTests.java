package com.tensai.financial;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
        "spring.cloud.config.enabled=false",
        "eureka.client.enabled=false",
        "spring.config.import=optional:configserver:http://localhost:8888"
})
class FinancialApplicationTests {

    @Test
    void contextLoads() {
    }
}