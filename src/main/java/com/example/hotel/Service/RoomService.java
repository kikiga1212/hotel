package com.example.hotel.Service;

import com.example.hotel.DTO.RoomDTO;
import com.example.hotel.Entity.Room;
import com.example.hotel.Repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomService {
    private final RoomRepository roomRepository;
    private final ModelMapper modelMapper;

    // 전체 룸 조회
    public List<RoomDTO> getAllRooms(){
        // 모든 데이터를 일거어 반복처리(stream) 해서 room에 개별전달해서 DTO로 변환후 List 에 저장
        return roomRepository.findAll().stream()
                .map(room->modelMapper.map(room, RoomDTO.class))
                .collect(Collectors.toList());
    }

    // 사용 가능한 룸만 조회
    public List<RoomDTO> getAvailableRooms(){
        return roomRepository.findByAvailableTrue().stream()
                .map(room->modelMapper.map(room, RoomDTO.class))
                .collect(Collectors.toList());
    }

    // 날짜기준으로 예약가능한 룸을 조회
    // 룸 가용성 조회 (getAvailableRoomsForDates)
    // 나중에 프론트엔드에서 "날짜 검색 시 빈 방만 보여주기" 기능을 구현할 때 핵심적인 역할을 할 것입니다.
    public List<RoomDTO> getAvailableRoomsForDates(LocalDate checkIn, LocalDate checkout){
        return roomRepository.findAvailableRooms(checkIn, checkout).stream()
                .map(room->modelMapper.map(room, RoomDTO.class))
                .collect(Collectors.toList());
    }

    // 해당 룸 조회
    public RoomDTO getRoomById(Long id){
        Room room = roomRepository.findById(id)
                .orElseThrow(()->new RuntimeException("해당 룸이 존재하지 않습니다. ID:"+id));
        return modelMapper.map(room, RoomDTO.class);
    }

    // 룸 생성
    @Transactional // 쓰기용으로 전환
    public RoomDTO createRoom(RoomDTO roomDTO){
        Room room = modelMapper.map(roomDTO, Room.class); // Entity로 변환

        if(room.getAvailable() == null ){
            room.setAvailable(true); // 사용가능으로 기본값으로 저장
        }

        Room savedRoom = roomRepository.save(room); // 저장
        return modelMapper.map(savedRoom, RoomDTO.class); // 결과전달
    }

    // 룸 수정
    @Transactional
    public RoomDTO updatedRoom(Long id, RoomDTO roomDTO){ // 수정대상, 수정할 내용
        Room room = roomRepository.findById(id)
                .orElseThrow(()->new RuntimeException("룸을 찾을 수 없습니다. ID:"+id));

        modelMapper.map(roomDTO, room); //  수정할 내용을 읽어온 Entity에 적용
        // modelMapper.map(roomDTO, room);을 사용하여 엔티티를 업데이트
        // 이 방식은 ModelMapperConfig에서 설정하신 setSkipNullEnabled(true) 덕분에 아주 안전하게 작동
        room.setId(id); // 지워질 것을 대비(오류)에서 기본키를 유지

        Room updatedRoom = roomRepository.save(room); // 저장(수정)

        return modelMapper.map(updatedRoom, RoomDTO.class);
    }

    // 룸 삭제
    @Transactional
    public void deleteRoom(Long id){
        roomRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("룸을 찾을 수 없습니다. ID:"+id));

        roomRepository.deleteById(id);
    }

    // 영속성 컨텍스트의 변경 감지 활용
    // 룸 상태여부 토글(true<->false)
    @Transactional
    public RoomDTO toggleAvailablity(Long id){
        Room room = roomRepository.findById(id)
                .orElseThrow(()->new RuntimeException("룸을 찾을 수 없습니다. ID:"+id));
        room.setAvailable(!room.getAvailable()); // 기존값을 반대로 변환
        return modelMapper.map(roomRepository.save(room), RoomDTO.class);
    }
}
