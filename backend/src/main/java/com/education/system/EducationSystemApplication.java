package com.education.system;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.autoconfigure.h2.H2ConsoleAutoConfiguration;
import org.springframework.context.annotation.Profile;

@SpringBootApplication(exclude = {
    HibernateJpaAutoConfiguration.class
})
@MapperScan("com.education.system.mapper")
public class EducationSystemApplication {
    public static void main(String[] args) {
        SpringApplication.run(EducationSystemApplication.class, args);
    }
}