import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import axios from "axios";
import { toast } from "react-toastify";

import "./Login.css";

const API_BASE = "http://localhost:4002/";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleLogin = async (event) => {
        event.preventDefault();
    
        try {
            const response = await axios.post(API_BASE + "login" , {
                email,
                password
            }, {
                headers: {
                    "Content-Type" : "application/json"
                }
            });
    
            if(response.status === 200) {
                const { token } = response.data;
                localStorage.setItem('token', token);

                const decodedToken = jwtDecode(token);
                const userId = decodedToken.userId;
                navigate(`/home/${userId}`);
                toast.success('Login Successful')
            } else {
                toast.error("Login Failed");
            }
        } catch (error) {
            toast.error(`Enter Valid Credentials`);
        }
    };
    

    return (
        <div className="Login">
            <div className="Credentials">
                <label htmlFor="Email" className="label">Email</label>
                <input type="email" id="Email" name="Email" className="input" placeholder="Email..." onChange={handleEmail} />

                <label htmlFor="Password" className="label">Password</label>
                <input type="password" name="Password" id="Password" placeholder="Password" onChange={handlePassword} />
            </div>

            <div className="Link">
                <a href="/">Don't have an Account</a>
                <button className="button login-button" onClick={handleLogin}>Login</button>
            </div>
        </div>
    );
}

export default Login;
