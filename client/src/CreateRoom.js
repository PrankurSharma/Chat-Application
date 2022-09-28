import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import Chat from './Chat';
import Axios from 'axios';
import uuid from 'react-uuid';


const socket = io.connect("http://localhost:3001");

function CreateRoom() {
    Axios.defaults.withCredentials = true;
    const [username, set_username] = useState("");
    const [email, set_email] = useState("");
    const [room, set_room] = useState("");
    const [click, set_click] = useState(false);
    const [displayChat, set_displayChat] = useState(false);
    const alloted_room = uuid().slice(0, 7);

    useEffect(() => {
        Axios.get('http://localhost:3001/api/login').then((response) => {
            if(response.data.message){
                alert(response.data.message);
                window.location.href = "/login";
            }
            else{
                set_username(response.data[0].name);
                set_email(response.data[0].email);
                set_room(alloted_room);
            }
        });
    }, []);
    
    const joinRoom = () => {
        if(email !== "" && room !== ""){
            Axios.post("http://localhost:3001/api/createroom", {
                email: email,
                room: room
            }).then((response) => {
                if(response.data.message){
                    alert(response.data.message);
                }
                else{
                    socket.emit("join_room", room);
                    set_displayChat(true);
                }
            });
        }
    };

    return (
        <div className="Room">
            {
                !displayChat ? 
                (<div className='joinContainer'>
                <h1> Hi user {username} </h1>
                <h3> Join A Room </h3>
                <p> Please share the code: {room} with others in order to join the Chat group. </p>
                <button onClick={() => {
                    set_click((val) => !val);
                    joinRoom();
                    }}> Create and Join This Room </button>
                </div>) : <div className='div-chat'> <Chat socket={socket} username={username} room={room} groupclick={click} /> </div> 
            }
        </div>
    );
}

export default CreateRoom;