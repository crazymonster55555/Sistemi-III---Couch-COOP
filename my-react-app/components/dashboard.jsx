import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DisplaySessions from "./displaySessions";

export default function Dashboard(props){
        
    let single = true;
    const logedIn = localStorage.getItem('username');
    const navigate = useNavigate();
    const [sessions,setSessions] = useState([]);
    const [update,setUpdate] = useState(0);
    const [temp,setTemp] = useState('');

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
            
        }, 30*60*1000);//30*60*1000
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

    

    //console.log(logedIn);
    
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

    function handleTextbox(e){
        setTemp(e);
    }

    //console.log(sessions);
    //console.log(String(sessions.id));
    //console.log(String(sessions.id).includes(temp));

    return logedIn && (
    <>  
        <div className="dashboard">Welcome to dashboard</div><br/>
        <label>Searchbar: </label>
        <span><input type="textbox" onChange={e => handleTextbox(e.target.value)} placeholder="Enter text here"/></span>
        <label>Typed in: {temp}</label>
        <span className="spane"><button className="makeSession" onClick={handleClick}>+</button></span>
        <span className="spane1"><button className="makeSession1" onClick={handleLogout}>--</button></span>
        <br/>
        <div className="sessionCollumns">
        {sessions
            .filter((sessions) => {
                if (temp == ''){ 
                    return true; 
                }
                return(
                    String(sessions.id).includes(temp) ||
                    String(sessions.user_id).includes(temp) ||
                    String(sessions.game_id).includes(temp) ||
                    String(sessions.duration).includes(temp) ||
                    String(sessions.description).includes(temp) ||
                    String(sessions.connection_type).includes(temp) ||
                    String(sessions.status).includes(temp)
                ); 
                })
            .map((session) => <DisplaySessions key={session.id} session={session}/>)}
        </div>  
        
    </>);
    
}