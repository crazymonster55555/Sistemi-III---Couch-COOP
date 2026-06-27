import { useNavigate } from "react-router-dom";

import parsecIcon from "/src/images/Parsec.png";

export default function ParsecIntigration(props){
    
    const navigate = useNavigate();

    function parsecRedirect(){
        let parsec = localStorage.getItem("sessionUrl");
        console.log("parsec: ", parsec);
        navigate(parsec + "/discord");
    }


    return (
    <>
        <div className="sessionLetter2">
            <img src={parsecIcon} width="15%"></img>
            <div>Parsec integration</div>
            <div>Friends to add for this room:</div>
            <div>Friend Test1:</div>
            <div>ExampleName#123456789</div>
            <button onClick={parsecRedirect}>Continue</button>
        </div>
    </>);


}