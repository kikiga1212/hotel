package com.example.hotel.Entity;

import jakarta.persistence.*;
import jakarta.persistence.Entity;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

//호텔의 룸정보
@Entity
@Table(name="rooms")
@Getter
@Setter @NoArgsConstructor @AllArgsConstructor
@Builder
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; //번호, 기본키
    @Column(nullable = false, length = 100)
    private String name; //룸이름
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoomType roomType; //룸 종류
    @Column(nullable = false)
    private Integer capacity; //인원
    @Column(nullable = false, precision=10, scale =2)
    private BigDecimal pricePerNight; //가격
    @Column(length = 500)
    private String description; //룸설명
    @Column(nullable = false)
    private Boolean available; //룸사용 여부
    @Column(length = 255)
    private String imageUrl; //이미지 주소

    //룸과 예약을 연계처리
    //하나의 룸은 여러 예약이 존재가 가능
    @OneToMany(
            mappedBy = "room", //예약에 선언된 room테이블의 필드명
            cascade = CascadeType.ALL, //room삭제시 예약도 함께 적용
            fetch = FetchType.LAZY
    )
    private List<Reservation> reservations; //룸테이블 지정

    //열거형
    public enum RoomType {
        STANDARD("스탠다드"),
        DELUXE("디럭스"),
        SUITE("스위트"),
        PENTHOUSE("펜트하우스");

        private final String displayName;

        RoomType(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
}
