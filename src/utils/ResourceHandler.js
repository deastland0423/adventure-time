import axios from 'axios';
import AppConfig from '../config';

class ResourceHandler {
  constructor(resourceDef) {
    this.resourceDef = resourceDef;
  }

  getLabel(record) {
    // If there's a callback defined, use that.
    if ('getLabel' in this.resourceDef && this.resourceDef.getLabel) {
      return this.resourceDef.getLabel(record);
    }
    // Otherwise just use the label field
    else {
      return record[this.resourceDef.label_field];
    }
  }

  callApi(endpoint, queryParams = {}) {
    //TODO: all the validations
    let url = `${AppConfig.backend_host}${this.resourceDef.endpoints[endpoint]}`;
    const qs = Object.keys(queryParams).map(
      key => {
        let val;
        if (queryParams[key] === null) {
          val = '';
        } else {
          val = queryParams[key];
        }
        return `${key}=${val}`;
      }
    ).join('&');
    if (qs !== "") {
      url += '?'+qs;
    }
    console.log(`DEBUG: ResourceHandler(${this.resourceDef.resource_type}.callAPI(${endpoint}) - url: ${url}`);
    return axios.get(url);
  }
}

export default ResourceHandler;
