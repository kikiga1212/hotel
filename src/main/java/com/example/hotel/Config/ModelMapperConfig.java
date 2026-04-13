package com.example.hotel.Config;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.modelmapper.spi.MatchingStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {
    @Bean
    public ModelMapper modelMapper(){
        ModelMapper modelMapper = new ModelMapper();

        modelMapper.getConfiguration()
                // 필드이름이 정확하게 일치하는 것만 맵핑처리
                .setMatchingStrategy(MatchingStrategies.STRICT)
                .setSkipNullEnabled(true); // null 갑은 매핑에서 제외
        return modelMapper;
    }
}
