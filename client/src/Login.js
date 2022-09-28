import React, { useState } from 'react';
import Axios from 'axios';
function Login() {
    Axios.defaults.withCredentials = true;
    const [email, set_email] = useState("");
    const [password, set_password] = useState("");

    const handleSubmit = () => {
        if(email && password){
            Axios.post('http://localhost:3001/api/login', {
                email: email,
                password: password
            }).then((response) => {
                if(!response.data.message){
                    window.location.href = "/";
                }
                else{
                    alert(response.data.message);
                }
            });
        }
        else{
            alert("Please fill all the fields");
        }
    }

    return (
        <div>
            <h1> Login </h1>
            <div>
                <div>
                    <input type="text" 
                    name="email"
                    placeholder="Email"
                    onChange={(e) => {
                        set_email(e.target.value);
                    }} 
                    />
                </div>
                <div>
                    <input type="text"
                    name="password"
                    placeholder="Password"
                    onChange={(e) => {
                        set_password(e.target.value);
                    }}
                    />
                </div>
                <div>
                    <button onClick={handleSubmit}> Submit </button>
                </div>
            </div>
        </div>
    );
}
export default Login;