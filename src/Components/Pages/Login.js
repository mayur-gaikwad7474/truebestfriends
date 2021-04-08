import React, { useState } from 'react'
import Logo from '../../Assets/logo.png'
import '../css/Login.css'
import Axios from 'axios'
import queryString from "query-string"

const Login = (props) => {

    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [errorMessage, seterrorMessage] = useState("")

    if (localStorage.getItem("token") !== null) {
        props.history.push('/home')
    }

    const submitCredientials = () => {
        if (email === null || password === null) {
            alert("plz enter all fields")
        } else {
            Axios.post("https://api.truebestfriends.com/auth",
                queryString.stringify({
                    email: email,
                    password: password,
                }), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).then(function (response) {
                localStorage.setItem('token', response.data.data.token);
                props.history.push('/home')
            }).catch(err => {
               seterrorMessage("Your email or password is incorrect plz try again !")
            })
        }
    }

    return (
        <header>
            <div className="logo-container">
                <img src={Logo} alt="Logo" />
            </div>

            <div className="login-container card margin">
                <div className="input-container">
                    <div>Email</div>
                    <input type="email" placeholder="Enter your email" pattern="/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/" onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="input-container">
                    <div>Password</div>
                    <input type="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
                </div>

                <div style={{alignSelf:'center', marginTop:10, color:'red'}}>{ errorMessage}</div>

                <button onClick={submitCredientials}>Admin Login</button>
            </div>

        </header>
    )
}

export default Login
