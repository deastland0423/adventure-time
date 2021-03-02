import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import AppConfig from '../config';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");  
    const [redirect, setRedirect] = useState(false);
    
    const submit = async (e) => {
        e.preventDefault();


        const url = `${AppConfig.backend_host}/login`;//'https://xlxp3abvkg.execute-api.us-east-1.amazonaws.com/dev/login';
        const config = {
            method: 'post',
            url: url,
            data: {
                email_address: email,
                password: password
            },
            withCredentials: true
        }

        try {
            const response = await axios(config);
            console.log('Response: ', response.data);
            setRedirect(true);
        } catch (err) {
            alert("Bad signin attempt: ", err);
        }        
    }

    if(redirect) {
        return <Redirect to="/" />
    }
    
    return (
        <div className="form-signin" onSubmit={submit} >
            <form>
                <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
                <input type="email" className="form-control" placeholder="Email address" required onChange={e => setEmail(e.target.value)} />

                <input type="password" className="form-control" placeholder="Password" required onChange={e => setPassword(e.target.value)} />

                <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
            </form>
        </div>
    );
};

export default Login;