import React, { useState, useEffect } from "react";
import Axios from 'axios';
import Header from './Header';

function AddMember() {
    Axios.defaults.withCredentials = true;
    const [username, set_username] = useState("");
    const [email, set_email] = useState("");
    const [room, set_room] = useState("");

    useEffect(() => {
        Axios.get('http://localhost:3001/api/login').then((response) => {
            if(response.data.message){
                alert(response.data.message);
                window.location.href = "/login";
            }
            else{
                set_username(response.data[0].name);
            }
        });
    }, []);
    
    const joinRoom = () => {
        if(email !== "" && room !== ""){
            Axios.post('http://localhost:3001/api/addmember', {
                email: email,
                room: room
            }).then((response) => {
                if(response.data.message){
                    alert(response.data.message);
                }
                else{
                    alert("Room joined successfully.");
                    window.location.href = "/";
                }
            });
        }
        else{
            alert("Please enter a room no.");
        }
    };

    return (
        <div className="Room">
            <Header username={username} />
            <div className="joinContainer">
                <div className="room-code">
                    <h3> Add a Participant </h3>
                    <input type="text" placeholder="Room No." onChange={(event) => {
                        set_room(event.target.value);
                    }} />
                    <input type="text" placeholder="Email of the Person" onChange={(event) => {
                        set_email(event.target.value);
                    }} />
                    <button onClick={() => {
                        joinRoom();
                    }}> Add to this Group </button>
                </div>
            </div>
        </div>
    );
}
export default AddMember;