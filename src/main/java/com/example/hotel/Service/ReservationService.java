package com.example.hotel.Service;

import com.example.hotel.DTO.ReservationDTO;
import com.example.hotel.Entity.Reservation;
import com.example.hotel.Repository.ReservationRepository;
import com.example.hotel.Repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// 자식테이블에 대한 비지니스 로직
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository; // 부모
    private final ModelMapper modelMapper;

    // Entity->DTO 변환
    private ReservationDTO toDTO(Reservation reservation){
        ReservationDTO dto = modelMapper.map(reservation, ReservationDTO.class);

        // 연관테이블인 부모테이블에서 필요한 변수만 추출해서 적용
        dto.setRoomId(reservation.getRoom().getId());
        dto.setRoomName(reservation.getRoom().getName());
        dto.setRoomType(reservation.getRoom().getRoomType().getDisplayName());
        dto.setStatusDisplayName(reservation.getStatus().getDisplayName());

        return dto;
    }
}
