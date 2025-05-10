package com.tensai.financial.Config;

import com.tensai.financial.DTOS.NotificationDTO;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.listener.ContainerProperties;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.util.backoff.FixedBackOff;

@Configuration
@EnableKafka
public class KafkaListenerConfig {

    @Bean
    public DefaultErrorHandler errorHandler() {
        // Retry 2 times with 10 seconds interval
        return new DefaultErrorHandler(new FixedBackOff(10000L, 2L));
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, NotificationDTO> notificationKafkaListenerContainerFactory(
            ConsumerFactory<String, NotificationDTO> consumerFactory,
            DefaultErrorHandler errorHandler) {
        ConcurrentKafkaListenerContainerFactory<String, NotificationDTO> factory = 
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory);
        factory.setCommonErrorHandler(errorHandler);
        factory.getContainerProperties().setAckMode(ContainerProperties.AckMode.RECORD);
        return factory;
    }
} 