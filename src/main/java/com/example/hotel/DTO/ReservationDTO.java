package com.example.hotel.DTO;

import com.example.hotel.Entity.Reservation;
import jakarta.validation.constraints.*;
import lombok.*;
import org.aspectj.bridge.Message;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ReservationDTO {
    private Long id; // 번호
    // Entity에서 @JoinColumn(name="room_id"로 선언)
    @NotNull(message = "룸을 선택해주세요.")
    private Long roomId;// 룸 번호

    private String roomName; // 화면출력용 룸이름
    private String roomType; // 룸종류

    @NotBlank(message = "이름을 입력해주세요.")
    @Size(max=100, message = "이름은 100자 이내로 입력해주세요.")
    private String guestName; // 예약자이름
    @NotBlank(message = "이메일을 입력해주세요.")
    @Email(message = "올바른 이메일 형식으로 입력해주세요.")
    private String guestEmail;
    @NotBlank(message = "연락처를 입력해주세요.")
    @Pattern(regexp ="^[0-9-+]{10,20}&",
    message = "올바른 연락처 형식으로 입력해주세요.")
    private String guestPhone; //전화번호
    @NotNull(message = "체크인 날짜를 선택해 주세요.")
    private LocalDate checkInDate ; //체크인 날짜
    @NotNull(message = "체크아웃 날짜를 선택해 주세요.")
    private LocalDate checkOutDate; //체크아웃 날짜
    @NotNull(message = "투숙 인원을 입력해 주세요.")
    @Min(value = 1, message="투숙인원은 1명이상이어야 합니다.")
    private Integer numberOfGuests; // 인원수
    private BigDecimal totalPrice; // 금액
    private Reservation.ReservationStatus status; // 예약상태
    private String statusDisplayName; // 예약의 출력
    @Size(max=500, message = "요구사항은 500자이내로 입력해주세요.")
    private String specialRequests; // 요구사항

    private LocalDateTime createdAt; // 생성일자
    private LocalDateTime updatedAt; // 수정일자


}
