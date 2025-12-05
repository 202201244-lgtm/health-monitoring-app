package com.example.healthapp.config;

import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MqttConfig {

    @Bean
    public MqttConnectOptions mqttOptions() {
        MqttConnectOptions options = new MqttConnectOptions();
        options.setCleanSession(true);
        options.setUserName("mitulsudani188");
        options.setPassword("Mitulsudani188".toCharArray());
        return options;
    }
}
