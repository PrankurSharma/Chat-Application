import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { baseUrl } from './baseUrl';

function MyRooms({changeGroupClick, setGroup}) {
    Axios.defaults.withCredentials = true;
    const [groups, set_groups] = useState([]);
    
    useEffect(() => {
        Axios.get(baseUrl + '/api/fetchrooms').then((response) => {
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
                            setGroup(g.room_no, g.group_name);
                        }}> {g.group_name} </div>
                    </div>
                );
            })}
        </div>
    );
}

export default MyRooms;