import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DisplaySessions from "./displaySessions";

export default function Dashboard(props){
        
    let single = true;
    const logedIn = localStorage.getItem('username');
    const navigate = useNavigate();
    const [sessions,setSessions] = useState([]);
    const [update,setUpdate] = useState(0);

    useEffect(() => {

        if (!logedIn) {
            navigate("/");
            return;
        }

        const timer = setTimeout(() => {
            if (single){
                localStorage.removeItem('username');
                localStorage.removeItem('userID');
                alert("Seja potekla");
                navigate("/");
                single = false
            }else{
                single = true;
            }
            
        }, 30*60*1000);
        timer;

    },[logedIn]);

    useEffect(() => {
        //let temp = setTimeout(() => {
        const getSessions = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/dashboard/sessions');
                const data = await response.json();
                console.log("data: ", data);
                if (data.success){
                    setSessions(data.sessions);
                    let x = data.sessions;
                    console.log(x);
                    
                }

            }catch(error){
                console.log("Error: ", error);
            }
        //}
            
        }
        //console.log("dddddd");
        getSessions();
        //console.log("dddddd");
        
        //},1000);
        //temp;
        //return clearTimeout(temp);
    
    }, [logedIn]);

    

    console.log(logedIn);
    //<button onClick={() => {setUpdate((prev) => prev+1)}}>test</button>

    function handleClick(){
        navigate("/dashboard/makeSession");
    }

    function handleLogout() {
        localStorage.removeItem('username');
        localStorage.removeItem('userID');
        navigate("/");
        alert("Logged out successfully");
    }

    return logedIn && (
    <>  
        <div className="dashboard">Welcome to dashboard</div>
        <button className="makeSession" onClick={handleClick}>+</button>
        <button className="makeSession1" onClick={handleLogout}>--</button>
        <div className="sessionCollumns">
            {sessions.map((session) => <DisplaySessions key={session.id} session={session}/>)}
        </div>  
        
    </>);
    
}