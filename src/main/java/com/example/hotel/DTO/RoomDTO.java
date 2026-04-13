package com.example.hotel.DTO;

import com.example.hotel.Entity.Room;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class RoomDTO {
    private Long id;
    @NotBlank(message = "룸 이름을 입력해 주세요.")
    @Size(max=100, message = "룸 이름은 100자 이내로 입력해주세요.")
    private String name; // 룸 이름
    @NotNull(message = "룸 타입을 선택해 주세요.")
    private Room.RoomType roomType; // 룸타입(종류)
    @NotNull(message = "수용 인원을 입력해주세요.")
    @Min(value = 1, message = "수용인원은 1명 이상이어야 합니다.")
    private Integer capacity; // 인원
    @NotNull(message = "1박 가격을 입력해주세요.")
    @DecimalMin(value = "0.01", message = "가격은 0보다 커야 합니다.")
    private BigDecimal pricePerNight; //1박가격
    @Size(max=500, message = "설명은 500자 이내로 입력해주세요.")
    private String description; // 룸설명
    private boolean available; // 사용여부
    private String imageUrl; // 이미지

}
