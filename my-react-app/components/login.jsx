import { useState, useNavigate } from "react";


export default function Login(props) {
    

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [logedIn, setLogedIn] = useState(false);
    
    const redirect = (e) => {
        e.preventDefault();
        window.location.replace('/dashboard');
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
                <button type="submit">Log in</button>
            </span>
        </form>
    );
}