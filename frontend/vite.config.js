/*
* 빌드 도구 설정 파일
* 개발모드 ; 포트, 요청세팅
* 빌드 ; 2개의 서버 사용시 react를 springboot 에 복사
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: { // 서버정보 및 요청처리 설정
    port: 5173,
    proxy: {
      '/api':{
        target: 'http://localhost:8080', // springboot의 서버 주소
        changeOrigin: true // 요청헤더에 origin을 추가
      }
    }
  },
  build: { // react를 빌드 후  springboot 에 적용
    outDir: '../src/main/resources/static', // springboot 공용 폴더에 빌드
    emptyOutDir: true, // 기존 빌드정보는 삭제

  }

})
