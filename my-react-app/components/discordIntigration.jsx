import { useNavigate } from "react-router-dom";

import discordIcon from "/src/images/Discord.png";

export default function DiscordIntigration(props){
    
    const navigate = useNavigate();

    function discordRedirect(){
        let discord = localStorage.getItem("sessionUrl");
        navigate(discord + "/");
    }


    return (
    <>  
        <div className="sessionLetter2">
            <img src={discordIcon} width="15%"></img>
            <div>Discord integration</div>
            <div>Friends to add for this room:</div>
            <div>Friend Test1:</div>
            <div>ExampleName#3009</div>
            <span><button onClick={discordRedirect}>Continue</button></span>
        </div>
    </>);


}