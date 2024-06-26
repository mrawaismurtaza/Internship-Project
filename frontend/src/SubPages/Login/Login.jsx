import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

        const response = await fetch(API_BASE + "login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            navigate("/home"); // Navigate to the home page
        } else {
            console.error("Login Failed");
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
