// springboot에서 controller 처럼 맵핑처리
import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

// 공용 페이지
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import BookingPage from "./pages/BookingPage.jsx";
import BookingCompletePage from "./pages/BookingCompletePage.jsx";
import MyReservationPage from "./pages/MyReservationPage.jsx";
import RoomListPage from "./pages/RoomListPage.jsx";
import RoomDetailPage from "./pages/RoomDetailPage.jsx";

function App() {


    return (
        <BrowserRouter>{/* 페이지 구성, layout 역할 */}
            <div className={"d-flex flex-column min-vh-100"}>
                {/* 상단메뉴(변동없는 공용페이지) */}
                <Navbar/>

                {/* 메인페이지(여러 페이지로 구성) */}
                <Routes> {/* @Controller */}
                    {/* path => @Mapping(), element => return 페이지 */}
                    {/* 룸 목록*/}
                    <Route path={"/"} element={<RoomListPage/>}/>
                    <Route path={"/rooms"} element={<RoomListPage/>}/>
                    {/* 룸 상세정보*/}
                    {/* 변화가 있는 값(변수)는 : 변수 */}
                    <Route path={"/rooms/:id"} element={<RoomDetailPage/>}/>
                    {/*예약 생성페이지*/}
                    <Route path={"/booking/:roomId"} element={<BookingPage/>}/>

                    {/*예약 완료 페이지*/}
                    <Route path={"/booking/complete"} element={<BookingCompletePage/>}/>

                    {/* 내 예약 조회 페이지 */}
                    <Route path={"/my-reservations"} element={<MyReservationPage/>}/>

                </Routes>
              {/* 하단 */}
              <Footer/>
            </div>



        </BrowserRouter>
      )
}

export default App
