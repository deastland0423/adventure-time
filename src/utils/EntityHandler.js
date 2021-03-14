import axios from 'axios';
import AppConfig from '../config';


class EntityHandler {
    constructor(entityDef) {
        this.entityDef = entityDef;
    }

    callApi(endpoint, queryParams = {}) {
        //TODO: all the validations
        let url = `${AppConfig.backend_host}${this.entityDef.endpoints[endpoint]}`;
        const qs = Object.keys(queryParams).map(key => `${key}=${queryParams[key]}`).join('&');
        if (qs !== "") {
            url += '?'+qs;
        }
        console.log(`DEBUG: EntityHandler(${this.entityDef.entity_type}.callAPI(${endpoint}) - url: ${url}`);
        return axios.get(url);
    }
}

export default EntityHandler;
