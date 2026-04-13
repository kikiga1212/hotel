package com.example.hotel.Controller;

import com.example.hotel.DTO.RoomDTO;
import com.example.hotel.Service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

//룸테이블에 대한 비동기 요청 처리
@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
//스프링부트 외부에서 접근하면 CORS(권한 제한)
@CrossOrigin(origins = "http://localhost:5173") // react요청을 허용
public class RoomApiController {
    private final RoomService roomService;

    // 룸 목록 조회
    @GetMapping
    public ResponseEntity<List<RoomDTO>> getAllRooms(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)LocalDate checkIn,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)LocalDate checkOut) {

        if(checkIn != null && checkOut != null){ //체크인과 체크아웃이 존재하면
            // 해당날짜에 사용가능한 룸을 조회
            return ResponseEntity.ok(
                    roomService.getAvailableRoomsForDates(checkIn, checkOut));
        }

        // 날짜가 없으면 사용가능한 모든 룸을 조회
        return ResponseEntity.ok(roomService.getAvailableRooms());
    }
}
