import { useEffect, useState } from 'react';
import Axios from 'axios';
import uuid from 'react-uuid';

function CreateRoom() {
    Axios.defaults.withCredentials = true;
    const [username, set_username] = useState("");
    const [email, set_email] = useState("");
    const [room, set_room] = useState("");
    const [groupname, set_groupname] = useState("");
    //const [click, set_click] = useState(false);
    //const [displayChat, set_displayChat] = useState(false);
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
        if(email !== "" && room !== "" && groupname !== ""){
            Axios.post("http://localhost:3001/api/createroom", {
                email: email,
                room: room,
                groupname: groupname
            }).then((response) => {
                if(response.data.message){
                    alert(response.data.message);
                }
                /*else{
                    socket.emit("join_room", room);
                    set_displayChat(true);
                }*/
                else{
                    alert("Room created successfully.");
                    window.location.href = "/";
                }
            });
        }
        else {
            alert("Please enter a name for the group.");
        }
    };

    return (
        <div className="Room">
            <div className='joinContainer'>
                <div className="room-code">
                    <h1> Hi user {username} </h1>
                    <h3> Join A Room </h3>
                    <p> Please share the code: {room} with others in order to join the Chat group. </p>
                    <input type="text" placeholder="Name of this group" onChange={(event) => {
                        set_groupname(event.target.value);
                    }} />
                    <button onClick={() => {
                        //set_click((val) => !val);
                        joinRoom();
                        }}> Create Room </button>
                </div>
            </div>
        </div>
    );
}

export default CreateRoom;