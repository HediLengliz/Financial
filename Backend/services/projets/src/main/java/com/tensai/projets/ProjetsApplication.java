package com.tensai.projets;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication(scanBasePackages = "com.tensai.projets")
@EnableJpaAuditing
@EnableDiscoveryClient
@EnableFeignClients
@EnableAsync
public class ProjetsApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProjetsApplication.class, args);
	}

}
