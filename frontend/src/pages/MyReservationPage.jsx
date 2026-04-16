import {useState} from "react";
import {reservationApi} from "../api/index.js";

// 배지(상태) 색상
const STATUS_BADGE = {
    PENDING: "warning",
    CONFIRMED: "success",
    CANCELED: "danger",
    COMPLETED: "secondary",
}

const STATUS_TEXT = {
    PENDING: "대기",
    CONFIRMED: "확정",
    CANCELED: "취소",
    COMPLETED: "완료",
}
function MyReservationPage(){
    const [email, setEmail] = useState(""); // 이메일
    const [reservations, setReservations] = useState([]); // 예약정보
    const [searched, setSearched] = useState(false); // 검색상태
    const [loading, setLoading] = useState(false); // 조회상태
    const [error, setError] = useState(null); // 오류메시지
    const [cancellingId, setCancellingId] = useState(null); // 예약 취소

    // 이메일을 이용해서 조회처리
    const handleSearch = async (e) => {
        e.preventDefault(); // 폼전달 방지

        if(!email.trim()) return // 입력한 이메일이 없으면

        setLoading(true);
        setError(null);

        try{ // 요청+success
            // 요청(API)
            const res = await reservationApi.getMyReservations(email.trim())

            setReservations(res.data)
            setSearched(true);
        }catch(err) { // error
            console.error("상세 에러 내용:", err.response || err);
            setError("예약 정보를 불러오지 못했습니다.")
        }finally {
            setLoading(false);
        }
    }
    // 예약 취소 처리
    const handleCancel = async (id) => {
        if(!window.confirm('예약을 취소하시겠습니까?')) return // 아니오를 선택하면 중단

        setCancellingId(id)

        try{
            await reservationApi.cancel(id)

            setReservations(prev =>
                prev.map(r =>
                    r.id == id ? {...r, status:'CANCELLED', statusDisplayName: '취소'} : r)
            )
        }catch {
            alert('취소 처리 중 오류가 발생했습니다.')
        }finally {
            setCancellingId(null)
        }
    }

    return(
        <div className={"container py-5"}>
            {/* 페이지 제목 */}
            <h2 className={"fw-bold mb-2"}>
                <i className={"bi bi-calendar-check me-2 text-primary"}></i> 내 예약 확인
            </h2>
            <p className={"text-muted mb-4"}>
                예약시 입력하신 이메일 주소로 예약 내용을 조회하세요.
            </p>

            {/* 이메일 검색폼*/}
            <div className={"card board-0 shadow-sm mb-4"}>
                <div className={"card-body p-4"}>
                    <form onSubmit={handleSearch}>
                        <div className={"row g-3 align-items-end"}>
                            <div className={"col-md-8"}>
                                <label className={"form-label fw-semibold"}>
                                    이메일 주소
                                </label>
                                <input type={"email"} className={"form-control form-control-lg"}
                                value={email} onChange={e => setEmail(e.target.value)}
                                placeholder={"예약시 입력하신 이메일을 입력하세요."} required/>
                            </div>
                            {/* 조회 버튼 */}
                            <div className={"col-md-4"}>
                                <button type={"submit"} className={"btn btn-primary btn-lg w-100"} disabled={loading}>
                                    {loading?(
                                        <>
                                            <span></span> 조회중...
                                        </>
                                    ) : (
                                        <>
                                            <i className={"bi bi-search me-2"}></i> 예약 조회
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {/* 오류메시지*/}
            { error && (
                <div className={"alert alert-danger"}>
                    <i className={"bi bi-exclamation-circle me-2"}></i> {error}
                </div>
            )}
            {/* 결과 정보*/}
            {searched && !loading && (
                <>
                    {reservations.length === 0 ? (
                        <div className={"text-center py-5 text-muted"}>
                            <i className={"bi bi-inbox fs-1 d-block mb-3"}></i>
                            <h5> 해당 이메일로 등록된 예약이 없습니다.</h5>
                            <p className={"small"}>
                                예약시 입력하신 이메일 주소를 다시 확인해 주세요.
                            </p>
                        </div>
                        ) : (
                        <>
                            <p className={"text-muted mb-3"}>
                                <strong>{email}</strong> 으로 총{" "}
                                <strong>{reservations.length} 건 </strong> 의 예약이 있습니다.
                            </p>
                            <div className={"row g-4"}>
                                {/* 예약한 내용들을 반복 출력 */}
                                {reservations.map(res =>(
                                    <div key={res.id} className={"col-12"}>
                                        <div className={"card border-0 shadow-sm"}>
                                            <div className={"card-body p-4"}>
                                                <div className={"row align-items-center"}>{/* 예약 정보 */}
                                                    <div className={"col-md-8"}>
                                                        <div className={"d-flex align-items-center gap-3 mb-2"}>
                                                            <h5 className={"fw-bold mb-0"}>{res.roomName}</h5>
                                                            <span className={"badge bg-secondary"}>  {res.roomType}</span>
                                                            <span className={`badge bg-${STATUS_BADGE[res.status] || 'secondary'}
                                                             ${res.status ==='PENDING' ? 'text-dark' : ''}`}>
                                                                {STATUS_TEXT[res.status] || res.statusDisplayName}
                                                            </span>
                                                        </div>
                                                        {/* 세부정보 */}
                                                        <div className={"row g-2 text-muted small"}>
                                                            <div className={"col-sm-6"}>
                                                                <i className={"bi bi-hash me-1"}></i> 예약번호 :
                                                                <strong>#{res.id}</strong>
                                                            </div>
                                                            <div className={"col-sm-6"}>
                                                                <i className={"bi bi-people me-1"}></i> 투숙인원 :
                                                                <strong>#{res.numberOfGuests}</strong>
                                                            </div>
                                                            <div className={"col-sm-6"}>
                                                                <i className={"bi bi-calendar-event me-1"}></i> 체크인 :
                                                                <strong>#{res.checkInDate}</strong>
                                                            </div>
                                                            <div className={"col-sm-6"}>
                                                                <i className={"bi bi-calendar-event me-1"}></i> 체크아웃 :
                                                                <strong>#{res.checkOutDate}</strong>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* 결재 금액, 예약 취소 */}
                                                    <div className={"col-md-4 text-md-end mt-3 mt-md-0"}>
                                                        <div className={"fw-bold text-primary fs-5 mb-2"}>
                                                            {Number(res.totalPrice).toLocaleString()} 원
                                                        </div>
                                                        {(res.status === 'PENDING' || res.status === 'CONFIRMED') && (
                                                            <button className={"btn btn-outline-danger btn-sm"}
                                                            onClick={() => handleCancel(res.id)}
                                                            disabled={cancellingId === res.id}>
                                                                {cancellingId == res.id ?(
                                                                    <>
                                                                        <span className={"spinner-border spinner-border-sm me-1"}></span> 처리중...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i className={"bi bi-x-circle me-1"}></i> 예약 취소
                                                                    </>
                                                                )}
                                                            </button>
                                                        )}
                                                        {/* 상태 메시지 */}
                                                        {res.status === 'CANCELLED' && (
                                                            <span className={"text-muted small"}>
                                                                        <i className={"bi bi-x-circle me-1"}></i> 취소된 예약입니다.
                                                                    </span>
                                                        )}
                                                        {res.status === 'COMPLETED' && (
                                                            <span className={"text-muted small"}>
                                                                        <i className={"bi bi-check-circle me-1"}></i> 이용 완료
                                                                    </span>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* 요청 사항 */}
                                                {res.specialRequests && (
                                                    <div className={"mt-3 pt-3 border-top"}>
                                                        <small className={"text-muted"}>
                                                            <i className={"bi bi-chat-left-text me-1"}></i> 요청 사항 : {res.specialRequests}
                                                        </small>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                                }
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    )
}


export default MyReservationPage