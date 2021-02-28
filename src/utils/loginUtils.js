import axios from 'axios';
import AppConfig from '../config';

const doLogin = async (email_address, password) => {

    const body = {
        email_address: email_address,
        password: password
    }

    const url = `${AppConfig.backend_host}/login`;
    
    axios
        .post(url, body)
        .then( response => {
            // response logic
        })
        .catch( error => {
            // error logic
        });

}