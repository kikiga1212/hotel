package com.example.hotel.Controller;

import com.example.hotel.DTO.RoomDTO;
import com.example.hotel.Entity.Reservation;
import com.example.hotel.Entity.Room;
import com.example.hotel.Service.ReservationService;
import com.example.hotel.Service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Map;

@Controller
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
    private final RoomService roomService;
    private final ReservationService reservationService;

    // 관리자 대시보드
    @GetMapping({"","/"})
    public String dashboard(Model model){
        model.addAttribute("currentPage", "dashboard");//현재 위치
        model.addAttribute("pageTitle","대시보드"); //페이지 제목
        model.addAttribute("totalRooms", roomService.getAllRooms().size()); //전체 룸 갯수
        model.addAttribute("availableRooms", roomService.getAvailableRooms().size()); // 이용가능 룸 갯ㅅ수

        Map<String, Long> stats = reservationService.getStatusStatistics(); // 예약상태 통계
        model.addAttribute("pendingCount", stats.get("PENDING")); //대기갯수
        model.addAttribute("confirmedCount", stats.get("CONFIRMED")); //확정갯수
        model.addAttribute("cancelledCount", stats.get("CANCELLED")); //취소갯수
        model.addAttribute("completedCount", stats.get("COMPLETED")); //완료갯수

        model.addAttribute("recentReservations", reservationService.getAllReservations()); //최신 예약 목록

        return "admin/dashboard";
    }

    // 룸 관리(목록, 생성폼, 생성요청, 수정폼, 수정요청, 룸 사용 토글, 룸삭제)
    // 룸 목록
    @GetMapping("/rooms")
    public String roomList(Model model){
        model.addAttribute("currentPage", "rooms");
        model.addAttribute("pageTitle", "룸 관리");
        model.addAttribute("rooms", roomService.getAllRooms());
        return "admin/room-list";
    }

    // 룸 생성 폼
    @GetMapping("/rooms/new")
    public String roomCreateForm(Model model){
        model.addAttribute("currentPage", "rooms");
        model.addAttribute("pageTitle", "룸 등록");
        model.addAttribute("roomDto", new RoomDTO()); // 검증을 위한 빈 DTO전달
        model.addAttribute("roomTypes", Room.RoomType.values());
        return "admin/room-form";
    }

    // 룸 생성 처리
    @PostMapping("/rooms")
    public String createRoom(@Valid @ModelAttribute("roomDto") RoomDTO roomDTO,
    BindingResult result, Model model, RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) { // 검증 실패시
            model.addAttribute("currentPage", "rooms");
            model.addAttribute("pageTitle", "룸 등록");
            model.addAttribute("roomTypes", Room.RoomType.values());
            return "admin/room-form";
        }
        // redirectAttributes.addFlashAttribute 는 다른 맵핑(요청)으로 이동시 값을 가지고 이동
        try {
            roomService.createRoom(roomDTO);
            redirectAttributes.addFlashAttribute("successMessage",
                    "새로운 룸을 등록하였습니다.");
        } catch (Exception e) {
            redirectAttributes.addAttribute("errorMessage", e.getMessage());
        }
        return "redirect:/admin/rooms";
    }

    // 룸 수정폼
    @GetMapping("/rooms/{id}/edit")
    public String roomEditForm(@PathVariable Long id, Model model){
        model.addAttribute("currentPage", "rooms");
        model.addAttribute("pageTitle", "룸 수정");
        model.addAttribute("roomDto", roomService.getRoomById(id)); // 검증을 위한 빈 DTO전달
        model.addAttribute("roomTypes", Room.RoomType.values());
        return "admin/room-form";
    }

    // 룸 수정 처리
    @PostMapping("/rooms/{id}")
    public String updateRoom(@PathVariable Long id, @Valid @ModelAttribute("roomDto") RoomDTO roomDTO,
                             BindingResult result, Model model, RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) { // 검증 실패시
            model.addAttribute("currentPage", "rooms");
            model.addAttribute("pageTitle", "룸 수정");
            model.addAttribute("roomTypes", Room.RoomType.values());
            return "admin/room-form";
        }
        // redirectAttributes.addFlashAttribute 는 다른 맵핑(요청)으로 이동시 값을 가지고 이동
        try {
            roomService.updatedRoom(id, roomDTO);
            redirectAttributes.addFlashAttribute("successMessage",
                    "룸을 수정하였습니다.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }
        return "redirect:/admin/rooms";
    }

    // 룸 활성/비활성 토글
    @PostMapping("/rooms/{id}/toggle")
    public String toggleAvailability(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        // redirectAttributes.addFlashAttribute 는 다른 맵핑(요청)으로 이동시 값을 가지고 이동
        try {
            RoomDTO room = roomService.toggleAvailablity(id);
            String status = room.getAvailable() ? "활성화" : "비활성화";
            redirectAttributes.addFlashAttribute("successMessage",
                    "룸이 "+status+"되었습니다.");
        } catch (Exception e) {
            redirectAttributes.addAttribute("errorMessage", e.getMessage());
        }
        return "redirect:/admin/rooms";
    }

    // 룸 삭제
    @PostMapping("/rooms/{id}/delete")
    public String deleteRoom(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        // redirectAttributes.addFlashAttribute 는 다른 맵핑(요청)으로 이동시 값을 가지고 이동
        try {
            roomService.deleteRoom(id);
            redirectAttributes.addFlashAttribute("successMessage",
                    "룸이 삭제되었습니다.");
        } catch (Exception e) {
            redirectAttributes.addAttribute("errorMessage", e.getMessage());
        }
        return "redirect:/admin/rooms";
    }

    // 예약 관리
    // 예약 목록
    @GetMapping("/reservations")
    public String reservationList(Model model, @RequestParam(required = false) String status){
        model.addAttribute("currentPage", "reservations");
        model.addAttribute("pageTitle", "예약 관리");

        if(status != null && !status.isEmpty()){//비교 순서 중요, 빈값 처리
            try{ // 상태에 해당하는 예약정보만 조회
                Reservation.ReservationStatus reservationStatus = Reservation.ReservationStatus.valueOf(status);
                model.addAttribute("reservations", reservationService.getAllReservations().stream()
                        .filter(r->r.getStatus() == reservationStatus)
                        .toList());
            } catch (IllegalArgumentException e) { // 오류 발생시 모든 예약정보를 읽어온다.
                model.addAttribute("reservations", reservationService.getAllReservations());
            }
        }else {// 상태값이 없으면 모든 예약정보를 읽어온다.
            model.addAttribute("reservations", reservationService.getAllReservations());
        }
        //열거형 값을 저장
        model.addAttribute("statuses", Reservation.ReservationStatus.values());
        return "admin/reservation-list";
        }

    // 예약 상세
    @GetMapping("/reservations/{id}")
    public String reservationDetail(@PathVariable Long id, Model model){
        model.addAttribute("currentPage", "reservations");
        model.addAttribute("pageTitle", "예약 상세");
        model.addAttribute("reservation", reservationService.getReservationById(id)); // 검증을 위한 빈 DTO전달
        model.addAttribute("statuses", Reservation.ReservationStatus.values());
        return "admin/reservation-detail";
    }

    // 예약 상태 변경
    @PostMapping("/reservations/{id}/status")
    public String updateStatus(@PathVariable Long id, @RequestParam String status,
                               RedirectAttributes redirectAttributes) {

        try {
            Reservation.ReservationStatus newStatus =
                    Reservation.ReservationStatus.valueOf(status);
            reservationService.updateStatus(id, newStatus);
            redirectAttributes.addFlashAttribute("successMessage",
                    "예약 상태가 변경되었습니다.");
        } catch(Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage",
                    e.getMessage());
        }
        return "redirect:/admin/reservations/"+id;
    }
    // 예약 삭제
    @PostMapping("/reservations/{id}/delete")
    public String deleteReservations(@PathVariable Long id,
                                     RedirectAttributes redirectAttributes) {

        try {
            reservationService.deleteReservation(id);

            redirectAttributes.addFlashAttribute("successMessage",
                    "예약이 삭제되었습니다.");
        } catch(Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage",
                    e.getMessage());
        }
        return "redirect:/admin/reservations";
    }
}

