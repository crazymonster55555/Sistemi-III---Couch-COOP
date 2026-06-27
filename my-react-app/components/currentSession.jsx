import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import discordIcon from "/src/images/Discord.png";
import parsecIcon from "/src/images/Parsec.png";

export default function CurrentSession(){

    const [error,setError] = useState();
    const [success,setSuccess] = useState();

    const { id } = useParams();
    const [session,setSession] = useState();
    console.log(id);
    const navigate = useNavigate();

    let game = localStorage.getItem("game");
    let username = localStorage.getItem("username");
    console.log("temp name: " + game + " " + username);


    useEffect(() => {
        const temp = async () => {
            try {
                const response = await fetch('/api/dashboard/sessions/info', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id })
                });

                const data = await response.json();
                console.log(data);

                if (response.ok && data.success) {
                    console.log("info: ", data.sessions[0]);
                    setSession(data.sessions[0]);
                    console.log("session: ", data.sessions[0]);

                }else {
                    setError(data.message || 'Session failed');
                }

            }catch(error){
                console.error('Napaka pri povezavi:', error);
                setError('Težava s povezavo do strežnika.');
            }
        }

        temp();

    },[id]);

    function toDashBoard() {
        navigate("/dashboard");
    }


    return(<>
        <div className="sessionLetterJoined">
            <span>Welcome to room {session?.id}</span><br/>
            <span>Match ID: {session?.id}</span><br/>
            <span>Created by: {session?.user_username} (id: {session?.user_id})</span><br/>
            <span>Game: {session?.game_name} (id: {session?.game_id})</span><br/>
            <span>Started: {session?.start_time}</span><br/>
            <span>Duration: {session?.duration} minutes</span><br/>
            <span>Description: {session?.description}</span><br/>
            <span>Connection: {session?.connection_type}</span><br/>
            <span>Status: {session?.status}</span><br/>
            <span>Created: {session?.created_at}</span><br/><br/>
            <img src={parsecIcon} width="15%"></img><img src={discordIcon} width="15%"></img><br/><br/>
            <button onClick={toDashBoard}>Leave session</button>
        </div>
    </>);

}