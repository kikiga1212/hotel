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
}
