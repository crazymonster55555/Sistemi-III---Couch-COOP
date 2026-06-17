import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Register from "./register";

export default function Login(props) {
    

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const navigate = useNavigate();

    const redirect = async(e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            let z;

            if (response.ok && data.success) {
                //console.log("x: ", data.userID);
                localStorage.setItem('username', username);
                localStorage.setItem('userID', data.userID);
                //console.log("z: ", localStorage.getItem('userID'));
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
                <button type="submit">Log In</button>
            </span>
            <br/>   
            <Link to="/register">Sign Up</Link><br/>
            <Link to="/resetPassword">Reset Password</Link>
            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
        </form>
    );
}