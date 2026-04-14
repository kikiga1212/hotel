package com.example.hotel.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

//예약테이블
@Entity
@Table(name="reservation")
@Getter@Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; //번호, 기본키
    @Column(nullable = false, length = 100)
    private String guestName; // 예약자이름
    @Column(nullable = false, length = 100)
    private String guestEmail; // 예약자이메일
    @Column(nullable = false, length = 20)
    private String guestPhone; //예약자 전화번호
    @Column(nullable = false)
    private LocalDate checkInDate; //체크인 날짜
    @Column(nullable = false)
    private LocalDate checkOutDate; //체크아웃 날짜
    @Column(nullable = false)
    private Integer numberOfGuests; // 투숙인원
    @Column(nullable = false, precision = 10, scale=2)
    private BigDecimal totalPrice; // 금액
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status; // 예약상태
    @Column(length = 500)
    private String specialRequests; // 요청사항
    @Column(nullable = false)
    private LocalDateTime createdAt; // 생성일자
    private LocalDateTime updatedAt; // 수정시간

    // 룸테이블과의 관계
    // 여러 예약은 하나의 룸을 선택할 수 있다.
    @ManyToOne(fetch = FetchType.LAZY)
    //room_id(FK)는 room 테이블의 id과 관계
    @JoinColumn(name="room_id", nullable = false) // 자식테이블에서 중요
    private Room room;

    // 날짜를 jpa의 자동생성이 아닌 수동으로 처리
    @PrePersist
    protected void onCreate(){
        createdAt = LocalDateTime.now(); // 생성시간을 설정
        if(status == null){ // 예약상태가 없으면 기본값으로 설정
            status = ReservationStatus.PENDING;
        }
    }

    // 수정시
    @PreUpdate
    protected void onUpdate(){
        updatedAt = LocalDateTime.now();
    }

    // 예약상태 열거형
    public enum ReservationStatus {
        PENDING("대기중"),
        CONFIRMED("확정"),
        CANCELLED("취소"),
        COMPLETED("완료");

        private final String displayName;
        // enum 을 개별클래스로 만들어서 사용시 필요없음
        ReservationStatus(String displayName){
            this.displayName = displayName;
        }

        public String getDisplayName(){
            return displayName;
        }
    }
}
