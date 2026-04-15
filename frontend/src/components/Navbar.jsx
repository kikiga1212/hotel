// 내부에서 페이지 연결, 현재 URL 정보를 읽어온다.
import {Link, useLocation} from 'react-router-dom'

function Navbar() { // 파일명과 동일하게 메소드를 정의
    // 변수선언
    const location = useLocation() // 현재 URL 정보 가져오기, 예) /rooms, /my-rerservations

    // 해당 경로가 올바른 정보인지 확인
    const isActive = (path)=>
        location.pathname === path ||
        location.pathname.startsWith(path + '/')
    // 구동동작(state, effect, 이벤트)

    // HTML 디자인(UI 렌더링)
    // class(X)==> className(O), style==>style
    // {} => 변수 적용시, 주석 등 기본 지정
    // {{}} => 문자열, "내용"
    return (
        <nav className="navbar navbar-expand-lg navbar-dark"
        style={{backgroundColor: '#1a1a2e'}}>
            <div className={"container"}>
                {/* Link 는 a 태그와 동일 */}
                <Link className={"navbar-brand fw-bold fs-4"} to={"/"}>
                    <i className={"bi bi-building me-2"}></i>
                    그랜드 호텔
                </Link>

                {/* 반응형웹 사용시 사용할 삼색버튼*/}
                <button className={"navbar-toggler"} type={"button"}
                        data-bs-toggle={"collapse"} data-bs-target={"#navBarMain"}>
                    <span className={"navbar-toggler-icon"}></span>
                </button>

                {/* 메뉴 */}
                <div className={"collapse navbar-collapse"} id={"navBarMain"}>
                    {/* 왼쪽 메뉴 - 리액트 내부 페이지로 연결 Link : 새로고침없이 데이터교체만 되므로 속도가 빠름 */}
                    <ul className={"navbar-nav me-auto mb-2 mb-lg-0"}>
                        <li className={"nav-item"}>
                            {/* a=>Link, href=> to*/}
                            <Link className={`nav-link ${
                            isActive('/rooms') || location.pathname==='/'?'active':''
                            }`} to={"/rooms"}>
                                <i className={"bi bi-door-open me-1"}></i> 객실 소개

                            </Link>
                        </li>
                        <li className={"nav-item"}>
                            {/* 현재 '내 예약 확인' 메뉴에도 || location.pathname==='/' 조건이 들어있어,
                              홈 화면일 때 두 메뉴가 동시에 활성화될 수 있습니다. 이를 분리하면 더 명확해집니다.*/}
                            {/*
                            <Link className={`nav-link ${
                                isActive('/my-reservations') || location.pathname==='/'?'active':''
                            }`} to={"/my-reservations"}>
                                <i className={"bi bi-calendar-check me-1"}></i> 내 예약 확인
                            </Link>
                            */}
                            <Link className={`nav-link ${
                                isActive('/my-reservations') ? 'active' : ''
                            }`} to={"/my-reservations"}>
                                <i className={"bi bi-calendar-check me-1"}></i> 내 예약 확인
                            </Link>

                        </li>
                    </ul>
                    {/* 오른쪽 관리자 버튼 - springboot로 연결 : 외부/다른 서버이동시 a xorm */}
                    <div className={"d-flex gap-2"}>
                        <a href={"/admin"} className={"btn btn-outline-light btn-sm"}>
                            <i className={"bi bi-gear me-1"}></i> 관리자
                        </a>
                    </div>
                </div>

            </div>
        </nav>
    )
}

export default Navbar // 외부에서 사용할 수 있도록