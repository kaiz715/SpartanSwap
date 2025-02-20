import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios'
import { CookiesProvider, useCookies } from 'react-cookie'

import './App.css'

function App() {
  const [loading, setLoading] = useState(false)
  const [cookies, setCookie] = useCookies(['jwt_token'])

  window.signIn = function(response){
    setLoading(true)
    var bodyFormData = new FormData();
    bodyFormData.append('credential', response.credential);
    axios.post('http://localhost:5001/signin', bodyFormData)
    .then(JWTresponse => {
      if (JWTresponse.data.CWRU_validated) {
        console.log('Logged in')
        setCookie('jwt_token', JWTresponse.data.jwt_token)
      }
      else{
        console.log('Not logged in')
      }
      console.log(response)
    })
    .catch(error => {
      console.log(error)
    })
    setLoading(false)
  }

  return (
    <>
      <script src="https://accounts.google.com/gsi/client" async></script>
      <div id="g_id_onload"
        data-client_id="435330253471-vga9r129els35fsddcpgegesjtac5d1d.apps.googleusercontent.com"
        data-context="signin"
        data-ux_mode="popup"
        data-callback="signIn"
        data-itp_support="true">
      </div>

      <div className="g_id_signin"
        data-type="standard"
        data-shape="rectangular"
        data-theme="outline"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left">
      </div>
    </>
  )
}

export default App
