package com.example.hotel.Repository;

import com.example.hotel.Entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // 지정한 룸의 예약 목록 조회
    List<Reservation> findByRoomId(Long roomId);
    // 이메일로 예약조회
    List<Reservation> findByGuestEmail(String guestEmail);
    // 예약상태별 조회
    List<Reservation> findByStatus(Reservation.ReservationStatus status);

    // 모든 예약과 룸 조회(최신순 정렬)===> JOIN FETCH r.room
    // 이유: 일반 JOIN만 쓰면 예약 목록을 가져온 뒤 각 예약의 방 정보를 조회할 때마다 추가 쿼리가 발생하는 N+1 문제가 생기는데,
    // FETCH JOIN으로 한 번에 가져오도록 설계하여 성능을 최적화하셨습니다.
    @Query(
            "SELECT r FROM Reservation r JOIN FETCH r.room ORDER BY r.createdAt DESC "
    )
    List<Reservation> findAllWithRoom();

    //하나아의 예약과 룸 조회
    @Query(
            "SELECT r FROM Reservation r JOIN FETCH r.room WHERE r.id = :id "
    )
    Optional<Reservation> findByIdWithRoom(Long id);

    // 상태별로 예약 갯수 조회
    @Query(
            "SELECT count(r) FROM Reservation r WHERE r.status = :status "
    )
    long countByStatus(Reservation.ReservationStatus status);

}
