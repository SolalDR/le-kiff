const axios = require('axios');

/**
 * generic Api class
 *  
 */
class Api {

  constructor({ url }){
    this.url = url;
  }

  get(uri, config={}) {
    return axios.get(`${this.url}/${uri}`, config);
  }

  post(uri, toCreate, config={}) {
    return axios.post(`${this.url}/${uri}`, toCreate, config);
  }

  update(uri, toUpdate, config={}) {
    return axios.put(`${this.url}/${uri}`, toUpdate, config);
  }

  patch(uri, toPatch, config={}) {
    return axios.patch(`${this.url}/${uri}`, toPatch, config);
  }

  delete(uri, config={}) {
    return axios.delete(`${this.url}/${uri}`, config);
  }

  patch(uri, toPatch, config={}) {
    return axios.patch(`${this.url}/${uri}`, toPatch, config);
  }

  delete(uri, config={}) {
    return axios.delete(`${this.url}/${uri}`, config);
  }

}

export default Api
