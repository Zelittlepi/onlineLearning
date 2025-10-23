package com.education.system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.autoconfigure.h2.H2ConsoleAutoConfiguration;
import org.springframework.context.annotation.Profile;

@SpringBootApplication(exclude = {
    HibernateJpaAutoConfiguration.class
})
public class EducationSystemApplication {
    public static void main(String[] args) {
        SpringApplication.run(EducationSystemApplication.class, args);
    }
}