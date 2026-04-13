# Spring Boot 프로젝트 안의 frontend 폴더에 React + Vite를 설치하는 방법을 순서대로 정리

## 1. 구조 먼저 만들기
```
Spring Boot 프로젝트 기준:

my-project/
 ├── backend (Spring Boot)
 └── frontend (React + Vite)
```

## 2. frontend 폴더로 이동

터미널에서:
```
cd frontend
```

## 3. Vite로 React 생성

아래 명령어 실행:
```
npm create vite@latest .
```
👉 여기서 중요한 점:
. → 현재 폴더(frontend)에 설치

## 4. 설정 선택

실행하면 선택 화면이 나옵니다:
```
✔ Framework: React
✔ Variant: JavaScript (또는 TypeScript)
```

## 5. 패키지 설치
```
npm install
```

## 6. 실행 확인
```
npm run dev
```

브라우저:
```
http://localhost:5173
```

## 7. Spring Boot와 연결 구조
개발 구조
```
React (5173)  →  Spring Boot (8080)
```

axios 설정 (이미 너 코드 기준)
```
const api = axios.create({
  baseURL: '/api'
})
```

👉 이렇게 하면 프록시 설정 필요

## 8. Vite + Spring Boot 연결 (중요)

frontend/vite.config.js 수정:
```
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
}
```

## 9. 배포 구조 (중요 개념)

운영 시:

- React build
```
npm run build
```

- 결과:
```
frontend/dist
```
👉 Spring Boot가 이걸 static으로 서빙 가능


# Spring Boot jar 하나만으로 React + Spring Boot를 함께 실행되게 만들기

기본 상태에서는 자동으로 같이 실행되지 않습니다.

## 1. 기본 상태 (지금 구조)
```
frontend (Vite) → npm run dev (5173)
backend (Spring Boot) → java -jar (8080)
```
👉 서로 완전히 분리

## 2. “jar 하나로 같이 실행” 가능한 구조

가능한 방식은 이거입니다:

### ✔ React build 결과를 Spring Boot에 포함

## 3. 전체 흐름
### (1) React 빌드
```
cd frontend
npm run build
```
결과:
```
frontend/dist
```

### (2) Spring Boot에 복사
```
backend/src/main/resources/static/
```

👉 dist 안 파일을 여기로 넣음

### (3) Spring Boot 실행
```
java -jar app.jar
```

## 4. 결과

이제 이렇게 동작:
| 요청      | 처리               |
| ------- | ---------------- |
| /rooms  | React index.html |
| /api/** | Spring Boot API  |

## 5. 중요한 개념
### ✔ Spring Boot가 React를 서빙함
```
Spring Boot = 서버 + React 정적 파일 서버
```

## 6. 지금 너 코드 기준 구조

이미 이런 구조 있음:
```
@RequestMapping({
  "/",
  "/rooms",
  "/rooms/**",
  "/booking/**"
})
forward:/index.html
```

👉 React SPA 지원 준비 완료 상태

## 7. 운영 구조 (최종 형태)
```
[Spring Boot JAR]
 ├── REST API (/api)
 ├── React build (/static)
 └── index.html (React entry)
```

## 8. 중요한 차이
| 방식 | 설명                    |
| -- | --------------------- |
| 개발 | React + Spring 따로 실행  |
| 배포 | Spring Boot 하나로 통합 실행 |
