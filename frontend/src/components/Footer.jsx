function Footer () {
    return (
        <footer className={"py-4 mt-auto"} style={{backgroundColor:'#1a1a2e', color:'#adb5bd'}}>
            <div className={"container text-center"}>
                <p className={"mb-1"}>
                    <i className={"bi bi-building me-1"}></i>
                    <strong className={"text-white"}>그랜드 호텔</strong>
                </p>
                <p className={"mb-0 small"}>
                    &copy; 2026 Grand Hotel. All rights reserved.
                </p>
            </div>
        </footer>
    )
}
export default Footer

//index.js (API): Axios 인스턴스를 통해 백엔드(8080 포트)와 통신 준비 완료.
// App.jsx (Router): 모든 페이지의 주소(URL) 매핑 완료.
// RoomListPage: 백엔드에서 방 목록을 가져와 필터링하고 검색하는 기능 구현.
// RoomCard: 개별 방 정보를 카드 형태로 시각화.
// Navbar & Footer: 모든 페이지에서 유지되는 공통 레이아웃 완성.