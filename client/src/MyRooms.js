import React, { useEffect, useState } from 'react';
import Axios from 'axios';

function MyRooms({changeGroupClick, setRoom}) {
    Axios.defaults.withCredentials = true;
    const [groups, set_groups] = useState([]);
    
    useEffect(() => {
        Axios.get('http://localhost:3001/api/fetchrooms').then((response) => {
            set_groups(response.data);
        });
    }, []);

    if(!groups.length){
        return (
            <div>
                <h3> No groups found </h3>
            </div>
        );
    }
    return (
        <div>
            {groups.map((g) => {
                return(
                    <div> 
                        <div className='my-group' onClick={() => {
                            changeGroupClick((val) => !val);
                            setRoom(g.room_no);
                        }}> {g.room_no} </div>
                    </div>
                );
            })}
        </div>
    );
}

export default MyRooms;