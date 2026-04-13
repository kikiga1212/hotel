package com.example.hotel.Service;

import com.example.hotel.DTO.ReservationDTO;
import com.example.hotel.Entity.Reservation;
import com.example.hotel.Entity.Room;
import com.example.hotel.Repository.ReservationRepository;
import com.example.hotel.Repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

// 자식테이블에 대한 비지니스 로직
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository; // 부모
    private final ModelMapper modelMapper;

    // 전체 예약 조회
    public List<ReservationDTO> getAllReservations(){
        return reservationRepository.findAllWithRoom().stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    // 예약 개별조회
    public ReservationDTO getReservationById(Long id){
        Reservation reservation = reservationRepository.findByIdWithRoom(id)
                .orElseThrow(()-> new RuntimeException("예약을 찾을 수 없습니다. ID:"+id));

        return toDTO(reservation);
    }

    // 이메일 기준 예약 조회
    public List<ReservationDTO> getReservationByEmail(String email){
        return reservationRepository.findByGuestEmail(email).stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    // 1. 중복 예약 검증 로직 누락 (가장 중요)
    //현재 createReservation 로직에는 "해당 날짜에 이미 다른 예약이 있는지" 확인하는 과정이 빠져 있습니다.
    // 예약 등록(생성)
    @Transactional
    public ReservationDTO createReservation(ReservationDTO dto){
        // 자식테이블은 반드시 부모테이블의 존재 여부 후 작업
        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(()-> new RuntimeException("품을 찾을 수 없습니다. ID:"+dto.getRoomId()));
        // 룸 사용여부 (객실 자체의 사용가능여부 : 고장/폐쇄 등)
        if(!room.getAvailable()){
            throw new RuntimeException("선택한 룸은 현재 예약이 불가능합니다.");
        }

        // 예약날짜 검증( 입력한 날짜 자체의 논리적 오류 체크)
        // (예: 체크아웃이 체크인보다 빠른지, 과거 날짜인지)를 확인합니다.
        validateDates(dto.getCheckInDate(), dto.getCheckOutDate());

        // 4. ★ 해당 날짜에 이미 다른 예약이 있는지 체크 (중복 예약) ★
        List<Room> availableRooms = roomRepository.findAvailableRooms(dto.getCheckInDate(), dto.getCheckOutDate());
        boolean isAlreadyBooked = availableRooms.stream()
                .noneMatch(r -> r.getId().equals(dto.getRoomId()));

        if (isAlreadyBooked) {
            throw new RuntimeException("선택하신 날짜에는 이미 예약이 완료된 객실입니다.");
        }

        // 숙박일수 계산(체크인에서 체크아웃까지 날수)
        long nights = ChronoUnit.DAYS.between(dto.getCheckInDate(), dto.getCheckOutDate());
        // 총 금액 계산(날수*1일 숙박비)
        BigDecimal totalPrice = room.getPricePerNight().multiply(BigDecimal.valueOf(nights));

        // 저장할 Entity 생성
        Reservation reservation = Reservation.builder()
                .room(room)
                .guestName(dto.getGuestName())
                .guestEmail(dto.getGuestEmail())
                .guestPhone(dto.getGuestPhone())
                .checkinDate(dto.getCheckInDate())
                .checkoutDate(dto.getCheckOutDate())
                .numberOfGuests(dto.getNumberOfGuests())
                .totalPrice(totalPrice)
                .status(Reservation.ReservationStatus.PENDING)
                .specialRequests(dto.getSpecialRequests())
                .build();

        return toDTO(reservationRepository.save(reservation));
    }

    // 예약에 상태 변경
    @Transactional
    public ReservationDTO updateStatus(Long id, Reservation.ReservationStatus status){
        Reservation reservation = reservationRepository.findByIdWithRoom(id)
                .orElseThrow(()->new RuntimeException("예약을 찾을 수 없습니다. ID:"+id));

        reservation.setStatus(status);

        return toDTO(reservationRepository.save(reservation));
    }

    // 예약 취소
    @Transactional
    public void cancelReservation(Long id){
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(()->new RuntimeException("예약을 찾을 수 없습니다. ID:"+id));
        reservation.setStatus(Reservation.ReservationStatus.CANCELLED);

        reservationRepository.save(reservation);
    }

    // 예약 삭제
    @Transactional
    public void deleteReservation(Long id){
        reservationRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("예약을 찾을 수 없습니다. ID:"+id));

        reservationRepository.deleteById(id);
    }


    // 상태별 통계
    public Map<String, Long> getStatusStatistics(){
        return Map.of(
                "PENDING", reservationRepository.countByStatus
                        (Reservation.ReservationStatus.PENDING),
                "CONFIRMED", reservationRepository.countByStatus
                        (Reservation.ReservationStatus.CONFIRMED),
                "CANCELLED", reservationRepository.countByStatus
                        (Reservation.ReservationStatus.CANCELLED),
                "COMPLETED", reservationRepository.countByStatus
                        (Reservation.ReservationStatus.COMPLETED)
        );
    }

    // 예약날짜 검증
    private void validateDates(LocalDate checkIn, LocalDate checkOut){
        if(checkIn == null || checkOut == null){
            throw new RuntimeException("체크인/체크아웃 날짜를 입력해주세요.");
        }

        if(!checkIn.isBefore(checkOut)){//체크아웃이 체크인 이전인가
            throw new RuntimeException("체크아웃 날짜는 체크인 날짜 이후여야 합니다.");
        }

        if(checkIn.isBefore(LocalDate.now())){//체크인이 오늘 이전인가
            throw new RuntimeException("체크인/체크아웃 날짜를 입력해주세요.");
        }
    }

    // Entity->DTO 변환
    // toDTO 메서드를 분리하여 연관된 Room 엔티티의 정보(이름, 타입 등)를
    // DTO에 수동으로 매핑해준 부분은 ModelMapper의 한계를 보완하는 아주 좋은 방법
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
