import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Register from "./register";

export default function ResetPassword(props) {
    

    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    
    const navigate = useNavigate();

    const redirect = async(e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/resetPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newPassword,username }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                navigate('/');
            } else {
                setError(data.message || 'Sprememba ni uspela');
            }
        } catch (error) {
            console.error('Napaka pri povezavi:', error);
            setError('Težava s povezavo do strežnika.');
        }
    }

    return (
        <form className="login" onSubmit={redirect}>
            <h1><b>Change Password</b></h1>
            <br/>
            <span>
                <label>Username: </label><br/>
                <input type="text" placeholder="Enter username here ..."
                required onChange={e => setUsername(e.target.value)} />
            </span>
            <br/><br/>
            <span>
                <label>New Password: </label><br/>
                <input type="password" placeholder="Enter new password here ..."
                required onChange={e => setNewPassword(e.target.value)} />
            </span>
            <br/><br/>
            <span>
                <button type="submit">Change password</button><br/>
                <Link to="/">Return to Log In</Link>
            </span>
            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
        </form>
    );
}