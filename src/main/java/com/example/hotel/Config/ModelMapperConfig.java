package com.example.hotel.Config;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.modelmapper.spi.MatchingStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.print.attribute.standard.Destination;

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
// MatchingStrategies.STRICT의 장점
// 안정성: 기본 전략인 STANDARD는 이름이 대충 비슷하면 자동으로 매핑해주는데, 이게 가끔 엉뚱한 필드를 채우는 원인이 됩니다.
// STRICT는 소스(Source)와 대상(Destination)의 필드 계층 구조가 완벽히 일치할 때만 매핑하므로 데이터 정합성이 보장
// setSkipNullEnabled(true)의 활용 : 이 설정은 특히 수정(Update) 로직에서 빛을 발합니다.
// 클라이언트가 수정 요청 시 특정 필드만 보내고 나머지는 null로 보낼 때, 기존 엔티티의 값을 유지하면서 보낸 값만 덮어쓰고 싶을 때 매우 유용합니다.