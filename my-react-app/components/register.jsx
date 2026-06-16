import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register(props) {
    

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [timezone, setTimezone] = useState('UTC');
    const [language, setLanguage] = useState('Slovenski');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const navigate = useNavigate();

    const redirect = async(e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    username, 
                    email, 
                    password, 
                    timezone, 
                    language}),
            });

            const data = await response.json();
                
            if (response.ok && data.success) {
                setSuccess("Registration complete. Redirecting...");

                setUsername('');
                setEmail('');
                setPassword('');
                setTimezone('UTC');
                setLanguage('Slovenski');

                setTimeout(() => {
                    navigate('/');
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
            <h1><b>Registration</b></h1>
            <br/>
            <span>
                <label>Username: </label><br/>
                <input type="text" placeholder="Enter username here ..."
                required onChange={e => setUsername(e.target.value)} />
            </span>
            <br/><br/>
            <span>
                <label>E-mail: </label><br/>
                <input type="email" placeholder="Enter e-mail here ..."
                required onChange={e => setEmail(e.target.value)} />
            </span>
            <br/><br/>
            <span>
                <label>Password: </label><br/>
                <input type="password" placeholder="Enter password here ..."
                required onChange={e => setPassword(e.target.value)} />
            </span>
            <br/><br/>
            <span>
                <label>Timezone: </label><br/>
                <select required onChange={e => setTimezone(e.target.value)}>
                    <option value="UTC">UTC</option>
                    <option value="EST">EST</option>
                </select>
            </span>
            <br/><br/>
            <span>
                <label>Language: </label><br/>
                <select required onChange={e => setLanguage(e.target.value)}>
                    <option value="Slovenski">Slovenski</option>
                    <option value="English">English</option>
                </select>
            </span>
            <br/><br/>
            <span>
                <button type="submit">Sign Up</button>
            </span>
            <br/>
            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
        </form>
    );
}