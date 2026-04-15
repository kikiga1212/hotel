import {useState, useEffect} from "react"; // 상태(변수), 생명주기
import {roomApi} from "../api/index.js"; // 요청처리할 API
import RoomCard from "../components/RoomCard.jsx"; // 룸정보 카드

// 룸 타입 필터 목록
const ROOM_TYPES = [
    {value: '', label: '전체'},
    {value: 'STANDARD', label: '스탠다드'},
    {value: 'DELUXE', label: '디럭스'},
    {value: 'SUITE', label: '스위트'},
    {value: 'PENTHOUSE', label: '펜트하우스'},
]

function RoomListPage(){
    // 오늘날짜
    const today = new Date().toISOString().split('T')[0];

    // 내일날짜
    const tomorrow = new Date(Date.now()+86400000).toISOString().split('T')[0];

    // 상태관리(외부에서 들어오는 값/ 나가는 값을 저장)-> DTO(Setter, Getter)
    const [rooms, setRooms] = useState([]); // 전체 룸 리스트
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 오류상태
    const [checkIn, setCheckIn] = useState(''); // 체크인 날짜
    const [checkOut, setCheckOut] = useState(''); // 체크아웃 날짜
    const [selectedType, setSelectedType] = useState(''); // 룸 필터
    const [searched, setSearched] = useState(false); // 검색여부

    // 최초 로딩시 전체 객실 조회 작업(페이지를 읽을 때 처리)
    useEffect(()=>{
        fetchRooms()
    }, [])

    // 호출해서 사용(일반 함수)
    // 룸 리스트 조회(API)
    const fetchRooms = async (ci, co)=>{ // RestController에 요청
        setLoading(true); // 요청처리중
        setError(null); // 오류없음

        try {  //.ajax~success:~error:
            const res = await roomApi.getAll(ci, co) //체크인과 체크아웃을 가지고 전체 조회 요청

            setRooms(res.data) //받아온 List<DTO>를 저장
        } catch(e) { //요청시 실패했을 때
            setError("룸 정보를 불어오지 못했습니다.") //오류발생
        } finally {
            setLoading(false) //요청처리 종료
        }
    }
    // 날짜 검색
    const handleSearch = (e) => {
        e.preventDefault(); // 폼전송을 방지

        if(checkIn && checkOut && checkIn >= checkOut){
            alert('체크아웃 날짜는 체크인 날짜 이후여야 합니다.')
            return;
        }
        fetchRooms(checkIn || undefined, checkOut ||undefined);
        {/* 이는 백엔드 컨트롤러가 파라미터가 없을 때 어떻게 처리하느냐에 따라 중요합니다. */}

        setSearched(true); // 검색성공
    }
    // 필터 초기화
    const handleReset = () => {
        setCheckIn('')
        setCheckOut('')
        setSelectedType('')
        setSearched(false);

        // 전체 데이터 조회
        fetchRooms();
    }
    // 룸 타입 필터링(전체 조회데이터에서 해당 룸타입만 출력)
    const filteredRooms = rooms.filter(
        r => selectedType === '' || r.roomType === selectedType
    )
    // 화면에 출력할 UI 렌더링
    return(
        <>
            <div className={"py-5 text-white text-center"}
                style={{background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%'}}>
                    <div className={"container py-3"}>
                    {/* 타이틀 */}
                    <h1 className={"display-5 fw-bold mb-2"}>
                        <i className={"bi bi-building me-3"}></i> 그랜드 호텔
                    </h1>
                    {/* 서브 타이틀 */}
                    <p className={"lead text-white-50 mb-4"}>
                        최고의 휴식을 경험하세요.
                    </p>
                    {/* 날짜 검색 */}
                    <div className={"card border-0 shadow-lg mx-auto"}
                    style={{maxWidth: '700px', borderRadius: '16px'}}>
                        <div className={"card-body p-4"}>
                            <form onSubmit={handleSearch}>
                                <div className={"row g-3 align-items-end"}>
                                    {/* 체크인 */}
                                    <div className={"col-md-5"}>
                                        <label className={"form-label text-dark fw-semibold mb-1"}>
                                            <i className={"bi bi-calendar-event me-1 text-primary"}></i> 체크인
                                        </label>
                                        <input type={"date"} className={"form-control form-control-lg"}
                                        value={checkIn} min={today}
                                        onChange={(e)=>setCheckIn(e.target.value)}/>
                                    </div>
                                    {/* 체크아웃 */}
                                    <div className={"col-md-5"}>
                                        <label className={"form-label text-dark fw-semibold mb-1"}>
                                            <i className={"bi bi-calendar-event me-1 text-primary"}></i> 체크아웃
                                        </label>
                                        <input type={"date"} className={"form-control form-control-lg"}
                                               value={checkOut} min={checkIn || tomorrow}
                                               onChange={(e)=>setCheckOut(e.target.value)}/>
                                    </div>
                                    {/* 검색버튼 */}
                                    <div className={"col-md-2"}>
                                        <button type={"submit"} className={"btn btn-primary btn-lg w-100"}>
                                            <i className={"bi bi-search"}></i>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* 목록(필터 + 제목 + 조건검색 + 필터버튼 + 목록 */}
            <div className={"container py-5"}>
                <div className={"d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3"}>{/* 제목 */}
                    <div>
                        <h2 className={"fw-bold mb-0"}>
                            {searched?'검색 결과':'전체 객실'}
                            <span className={"badge bg-primary ms-2 fs-6"}>{filteredRooms.length}</span>
                        </h2>
                        {/* 검색 조건 표시*/}
                        {/* 체크인과 체크아우승로 검색을 했으면 해당 태그를 출력 */}
                        {searched && (checkIn || checkOut) && (
                            <p className={"text-muted mb-0 mt-1"}>
                                <i className={"bi bi-calendar-range me-1"}></i>
                                {checkIn}~{checkOut}
                            </p>
                        )}
                    </div>
                    {/* 룸 리스트를 타입별로 필터링 그룹 */}
                    <div className={"d-flex gap-2 align-items-center flex-wrap"}>
                        <div className={"btn-group"}>
                            {/* each=>map, stream */}
                            {ROOM_TYPES.map(type=>(
                                <button key={type.value}
                                className={`btn btn-sm ${selectedType === type.value?'btn-dark':'btn-outline-secondary'}`}
                                onClick={() => setSelectedType(type.value)}>
                                    {type.label}
                                </button>
                            ))}
                        </div>
                        {/* 초기화 버튼 */}
                        {searched && (
                            <button className={"btn btn-sm btn-outline-secondary"}
                            onClick={handleReset}>
                                <i className={"bi bi-x-lg me-1"}></i> 초기화
                            </button>
                        )}
                    </div>
                </div>
                {/* 로딩 UI*/}
                {loading && (
                    <div className={"text-center py-5"}>
                        <div className={"spinner-border text-primary"}></div>
                        <p className={"text-muted mb-0 mt-3"}>
                            객실 정보를 불러오는 중...
                        </p>
                    </div>
                )}
                {/* 오류 UI */}
                {error && (
                    <div className={"alert alert-danger text-center"}>
                        <i className={"bi bi-exclamation-circle me-2"}></i> {error}
                    </div>
                )}

                {/* 데이터가 없을때 : 검색결과가 0개인 경우 */}
                {!loading && !error && filteredRooms.length === 0 && (
                    <div className={"text-center py-5 text-muted"}>
                        <i className={"bi bi-inbox fs-1 d-block mb-3"}></i>
                        <h5>해당 조건의 객실이 없습니다.</h5>
                        {/* 만약 필터를 걸었거나 검색을 했다면 전체보기를 유도 */}
                        {(searched || selectedType !== '') && (
                            <button className={"btn btn-outline-primary mt-2"}
                            onClick={handleReset}>
                                전체 객실 보기
                            </button>
                        )}
                    </div>
                )}
                {/* 룸 리스트 : 검색 결과가 있는 경우 */}
                {!loading && !error && filteredRooms.length > 0 && (
                    <div className={"row g-4"}>
                        {filteredRooms.map(room => (
                            <RoomCard key={room.id} room={room} />
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default RoomListPage

//스프링 부트와 리액트가 어떻게 데이터를 주고받는지 다시 한번 복습해 볼까요?

//1. Component Mount: useEffect가 실행되면서 fetchRooms()가 호출됩니다.
//
//2. API Request: roomApi.getAll이 실행되어 백엔드(8080 포트)로 GET /api/rooms 요청을 보냅니다.
//
//3. State Update: 백엔드가 보내준 JSON 데이터를 setRooms(res.data)를 통해 리액트 상태에 저장합니다.
//
//4. Re-rendering: 상태가 변하면 리액트가 화면을 다시 그립니다. 이때 filteredRooms.map이 돌면서 우리가 만든 RoomCard들이 화면에 뿌려집니다.

// 중괄호 {}로 자바스크립트를 시작하고, ()를 사용하여 JSX 엘리먼트를 즉시 반환(return)하겠다는 뜻입니다.
// {{ }}
//바깥쪽 { }: "이제 자바스크립트 시작한다!"라는 선언
// 안쪽 { }: "이것은 자바스크립트의 객체(Object) 데이터다!"라는 뜻