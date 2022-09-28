import React, { useState } from 'react';
import Axios from 'axios';
function Signup() {
    const [email, set_email] = useState("");
    const [username, set_username] = useState("");
    const [password, set_password] = useState("");

    const handleSubmit = () => {
        if(email && username && password){
            Axios.post('http://localhost:3001/api/signup', {
                email: email,
                username: username,
                password: password
            }).then((response) => {
                if(!response.data.message && !response.data.error){
                    window.location.href = "/login";
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
            <h1> Signup </h1>
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
                    name="email"
                    placeholder="Username"
                    onChange={(e) => {
                        set_username(e.target.value);
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
export default Signup;