import axios from 'axios';
import AppConfig from '../config';


class EntityHandler {
    constructor(entityDef) {
        this.entityDef = entityDef;
    }

    getLabel(record) {
        // If there's a callback defined, use that.
        if ('getLabel' in this.entityDef && this.entityDef.getLabel) {
            return this.entityDef.getLabel(record);
        }
        // Otherwise just use the label field
        else {
            return record[this.entityDef.label_field];
        }
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
