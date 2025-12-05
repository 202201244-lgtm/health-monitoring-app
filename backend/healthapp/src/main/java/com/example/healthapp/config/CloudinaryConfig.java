package com.example.healthapp.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dhmr7odyc",
                "api_key", "375988759529728",
                "api_secret", "ceFzdEHYRidDLNZvz5GV9OusO5s",
                "secure", true
        ));
    }
}
