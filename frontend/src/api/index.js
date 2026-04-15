import axios from 'axios' // http와 통신을 위한 라이브러리(요청처리)

// 요청에 사용할 인스턴스 정의
const api = axios.create({
    baseURL: '/api',
    headers: {'Content-Type': 'application/json'}
})


// 룸 관련 API  : RoomApiController와 관련
export const roomApi = { // 다른 페이지에서 사용할 이름 지정
    // 각 요청 처리
    // 룸 전체 조회 API
    // const 변수선언 ===> {변수} 사용
    getAll : (checkIn, checkOut) => {
        const params = {} // 요청시 전달할 파라미터(인수)

        // checkIn 값이 있으면 파라미터에 checkIn=체크인
        if(checkIn) params.checkIn = checkIn
        if(checkOut) params.checkOut = checkOut

        // 요청(/api/rooms?checkIn=날짜&checkOut=날짜)
        return api.get('/rooms', {params})
    },
    // 룸 개별조회(룸 상세보기)
    //(id) 인수값 ===> ${변수} `백틱사용
    getById :  (id) => api.get(`/rooms/${id}`) //get방식->Controller에서 확인

}
// 예약 관리 API
export const reservationApi = {
    // 예약 생성
    //(data) DTO ===> data 복수변수를 전달시
    create:(data) => api.post('/reservations',data),
    // 내 예약 조회(/api/reservations/my?email=aaa@gmail.com
    getbyReservation : (email) => api.get('/reservations/my', {params:{email}}),
    // 예약취소
    cancel:(id) => api.patch(`/reservations/${id}/cancel`)
}
// 이름 지정시 RestController 의 메소드명과 동일하게 유지 또는 유사하게