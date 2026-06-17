import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function MakeSession(props) {
    

    const [game, setGame] = useState('');
    const [duration, setDuration] = useState(60);
    const [description, setDescription] = useState('');
    const [connection, setConnection] = useState('Parsec');
    const [status, setStatus] = useState('open');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const navigate = useNavigate();
    let userID;

    const redirect = async(e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        userID = localStorage.getItem('userID');
        //console.log("d: ", duration);
        let durationInt = userID.toString();
        //console.log("d: ", userID);
        try {
            const response = await fetch('http://localhost:3000/api/dashboard/makeSession', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    game, 
                    duration, 
                    description, 
                    connection, 
                    status,
                    userID}),
            });

            const data = await response.json();
                
            if (response.ok && data.success) {
                setSuccess("Registration complete. Redirecting...");
                setGame('');
                setDuration(60);
                setDescription('');
                setConnection('Parsec');
                setStatus('open');
                
                const logedIn = localStorage.getItem('username');

                setTimeout(() => {
                    if (!logedIn){
                        navigate("/");
                    }else{
                        navigate('/dashboard');
                    }
                }, 2000);
            } else {
                setError(data.message || 'Registracija ni uspela');
            }
        } catch (error) {
            console.error('Napaka pri povezavi:', error);
            setError('Težava s povezavo do strežnika.');
        }
    }

    return (
        <form className="login" onSubmit={redirect}>
            <h1><b>Make session</b></h1>
            <br/>
            <span>
                <label>Game name: </label><br/>
                <input type="text" placeholder="Enter game here ..."
                required onChange={e => setGame(e.target.value)} />
            </span>
            <br/><br/>
            <span>
                <label>Duration: </label><br/>
                <input type="number" min="0" max="999" placeholder="(min)"
                required onChange={e => setDuration(e.target.value)} />
            </span>
            <br/><br/>
            <span>
                <label>Description: </label><br/>
                <input type="text" placeholder="Enter description here ..."
                required onChange={e => setDescription(e.target.value)} />
            </span>
            <br/><br/>
            <span>
                <label>Connection type: </label><br/>
                <select required onChange={e => setConnection(e.target.value)}>
                    <option value="Parsec">Parsec</option>
                    <option value="Moonlight">Moonlight</option>
                </select>
            </span>
            <br/><br/>
            <span>
                <button type="submit">Make session</button>
            </span>
            <br/>
            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
        </form>
    );
}