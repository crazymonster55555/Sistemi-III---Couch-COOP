import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Dashboard(props){
        
    let single = true;
    const logedIn = localStorage.getItem('username');
    const navigate = useNavigate();

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

    console.log(logedIn);

    function handleClick(){
        navigate("/dashboard/makeSession");
    }

    return logedIn && (
    <>
        <div className="dashboard">Welcome to dashboard</div>
        <button className="makeSession" onClick={handleClick}>+</button>
        
    </>);
    
}