import React, { useState, useEffect } from "react";
import Axios from 'axios';

function JoinRoom() {
    Axios.defaults.withCredentials = true;
    const [username, set_username] = useState("");
    const [email, set_email] = useState("");
    const [room, set_room] = useState("");
    //const [click, set_click] = useState(false);
    //const [displayChat, set_displayChat] = useState(false);

    useEffect(() => {
        Axios.get('http://localhost:3001/api/login').then((response) => {
            if(response.data.message){
                alert(response.data.message);
                window.location.href = "/login";
            }
            else{
                set_username(response.data[0].name);
                set_email(response.data[0].email);
            }
        });
    }, []);
    
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
                    //socket.emit("join_room", room);
                    //set_displayChat(true);
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
            <div className="joinContainer">
                <div className="room-code">
                    <h1> Hi user {username} </h1>
                    <h3> Join A Room </h3>
                    <input type="text" placeholder="Room No." onChange={(event) => {
                        set_room(event.target.value);
                    }}/>
                    <button onClick={() => {
                        //set_click((val) => !val);
                        joinRoom();
                    }}> Join This Room </button>
                </div>
            </div>
        </div>
    );
}
export default JoinRoom;