import React from 'react';
import './Signup.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const API_BASE = "http://localhost:4002/";

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch(API_BASE + "signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, username }),
        });

        if (response.ok) {
            navigate("/home"); // Navigate to the home page
        } else {
            console.error("Signup Failed");
        }
    };

    return (
        <div className="Signup">
            <div className="Credentials">
                <label htmlFor="Email" className="label">Email</label>
                <input type="email" id="Email" name="Email" className="input" placeholder="Email..." onChange={(e) => setEmail(e.target.value)} />

                <label htmlFor="Password" className="label">Password</label>
                <input type="password" name="Password" id="Password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

                <label htmlFor="username" className="label">Username</label>
                <input type="text" name="username" id="username" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            </div>

            <div className="Link">
                <a href="/login">Already have an Account</a>
                <button className="button login-button" onClick={handleSubmit}>Continue</button>
            </div>
        </div>
    );
}

export default Signup;
