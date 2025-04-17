package com.tensai.financial;

// import com.tensai.financial.Config.*; // Keep ResilienceConfig if needed, remove others
import com.tensai.financial.Config.ResilienceConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
// import org.springframework.cloud.openfeign.EnableFeignClients; // Removed
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@EnableDiscoveryClient
@EnableJpaAuditing
// @EnableFeignClients(basePackages = "com.tensai.financial.client", defaultConfiguration = FeignLoggingConfig.class) // Removed
// @Import({FeignLoggingConfig.class, ResilienceConfig.class}) // Keep ResilienceConfig if needed
@Import(ResilienceConfig.class) // Assuming ResilienceConfig is still needed
@EnableScheduling
public class FinancialApplication {

    public static void main(String[] args) {
        SpringApplication.run(FinancialApplication.class, args);
    }

}
