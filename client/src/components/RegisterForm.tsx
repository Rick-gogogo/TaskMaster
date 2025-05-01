import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import {RegisterRequest} from '../types/auth';

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data: RegisterRequest  = {username,password};
        try{
            const response = await api.post('/auth/register', data);
            alert('Registration successful!');
            navigate('/login');
        }catch(err:any){
            if(err.response){
                console.error('Error response:',err.response.data);
                setError(err.response.data);
            }else{
                console.error('Error:',err.message);
                setError('Registration failed');
            }
          
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" value={username} onChange={
                    (e) => setUsername(e.target.value)
                } />
                <input 
                type = "password"
                placeholder="Password"
                value={password}
                onChange={
                    (e) => setPassword(e.target.value)
                }
                />
                <button type="submit">Submit</button>
                {error && <p>{error}</p>}
                </form>
                <a href="/login">Login</a>
        </div>
    );
};

export default RegisterForm;
