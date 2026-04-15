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
                setForm(res.data);
            }catch{
                alert('룸 정보를 불러오지 못했습니다.')
                navigate('/rooms')
            }finally {
                setLoading(false);
            }
        }
        fetchRoom();
    }, [roomId]);

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
        if(errors[name]){
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
        else if (!/\S+@\S+\.\S|/.test(form.guestEmail)) // 문자열@문자열.문자열
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
                ...form, roomId: Number(roomId),
                numberOfGuests: Number(orm.numberOfGuests)
            })
            navigate('/booking/complete'),{
                state : {reservation: res.data, room}
            }
        }catch(err){
            const msg = err.response?.data || '예약에 실패했습니다. 다시 시도해 주세요.'
            alert(msg)
        }finally {
            submitting (false);
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
}

export default BookingPage