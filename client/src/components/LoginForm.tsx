import React, {useState} from 'react';
import api from '../services/api';

import {useNavigate} from 'react-router-dom';
import {LoginRequest} from '../types/auth';

const LoginForm = () =>{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data: LoginRequest = {username,password};
        try {
            const response = await api.post('/auth/login',data);
            localStorage.setItem('token', response.data.token);
            navigate('/home');
        } catch (error) {
            setError('Login failed.');
        }

    };


    return (<div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
        <input 
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        />
        <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        />
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
        </form>
        <a href="/register">register</a>
    </div>);
};

export default LoginForm;