package com.example.hotel.Config;

import com.example.hotel.Entity.Room;
import com.example.hotel.Repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

// 초기데이터 등록
// 테이블이 1~2개 일때는 적합
// 테이블이 많으면 SQL문으로 따로 작성
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final RoomRepository roomRepository;

    @Override
    public void run(String... args){
        // 테이블에 데이터가 없으면
        if(roomRepository.count() == 0){
            List<Room> rooms = List.of(
                    Room.builder()
                            .name("스탠다드 트윈룸 101")
                            .roomType(Room.RoomType.STANDARD)
                            .capacity(2)
                            .pricePerNight(new BigDecimal("120000"))
                            .description("편안한 트윈 침대와 도시 전망을 갖춘 스탠다드룸입니다. 무료 Wi-Fi, 미니바, 평면 TV가 제공됩니다.")
                            .available(true)
                            .imageUrl("https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800")
                            .build(),

                    Room.builder()
                            .name("스탠다드 더블룸 102")
                            .roomType(Room.RoomType.STANDARD)
                            .capacity(2)
                            .pricePerNight(new BigDecimal("130000"))
                            .description("퀸사이즈 침대가 놓인 아늑한 더블룸입니다. 조식 포함 옵션 선택 가능합니다.")
                            .available(true)
                            .imageUrl("https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800")
                            .build(),

                    Room.builder()
                            .name("디럭스 오션뷰 201")
                            .roomType(Room.RoomType.DELUXE)
                            .capacity(2)
                            .pricePerNight(new BigDecimal("220000"))
                            .description("탁 트인 바다 전망이 아름다운 디럭스룸입니다. 킹사이즈 침대, 욕조, 발코니가 포함됩니다.")
                            .available(true)
                            .imageUrl("https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800")
                            .build(),

                    Room.builder()
                            .name("디럭스 가든뷰 202")
                            .roomType(Room.RoomType.DELUXE)
                            .capacity(3)
                            .pricePerNight(new BigDecimal("200000"))
                            .description("아름다운 정원이 내려다보이는 디럭스룸입니다. 소파베드 추가로 3인 투숙 가능합니다.")
                            .available(true)
                            .imageUrl("https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800")
                            .build(),

                    Room.builder()
                            .name("스위트룸 301")
                            .roomType(Room.RoomType.SUITE)
                            .capacity(4)
                            .pricePerNight(new BigDecimal("450000"))
                            .description("독립된 거실과 침실로 구성된 럭셔리 스위트룸입니다. 파노라마 전망과 욕실 2개, 주방 시설이 완비되어 있습니다.")
                            .available(true)
                            .imageUrl("https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800")
                            .build(),

                    Room.builder()
                            .name("로얄 스위트 302")
                            .roomType(Room.RoomType.SUITE)
                            .capacity(4)
                            .pricePerNight(new BigDecimal("550000"))
                            .description("최고급 인테리어로 꾸며진 로얄 스위트룸입니다. 전용 버틀러 서비스와 스파 시설을 이용하실 수 있습니다.")
                            .available(true)
                            .imageUrl("https://images.unsplash.com/photo-1609766934674-e73c5fd0c6ec?w=800")
                            .build(),

                    Room.builder()
                            .name("펜트하우스 A")
                            .roomType(Room.RoomType.PENTHOUSE)
                            .capacity(6)
                            .pricePerNight(new BigDecimal("1200000"))
                            .description("최상층에 위치한 초호화 펜트하우스입니다. 개인 수영장, 테라스, 풀 주방, 3개의 침실을 갖추고 있으며 360도 전망을 자랑합니다.")
                            .available(true)
                            .imageUrl("https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800")
                            .build()
            );

            // 동시에 여러개 저장
            roomRepository.saveAll(rooms); //리스트로 구성된 내용을 한번에 저장
            System.out.println("샘플 룸 데이터가 7개가 생성되었습니다.");
        }
    }
}
