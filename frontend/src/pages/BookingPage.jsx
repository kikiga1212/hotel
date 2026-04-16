import {useState, useEffect} from "react";
import {useParams, useNavigate, Link} from "react-router-dom";
import {roomApi, reservationApi} from "../api/index.js";

function BookingPage(){
    const {roomId} = useParams(); // 파리미터
    const navigate = useNavigate(); // 페이지 이동
    const today = new Date().toISOString().split("T")[0]; // 시간은 빼고 날짜만 가져옴

    const [room, setRoom] = useState(null); // 선택한 룸 정보
    const [loading, setLoading] = useState(true); // 요청
    const [submitting, setSubmitting] = useState(false); // 예약
    const [error, setError] = useState({}); // 검증 오류

    // form 데이터
    const [form, setForm] = useState({
        guestName: "",
        guestEmail: "",
        guestPhone: "",
        checkInDate: "",
        checkOutDate: "",
        numberOfGuests: 1,
        specialRequests: ""
    });

    // 룸 데이터 불러오기
    useEffect(() => {
        const fetchRoom = async () => {
            try{
                const res = await  roomApi.getById(roomId);
                setRoom(res.data);
            }catch{
                alert('룸 정보를 불러오지 못했습니다.')
                navigate('/rooms')
            }finally {
                setLoading(false);
            }
        }
        fetchRoom();
    }, [roomId, navigate]);

    // 숙박일 계산
    const calcNights = ()=> {
        if (!form.checkInDate || !form.checkOutDate) return 0
        const diff = new Date(form.checkOutDate) - new Date(form.checkInDate);

        return Math.max(0, Math.floor(diff / 86400000))
    }
    // 총 금액 계산
    const calcTotal = () =>{
        const nights = calcNights()
        return nights > 0 && room ? nights*Number(room.pricePerNight) : 0
    }

    // input에 내용이 변경되면 재저장
    const handleChange = (e) => {
        const {name, value} = e.target
        setForm(prev => ({...prev, [name]:value}))

        // 이름 변경후 오류메시지 초기화
        if(error[name]){
            setError(prev =>({...prev, [name] : ''}))
        }
    }

    // springboot : html -> 요청 -> DTO 검증 -> controller -> 오류메시지
    // react : jsx -> 검증 -> 요청 -> restController 처리
    // 유효서검사
    const validate = () => {
        const newErrors = {}

        if (!form.guestName.trim())  // 이름이 없으면
            newErrors.guestName = '이름을 입력해 주세요.'
        if (!form.guestEmail.trim()) // 이메일이 없으면
            newErrors.guestEmail = '이메일을 입력해 주세요.'
        else if (!/\S+@\S+\.\S+/.test(form.guestEmail)) // 문자열@문자열.문자열
            newErrors.guestEmail = "올바른 이메일 형식으로 입력해 주세요."
        if (!form.guestPhone.trim())
            newErrors.guestPhone = '연락처를 입력해 주세요.'
        if (!form.checkInDate) //
            newErrors.checkInDate = "체크인 날짜를 선택해 주세요."
        if (!form.checkOutDate) //
            newErrors.checkOutDate = "체크아웃 날짜를 선택해 주세요."
        if (form.checkOutDate && form.checkOutDate && form.checkInDate >= form.checkOutDate)
            newErrors.checkOutDate = "체크아웃 날짜는 체크인 날짜이후여야 합니다."
        if (!form.numberOfGuests || form.numberOfGuests < 1)
            newErrors.numberOfGuests = '투숙 인원을 입력해 주세요.'
        if (room && form.numberOfGuests > room.capacity)
            newErrors.numberOfGuests = `최대 ${room.capacity} 명까지 투숙 가능합니다.`
        return newErrors;
    }

    // 예약 제출
    const handleSubmit = async (e) => {
        e.preventDefault()

        const validationErrors = validate(); // 전송전 form 내용 검증

        if(Object.keys(validationErrors).length > 0){ // 오류메시지가 저장되어 있다면
            setError(validationErrors)
            return
        }
        setSubmitting(true);

        try{ // 요청
            const res = await  reservationApi.create({
                ...form,
                roomId: Number(roomId),
                numberOfGuests: Number(form.numberOfGuests)
            })
            navigate('/booking/complete',{
                state : {reservation: res.data, room: room}
            })
        }catch(err){
            const msg = err.response?.data || '예약에 실패했습니다. 다시 시도해 주세요.'
            alert(msg)
        }finally {
            setSubmitting(false);
        }
    }

    // 로딩 UI
    if(loading) return(
        <div className={"text-center py-5 mt-5"}>
            <div className={"spinner-border text-primary"}></div>
        </div>
    )

    const night = calcNights()
    const total = calcTotal()

    // UI 렌더링

    // return (
    //     <div className={"container py-5"}>
    //         <nav aria-label={"breadcrumb"} className={"mb-4"}>
    //             <ol className={"breadcrumb"}>
    //                 <li className={"breadcrumb-item"}>
    //                     <Link to={"/rooms"}>객실 목록</Link>
    //                 </li>
    //                 {/* th:if th:unless => 값 && 태그  값 || 태그 */}
    //                 {/* && 앞에 값이 맞으면 뒤에 태그를 출력 */}
    //                 {/* || 앞에 값과 뒤에 태그를 함께 출력 */}
    //                 {
    //                     room && (
    //                         <li className={"breadcrumb-item"}>
    //                             <Link to={`/rooms/${roomId}`}>
    //                                 {room.name}
    //                             </Link>
    //                         </li>
    //                     )
    //                 }
    //                 <li className={"breadcrumb-item active"}>
    //                     예약하기
    //                 </li>
    //             </ol>
    //         </nav>
    //         {/* 예약 폼*/}
    //         <div className={"row g-5"}>
    //             <div className={"col-lg-8"}>
    //
    //             </div>
    //             <div className={"col-lg-4"}>
    //                 <h2 className={"fw-bold mb-4"}>
    //                     <i className={"bi bi-calendar-check me-2 text-primary"}></i> 예약 정보 입력
    //                 </h2>
    //                 <form onSubmit={handleSubmit} noValidate>
    //                     {/* 고객 정보 */}
    //                     <div className={"card border-0 shadow-sm mb-4"}>
    //                         <div className={"card-header bg-white py-3"}>
    //                             <h5 className={"mb-0 fw-semibold"}>
    //                                 <i className={"bi bi-person me-2"}></i> 고객 정보
    //                             </h5>
    //                         </div>
    //                         <div className={"card-body"}>
    //                             <div className={"row g-3"}>
    //                                 <div className={"col-md-6"}>
    //                                     <label className={"form-label fw-semibold"}>이름 *</label>
    //                                     <input type={"text"} name={"guestName"}
    //                                     className={`form-control ${error.guestName? 'is-invalid' : ''}`}
    //                                     value={form.guestName} onChange={handleChange} placeholder={"홍길동"}/>
    //                                     {/* 오류메시지에 guestName이 존재하면 */}
    //                                     {error.guestName && (
    //                                         <div className={"invalid-feedback"}>
    //                                             {error.guestName}
    //                                         </div>
    //                                     )}
    //                                 </div>
    //                                 <div className={"col-md-6"}>
    //                                     <label className={"form-label fw-semibold"}>연락처 *</label>
    //                                     <input type={"tel"} name={"guestPhone"}
    //                                            className={`form-control ${error.guestPhone? 'is-invalid' : ''}`}
    //                                            value={form.guestPhone} onChange={handleChange} placeholder={"010-1234-5678"}/>
    //                                     {/* 오류메시지에 guestName이 존재하면 */}
    //                                     {error.guestPhone && (
    //                                         <div className={"invalid-feedback"}>
    //                                             {error.guestPhone}
    //                                         </div>
    //                                     )}
    //                                 </div>
    //                                 <div className={"col-md-6"}>
    //                                     <label className={"form-label fw-semibold"}>이메일 *</label>
    //                                     <input type={"email"} name={"guestEmail"}
    //                                            className={`form-control ${error.guestEmail? 'is-invalid' : ''}`}
    //                                            value={form.guestEmail} onChange={handleChange} placeholder={"aaa@example.com"}/>
    //                                     {/* 오류메시지에 guestName이 존재하면 */}
    //                                     {error.guestEmail && (
    //                                         <div className={"invalid-feedback"}>
    //                                             {error.guestEmail}
    //                                         </div>
    //                                     )}
    //                                 </div>
    //                                 <div className={"col-md-6"}>
    //                                     <label className={"form-label fw-semibold"}>최대인원 *</label>
    //                                     <input type={"number"} name={"numberOfGuests"}
    //                                            className={`form-control ${error.numberOfGuests? 'is-invalid' : ''}`}
    //                                            value={form.numberOfGuests} onChange={handleChange} placeholder={"1"}/>
    //                                     {/* 오류메시지에 guestName이 존재하면 */}
    //                                     {error.numberOfGuests && (
    //                                         <div className={"invalid-feedback"}>
    //                                             {error.numberOfGuests}
    //                                         </div>
    //                                     )}
    //                                 </div>
    //                                 <div className={"col-md-6"}>
    //                                     <label className={"form-label fw-semibold"}>체크인 *</label>
    //                                     <input type={"date"} name={"checkInDate"}
    //                                            className={`form-control ${error.checkInDate? 'is-invalid' : ''}`}
    //                                            value={form.checkInDate} onChange={handleChange}/>
    //                                     {/* 오류메시지에 guestName이 존재하면 */}
    //                                     {error.checkInDate && (
    //                                         <div className={"invalid-feedback"}>
    //                                             {error.checkInDate}
    //                                         </div>
    //                                     )}
    //                                 </div>
    //                                 <div className={"col-md-6"}>
    //                                     <label className={"form-label fw-semibold"}>체크아웃 *</label>
    //                                     <input type={"date"} name={"checkOutDate"}
    //                                            className={`form-control ${error.checkOutDate? 'is-invalid' : ''}`}
    //                                            value={form.checkOutDate} onChange={handleChange}/>
    //                                     {/* 오류메시지에 guestName이 존재하면 */}
    //                                     {error.checkOutDate && (
    //                                         <div className={"invalid-feedback"}>
    //                                             {error.checkOutDate}
    //                                         </div>
    //                                     )}
    //                                 </div>
    //                                 <div className={"col-md-12"}>
    //                                     <label className={"form-label fw-semibold"}>요청사항 *</label>
    //                                     <textarea name={"specialRequests"} className={"form-control"}
    //                                     onChange={handleChange} ></textarea>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </div>
    //                     {/* 예약 버튼(예약 작업이 있었으면 비활성) */}
    //                     <button type={"submit"} className={"btn btn-primary btn-lg w-100"}
    //                     disabled={submitting}>
    //                         {submitting ? (
    //                             <>
    //                                 <span className={"spinner-border spinner-border-sm me-2"}></span> 예약 처리중
    //                             </>
    //                         ) : (
    //                             <>
    //                                 <i className={"bi bi-check-circle me-2"}></i> 예약 확정하기
    //                             </>
    //                         )
    //                         }
    //                     </button>
    //                 </form>
    //             </div>
    //             <div className={"col-lg-4"}>
    //                 {/* 가격, 숙박정보 */}
    //             </div>
    //         </div>
    //
    //     </div>
    // )

    return (
        <div className="container py-5">
            <h2 className="fw-bold mb-4">예약하기</h2>

            <div className="row g-4">
                {/* 왼쪽: 예약 정보 입력 폼 */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm p-4 rounded-3">
                        <form onSubmit={handleSubmit}>
                            <h5 className="mb-4 fw-bold">예약자 정보</h5>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">예약자 성함</label>
                                    <input type="text" name="guestName" className={`form-control ${error.guestName ? 'is-invalid' : ''}`}
                                           value={form.guestName} onChange={handleChange} placeholder="홍길동" />
                                    <div className="invalid-feedback">{error.guestName}</div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">이메일 주소</label>
                                    <input type="email" name="guestEmail" className={`form-control ${error.guestEmail ? 'is-invalid' : ''}`}
                                           value={form.guestEmail} onChange={handleChange} placeholder="example@gmail.com" />
                                    <div className="invalid-feedback">{error.guestEmail}</div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">연락처</label>
                                    <input type="text" name="guestPhone" className={`form-control ${error.guestPhone ? 'is-invalid' : ''}`}
                                           value={form.guestPhone} onChange={handleChange} placeholder="010-0000-0000" />
                                    <div className="invalid-feedback">{error.guestPhone}</div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">투숙 인원</label>
                                    <input type="number" name="numberOfGuests" className={`form-control ${error.numberOfGuests ? 'is-invalid' : ''}`}
                                           value={form.numberOfGuests} onChange={handleChange} min="1" max={room?.capacity} />
                                    <div className="invalid-feedback">{error.numberOfGuests}</div>
                                </div>

                                <h5 className="mt-4 mb-2 fw-bold">일정 선택</h5>
                                <div className="col-md-6">
                                    <label className="form-label">체크인 날짜</label>
                                    <input type="date" name="checkInDate" className={`form-control ${error.checkInDate ? 'is-invalid' : ''}`}
                                           value={form.checkInDate} min={today} onChange={handleChange} />
                                    <div className="invalid-feedback">{error.checkInDate}</div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">체크아웃 날짜</label>
                                    <input type="date" name="checkOutDate" className={`form-control ${error.checkOutDate ? 'is-invalid' : ''}`}
                                           value={form.checkOutDate} min={form.checkInDate || today} onChange={handleChange} />
                                    <div className="invalid-feedback">{error.checkOutDate}</div>
                                </div>

                                <div className="col-12 mt-4">
                                    <label className="form-label">기타 요청사항 (선택)</label>
                                    <textarea name="specialRequests" className="form-control" rows="3"
                                              value={form.specialRequests} onChange={handleChange} placeholder="미니바 추가, 엑스트라 베드 등..."></textarea>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg w-100 mt-4" disabled={submitting}>
                                {submitting ? '예약 처리 중...' : '예약 확정하기'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* 오른쪽: 예약 요약 및 요금 정보 */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm p-4 rounded-3 bg-light sticky-top" style={{ top: '2rem' }}>
                        <h5 className="fw-bold mb-3">예약 요약</h5>
                        <div className="d-flex mb-3">
                            <img src={room?.imageUrl || 'https://via.placeholder.com/100'} alt={room?.name}
                                 className="rounded" style={{ width: '80px', height: '60px', objectFit: 'cover' }} />
                            <div className="ms-3">
                                <h6 className="fw-bold mb-0">{room?.name}</h6>
                                <small className="text-muted">최대 {room?.capacity}인 투숙 가능</small>
                            </div>
                        </div>

                        <hr />

                        <div className="d-flex justify-content-between mb-2">
                            <span>1박 요금</span>
                            <span>{room?.pricePerNight.toLocaleString()} 원</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <span>총 숙박일</span>
                            <span>{night} 박</span>
                        </div>

                        <hr />

                        <div className="d-flex justify-content-between align-items-center mb-0">
                            <span className="fw-bold fs-5">총 결제 금액</span>
                            <span className="fw-bold fs-4 text-primary">{total.toLocaleString()} 원</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );



}

export default BookingPage