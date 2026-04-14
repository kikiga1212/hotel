package com.example.hotel.Controller;

import com.example.hotel.DTO.ReservationDTO;
import com.example.hotel.Repository.ReservationRepository;
import com.example.hotel.Service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// 예약 테이블에 대한 비동기식 요청처리
@RestControllerAdvice // 현재 각 메서드마다 try-catch로 RuntimeException을 처리하고 계신데,
// 이렇게 하면 컨트롤러 코드가 길어지고 중복이 발생합니다.
// @RestControllerAdvice를 사용하면 컨트롤러를 깨끗하게 유지하면서 에러를 통합 관리할 수 있습니다.
@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ReservationApiController {
    private final ReservationRepository reservationRepository;
    private final ReservationService reservationService;

    // 예약 생성
    @PostMapping
    public ResponseEntity<?> createReservation(@Valid @RequestBody ReservationDTO dto){
        try{
            ReservationDTO created = reservationService.createReservation(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created); // 201 반환
        }catch (RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage()); // 400오류
        }
    }

    // 내 예약 조회
    @GetMapping("/my")
    public ResponseEntity<List<ReservationDTO>> getMyReservation(@RequestParam String email){
        return ResponseEntity.ok(reservationService.getReservationByEmail(email));
    }

    // 예약 취소
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> cancelReservation(@PathVariable Long id){
        try{
            reservationService.cancelReservation(id);
            return ResponseEntity.ok("예약이 취소되었습니다.");
        }catch (RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


// 별도의 GlobalExceptionHandler 클래스 생성 예시
//@RestControllerAdvice
//public class GlobalExceptionHandler {
//    @ExceptionHandler(RuntimeException.class)
//    public ResponseEntity<String> handleRuntimeException(RuntimeException e) {
//        return ResponseEntity.badRequest().body(e.getMessage());
//    }
//}
// 이렇게 하면 컨트롤러에서는 try-catch를 모두 제거하고 비즈니스 로직에만 집중할 수 있습니다.
}
