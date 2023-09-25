import React,{ useEffect } from 'react'
import axios from 'axios';

function LandingPage() {

  useEffect(() => {
    axios.get('/api/hello')
    .then(response => console.log(response.data))
  }, [])

  return (
    
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      width: '100%', height: '100vh'
    }}>
      <form>
        <label>Email</label>
        <input  type="email" value onChange />
        <label>Password</label>
        <input type="password" value onChange />

        <br />
        <button>
          Login
        </button>
      </form>

    </div>
  )
}

export default LandingPage