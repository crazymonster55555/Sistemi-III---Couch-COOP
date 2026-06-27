import { useDebugValue, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CurrentSession from "./currentSession";

export default function DisplaySessions({session}){
    
    let username = localStorage.getItem("username");
    let game = localStorage.getItem("game");
    const navigate = useNavigate();

    const [error,setError] = useState();
    const [success,setSuccess] = useState();
    const [refresh,setRefresh] = useState(false);

    useEffect(() => {
        console.log("D: ");
    },[refresh]);

    const deleteItem = async () => {
        
        //console.log("ses: ", sessionID);
        setError('');
        setSuccess('');
        let sessionID = document.getElementById(session.id);
        console.log("Display parent: ", sessionID.parentNode);
        //console.log("id: ", sessionID);
        //console.log(":", parent);
        //console.log(parent.childElementCount);
        

        try {
            const response = await fetch('/api/dashboard/deleteSessions', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: session.id, user_id: session.user_id }),
            });

            const data = await response.json();
                
            if (response.ok && data.success) {
                
                const logedIn = localStorage.getItem('username');

                if (parent.childElementCount <= 1){
                    parent.className="---";
                    console.log("Y: ", parent.className);
                }   
                
                sessionID.parentElement.className="none";
                sessionID.remove();
                //window.location.reload();

                

                setTimeout(() => {
                    if (!logedIn){
                        navigate("/");
                    }else{
                        navigate('/dashboard');
                    }
                }, 2000);
            } else {
                setError(data.message || 'Session failed');
            }
        } catch (error) {
            console.error('Napaka pri povezavi:', error);
            setError('Težava s povezavo do strežnika.');
        }
        
    }

    const joinSession = async () => {

        console.log(session);
        

        localStorage.setItem("sessionUrl","/dashboard/" + session.id + "/room");
        navigate("/dashboard/" + session.id + "/room" + "/parsec");

        
    }

    return (
    <>
    {/*console.log(session.status)*/}
    <div id="-1" className="sessionLetter">
        <span id={session.id}>
            <span>Match ID: {session.id}</span><br/>
            <span>Created by: {username} (id: {session.user_id})</span><br/>
            <span>Game: {game} (id: {session?.game_id})</span><br/>
            <span>Started: {session.start_time}</span><br/>
            <span>Duration: {session.duration} minutes</span><br/>
            <span>Description: {session.description}</span><br/>
            <span>Connection: {session.connection_type}</span><br/>
            <span>Status: {session.status}</span><br/>
            <span>Created: {session.created_at}</span><br/>
            <button onClick={() => {joinSession()}}>Join</button><br/>
            <button onClick={() => {deleteItem()}}>Delete</button>
        </span>
    </div>
    </>);
}