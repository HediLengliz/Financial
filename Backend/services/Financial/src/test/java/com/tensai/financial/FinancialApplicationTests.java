package com.tensai.financial;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {"spring.cloud.config.enabled=false","eureka.client.enabled=false"})
class FinancialApplicationTests {
    //test endpoints health
    @Test
    void contextLoads() {

    }

}
