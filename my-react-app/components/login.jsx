import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login(props) {
    

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const navigate = useNavigate();

    const redirect = async(e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                navigate('/dashboard');
            } else {
                setError(data.message || 'Prijava ni uspela');
            }
        } catch (error) {
            console.error('Napaka pri povezavi:', error);
            setError('Težava s povezavo do strežnika.');
        }
    }

    return (
        <form className="login" onSubmit={redirect}>
            <h1><b>Login</b></h1>
            <br/>
            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
            <span>
                <label>Username: </label><br/>
                <input type="text" placeholder="Enter username here ..."
                required onChange={e => setUsername(e.target.value)} />
            </span>
            <br/><br/>
            <span>
                <label>Password: </label><br/>
                <input type="password" placeholder="Enter password here ..."
                required onChange={e => setPassword(e.target.value)} />
            </span>
            <br/><br/>
            <span>
                <button type="submit">Log in</button>
            </span>
        </form>
    );
}