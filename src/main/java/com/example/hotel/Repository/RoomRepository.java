package com.example.hotel.Repository;

import com.example.hotel.Entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    // 사용가능한 룸만 조회
    // 사용가능 여부가 true인 값만 조회
    List<Room> findByAvailableTrue();
    // 룸 타입별 조회
    List<Room> findByRoomType(Room.RoomType roomType);

    // 날짜기준 예약이 가능한 룸 조회
    @Query(
            "SELECT r FROM Room r WHERE r.available = true and r.id NOT IN "+
            "(SELECT res.room.id FROM Reservation  res WHERE res.status != 'CANCELLED' "+
            "AND res.checkinDate < :checkOut And res.checkoutDate > :checkIn)")
    List<Room> findAvailableRooms(LocalDate checkIn, LocalDate checkOut);

    // 1. 해달움에 예약이 취소가 아니고, 지정날짜에 포함되자 않은(NOT IN) 예약정보를 읽어서 (예약되지 않은 데이터)
    // 2. 사용가능한 룸을 조회합니다.

}
