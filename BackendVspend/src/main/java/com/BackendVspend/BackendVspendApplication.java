package com.backendvspend;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;

import org.springframework.scheduling.annotation.EnableAsync;


@SpringBootApplication
@EnableAsync
@ComponentScan(basePackages = "com.backendvspend")
@EnableJpaRepositories(basePackages = "com.backendvspend.repository")
@EntityScan(basePackages = "com.backendvspend.model")
public class BackendVspendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendVspendApplication.class, args);
    }
}
