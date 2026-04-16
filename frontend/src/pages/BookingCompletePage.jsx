import {useLocation, Link} from "react-router-dom"; // 현재ㅐ 페이지 정보, 다른페이지 이동


function BookingCompletePage(){
    const {state} = useLocation(); // 이전페이지에서 전달받은 페이지 정보
    const reservation = state?.reservation; // 예약정보가 없으면
    const room = state?.room; // 룸 정보가 없으면

    // http://localhost:5173/booking/complete
    // return 단일행, return `다중행` return (다중행)
    if(!reservation){ // 페이지 이동후 바로 실행, 예약 정보가 없는 경우(예약페이지에서 접근하지 않았을때)
        return(
            <div className={"container py-5 text-center"}>
                <i className={"bi bi-exclamation-circle fs-1 text-warning d-block mb-3"}></i>
                <h4> 예약 정보를 찾을 수 없습니다.</h4>
                <Link to={"/rooms"} className={"btn btn-primary mt-3"}>객실 목록으로</Link>
            </div>
        )
    }
    return (
        <div className={"container py-5"}>
            <div className={"row justify-content-center"}>
                <div className={"col-lg-7"}>
                    <div className={"text-center mb-5"}>
                        <div className={"rounded-circle bg-success bg-opacity-10 d-inline-flex " +
                            "align-items-center justify-content-center mb-3"}
                        style={{width:'80px', height:'80px'}}>
                            <i className={"bi bi-check-lg text-success"} style={{fontSize: '2.5rem'}}></i>
                        </div>
                        <h2 className={"fw-bold mb-5"}>
                            예약이 완료되었습니다.
                        </h2>
                        <p className={"text-muted"}>
                            예약 확인 메일이 <strong>{reservation.guestName}</strong>
                        </p>
                    </div>
                    {/* 예약 상세카드 */}
                    <div className={"card border-0 shadow-sm mb-4"}>
                        <div className={"card-header bg-white p-3 d-flex justify-content-between align-items-center"}>
                            <h5 className={"mb-0 fw-semibold"}>
                                <i className={"bi bi-receipt me-2"}></i> 예약 확인서
                            </h5>
                            <span className={"badge bg-warning text-dark"}>대기중</span>
                        </div>
                        <div className={"card-body"}>
                            <dl className="row mb-0">
                                <dt className={"col-sm-5 text-muted"}>예약 번호</dt>
                                <dd className={"col-sm-7 fw-bold text-primary"}>#{reservation.id}</dd>
                                <dt className={"col-sm-5 text-muted"}>룸</dt>
                                <dd className={"col-sm-7 fw-semibold"}>{reservation.roomName}</dd>
                                <dt className={"col-sm-5 text-muted"}>룸 타입</dt>
                                <dd className={"col-sm-7"}>{reservation.roomType}</dd>
                                <dt className={"col-sm-5 text-muted"}>고객명</dt>
                                <dd className={"col-sm-7"}>{reservation.guestName}</dd>
                                <dt className={"col-sm-5 text-muted"}>연락처</dt>
                                <dd className={"col-sm-7"}>{reservation.guestPhone}</dd>
                                <dt className={"col-sm-5 text-muted"}>이메일</dt>
                                <dd className={"col-sm-7"}>{reservation.guestEmail}</dd>
                                <dt className={"col-sm-5 text-muted"}>체크인</dt>
                                <dd className={"col-sm-7 fw-semibold"}>{reservation.checkInDate}</dd>
                                <dt className={"col-sm-5 text-muted"}>체크아웃</dt>
                                <dd className={"col-sm-7 fw-semibold"}>{reservation.checkOutDate}</dd>
                                <dt className={"col-sm-5 text-muted"}>투숙 인원</dt>
                                <dd className={"col-sm-7"}>{reservation.numberOfGuests}</dd>
                                {reservation.specialRequests && (
                                    <>
                                        <dt className={"col-sm-5 text-muted"}> 요구사항</dt>
                                        <dd class={col-sm-7}>{reservation.specialRequests}</dd>
                                    </>
                                    )}
                                <dt className={"col-sm-5 text-muted border-top p5-2 mt-2"}>총 결제금액</dt>
                                <dd className={"col-sm-7 fw-bold text-primary fs-5 border-top pt-2 mt-2"}>
                                    {Number(reservation.totalPrice).toLocaleString()} 원
                                </dd>
                            </dl>
                        </div>
                    </div>
                    <div className={"alert alert-info"}>
                        <i className={"bi bi-info-circle me-2"}></i>
                         예약 상태가 <strong> 대기중 </strong>으로 등록되었습니다.
                         관리자 확인후 <strong> 확정 </strong> 으로 변경됩니다.
                    </div>
                    <div className={"d-flex gap-3"}>
                        <Link to={"/rooms"} className={"btn btn-outline-secondary flex-fill"}>
                            <i className={"bi bi-door-open me-1"}></i> 객실 목록
                        </Link>
                        <Link to={"/my-reservations"} className={"btn btn-outline-secondary flex-fill"}>
                            <i className={"bi bi-calendar-check me-1"}></i> 내 예약 확인
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default BookingCompletePage
