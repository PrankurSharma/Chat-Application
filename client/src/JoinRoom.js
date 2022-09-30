import React, { useState } from "react";
import Axios from 'axios';
import Header from './Header';
import Spinner from "./Spinner";
import { useNavigate } from 'react-router-dom';

function JoinRoom() {
    Axios.defaults.withCredentials = true;
    const [username, set_username] = useState("");
    const [email, set_email] = useState("");
    const [room, set_room] = useState("");
    const [loading, set_loading] = useState(true);
    const navigate = useNavigate();
    const navigateToHome = () => {
        navigate('/');
    }

    function handleChange(newValue) {
        set_loading(newValue);
    }

    function fetchDetails(newValue1, newValue2) {
        set_username(newValue1);
        set_email(newValue2);
    }
    
    const joinRoom = () => {
        if(email !== "" && room !== ""){
            Axios.post('http://localhost:3001/api/checkroom', {
                email: email,
                room: room
            }).then((response) => {
                if(response.data.message){
                    alert(response.data.message);
                }
                else{
                    alert("Room joined successfully.");
                    navigateToHome();
                }
            });
        }
        else{
            alert("Please enter a room no.");
        }
    };

    if(loading) {
        return (
            <Spinner handleChange={handleChange} fetchDetails={fetchDetails} />
        );
    }

    return (
        <div className="Room">
            <Header username={username} />
            <div className="joinContainer">
                <div className="room-code">
                    <h3> Join A Room </h3>
                    <input type="text" placeholder="Room No." onChange={(event) => {
                        set_room(event.target.value);
                    }}/>
                    <button onClick={() => {
                        joinRoom();
                    }}> Join This Room </button>
                </div>
            </div>
        </div>
    );
}
export default JoinRoom;