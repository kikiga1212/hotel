import {Link} from 'react-router-dom'

// 룸 종류별 색상값
const roomTypeColors = {
    STANDARD: 'secondary',
    DELUXE: 'info',
    SUITE: 'primary',
    PENTHOUSE: 'warning'
}

// 룸 타입의 한글명
const roomTypeLabels = {
    STANDARD: '스탠다드',
    DELUXE: '디럭스',
    SUITE: '스위트',
    PENTHOUSE: '펜트하우스'
}
/**
 * @param {{room: {capacity: number, pricePerNight: number, name: string, roomType: string, description: string}}} props
 */
function RoomCard({room}) {
    console.log("현재 전달된 room 데이터:", room);
    // 전달받은 room타입별 색상, 한글명
    const badgeColor = roomTypeColors[room.roomType] || 'secondary'
    const typeLabel = roomTypeLabels[room.roomType] || room.roomType

    return (
        <div className={"col-md-6 col-lg-4"}>
            <div className={"card h-100 border-0 shadow-sm"}
            style={{borderRadius: '12px', overflow: 'hidden'}}> {/* 둥근모서리, 이미지 카드를 벗어나지 않게 */}
                <div style={{position:'relative', height: '120px', overflow:'hidden'}}>{/* 호텔이미지 */}
                    <img src={room.imageUrl || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'}
                    alt={room.name} style={{width: '100%', height: '100%', objectFit: 'cover'}}
                    onError={(e)=> {
                    e.target.src='https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400'}}/>

                    {/* 룸 타입 배지 */}
                    <span className={`badge bg-${badgeColor} 
                    ${badgeColor === 'info' || badgeColor === 'warning'?'text-dark':''} position-absolute`}
                    style={{top:'12px', left:'12px', fontSize: '0.8rem'}}>
                        {typeLabel}
                    </span>
                </div>
                {/* 카드본문 */}
                <div className={"card-body d-flex flex-column p-3"}>
                    <h5 className={"card-title fw-bold mb-1"}>{room.name}</h5>{/* 룸 이름 */}
                    <p className={"text-muted small mb-2"}>{/* 최대인원수 */}
                        <i className={"bi bi-people me-1"}>최대 {room.capacity} 명</i>
                    </p>
                    <p className={"card-text text-muted small mb-3 flex-grow-1"}
                    style={{display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{/* 룸 설명 */}
                        {room.description}
                    </p>
                    <div className={"d-flex justify-content-between align-items-center mt-auto"}>
                        <div>{/*가격정보 + 상세페이지 이동 */}
                            <span className={"fw-bold text-primary fs-5"}>
                                {Number(room.pricePerNight).toLocaleString()} 원
                            </span>
                            <small className={"text-muted"}> / 1박</small>
                        </div>
                        <Link to={`/rooms/${room.id}`} className={'btn btn-primary btn-sm px-3'}>
                            자세히 보기
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )

}
export default RoomCard