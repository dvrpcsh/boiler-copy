import React,{ useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/hello')
    .then(response => console.log(response.data))
  }, [])

  const onClickHandler = () => {
    console.log("로그아웃클릭")
    axios.get('/api/users/logout')
    .then(response => {
      console.log("로그아웃")
      console.log(response.data)
      if(response.data.success) {
        console.log("4")
        navigate('/login');
      } else {
        alert("로그아웃 실패")
      }
    })
  }

  return (
    
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      width: '100%', height: '100vh'
    }}>
      <h2>시작페이지</h2>
      <button onClick={onClickHandler}>
        로그아웃
      </button>
    </div>
  )
}

export default LandingPage