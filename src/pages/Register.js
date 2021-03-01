import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [redirect, setRedirect] = useState(false);

    const submit = async (e) => {
        e.preventDefault();

        const url = 'https://xlxp3abvkg.execute-api.us-east-1.amazonaws.com/dev/users';
        const payload = {
            username: name,
            email_address: email,
            password: password
        };

        try {
            await axios.post(url, payload);
            setRedirect(true);
            
        } catch (err) {
            alert("Error registering user: ", err);
        }

    }

    if (redirect) {
        return <Redirect to="/login" />
    }

    return(
        <div className="form-signin">
            <form onSubmit={submit}>
                <h1 className="h3 mb-3 fw-normal">Please Register</h1>

                <input className="form-control" placeholder="Name" required onChange={e => setName(e.target.value)} />

                <input type="email" className="form-control" placeholder="Email address" required onChange={e => setEmail(e.target.value)} />

                <input type="password" className="form-control" placeholder="Password" required onChange={e => setPassword(e.target.value)}/>

                <button className="w-100 btn btn-lg btn-primary" type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Register;