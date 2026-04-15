//참조
import {useState, useEffect} from "react";
import {useParams, Link} from "react-router-dom";
import {roomApi} from "../api/index.js";

//공용변수(상수)
const roomTypeLabels = {
    STANDARD: '스탠다드',
    DELUXE: '디럭스',
    SUITE: '스위트',
    PENTHOUSE: '펜트하우스',
}

function RoomDetailPage() {
//변수
    const {id} = useParams() //파라미터로 전달받은 값 ,스프링 부트의 @PathVariable과 짝꿍
    const [room, setRoom] = useState(null) //룸정보
    const [loading, setLoading] = useState(true) //조회처리
    const [error, setError] = useState(null)

//동작처리
    //로딩 처리
    useEffect(()=>{
        const fetchRoom = async() => {
            try {
                const res = await roomApi.getById(id)
                setRoom(res.data)
            } catch {
                setError('룸 정보를 불러오지 못했습니다.')
            } finally {
                setLoading(false)
            }
        }
        fetchRoom()
    }, [id])

    //로딩 UI
    if(loading) return (
        <div className={"text-center py-5 mt-5"}>
            <div className={"spinner-border text-primary"} role={"status"}></div>
        </div>
    )

    //오류 UI
    if(error) return (
        <div className={"container py-5"}>
            <div className={"alert alert-danger text-center"}>
                {error}
            </div>
        </div>
    )

    //데이터가 없을 경우
    if(!room) return null

    //렌더링(정상적으로 룸 정보를 읽어왔을 때)
    return(
         <div className={"container py-5"}>
             {/*네비게이션*/}
             <nav aria-label={"breadcrumb"} className={"mb-4"}>
                 <ol className={"breadcrumb"}>
                     <li className={"breadcrumb-item"}>
                         <Link to={"/rooms"}>객실 목록</Link>
                     </li>
                     <li className={"breadcrumb-item active"}>
                         {room.name}
                     </li>
                 </ol>
             </nav>
             <div className={"row g-5"}>
                 {/*룸이미지*/}
                 <div className={"col-lg-7"}>
                     <img src={room.imageUrl ||
                         'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'}
                     alt={room.name} className={"w-100 rounded-3 shadow"}
                     style={{height: '420px', objectFit: 'cover'}}
                     onError={(e)=>{e.target.src='https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'}}/>
                 </div>
                 {/*룸정보*/}
                 <div className={"col-lg-5"}>
                     <span className={"badge bg-primary mb-2"}>
                         {roomTypeLabels[room.roomType] || room.roomType}
                     </span>
                     <h2 className={"fw-bold mb-2"}>{room.name}</h2>
                     <p className={"text-muted mb-4"}>{room.description}</p>
                     {/*세부정보*/}
                     <div className={"card border-0 bg-light rounded-3 p-3 mb-4"}>
                         <div className={"row text-center g-3"}>
                             <div className={"col-6"}>
                                 <i className={"bi bi-people fs-4 text-primary d-block mb-1"}></i>
                                 <div className={"fw-semibold"}>
                                     최대 {room.capacity}명
                                 </div>
                                 <small className={"text-muted"}>수용인원</small>
                             </div>
                             <div className={"col-6"}>
                                 <i className={"bi bi-wifi fs-4 text-primary d-block mb-1"}></i>
                                 <div className={"fw-semibold"}>
                                     무료 Wi-Fi
                                 </div>
                                 <small className={"text-muted"}>기본 제공</small>
                             </div>
                             <div className={"col-6"}>
                                 <i className={"bi bi-tv fs-4 text-primary d-block mb-1"}></i>
                                 <div className={"fw-semibold"}>
                                     평면 TV
                                 </div>
                                 <small className={"text-muted"}>기본 제공</small>
                             </div>
                             <div className={"col-6"}>
                                 <i className={"bi bi-cup-hot fs-4 text-primary d-block mb-1"}></i>
                                 <div className={"fw-semibold"}>
                                     미니바
                                 </div>
                                 <small className={"text-muted"}>기본 제공</small>
                             </div>
                             <div className={"col-6"}>
                                 <i className={"bi bi-door-closed fs-4 text-primary d-block mb-1"}></i>
                                 <div className={"fw-semibold"}>
                                     {room.roomSize} m²
                                 </div>
                                 <small className={"text-muted"}>객실 크기</small>
                             </div>

                         </div>
                     </div>
                     {/*가격정보*/}
                     <div className={"border-top pt-3 mb-4"}>
                         <span className={"fs-2 fw-bold text-primary"}>
                             {Number(room.pricePerNight).toLocaleString()}원
                         </span>
                         <span className={"text-muted"}> / 1박</span>
                     </div>
                     {/*예약버튼*/}
                     {room.available?(
                         <Link to={`/booking/${room.id}`}
                         className={"btn btn-primary btn-lg w-100"}>
                             <i className={"bi bi-calendar-check me-2"}></i>
                             지금 예약하기
                         </Link>
                     ):(
                         <button className={"btn btn-secondary btn-lg w-100"} disabled>
                             <i className={"bi bi-x-circle me-2"}></i>현재 예약 불가
                         </button>
                     )}
                 </div>

             </div>
         </div>
    )
}

export default RoomDetailPage

//지금 작성하신 코드에서 가장 중요한 부분은 const {id} = useParams()입니다. 스프링 부트의 @PathVariable과 짝꿍이라고 생각하시면 됩니다.
//
// 리액트 (App.jsx): <Route path="/rooms/:id" ... /> 로 "여기에 변수가 올 거야"라고 선언합니다.
//
// 리액트 (RoomDetailPage): useParams()가 주소창의 :id 자리에 있는 값을 쏙 뽑아냅니다.
//
// 스프링 부트 (Controller): @GetMapping("/rooms/{id}")를 통해 리액트가 보낸 ID를 받아서 DB에서 해당 방만 찾아줍니다.