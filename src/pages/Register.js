import React, { useState } from 'react';

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        console.log({
            name,
            email,
            password
        });

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