const axios = require('axios')

/**
 * generic API class
 * 
 * Simple use case :
 * 
 * const myApi = new API({ url:'https://le-kiff.bastiencornier.com/wp-json/v1' })
 * myApi.createEntity({ name: 'chapters' })
 * myApi.endpoints.chapters.getAll()
 *  
 */
class API {

  constructor({ url }){
    this.url = url
    this.endpoints = {}
  }
  /**
   * Create and store a single entity's endpoints
   * @param {A entity Object} entity
   */
  createEntity(entity) {
    this.endpoints[entity.name] = this.createEndpoints(entity)
  }

  createEntities(arrayOfEntity) {
    arrayOfEntity.forEach(this.createEntity.bind(this))
  }

  /**
   * Create the basic endpoints handlers for operations
   * @param {A entity Object} entity
   */
  createEndpoints( { name } ) {
    var endpoints = {}

    const resourceURL = `${this.url}/${name}`

    endpoints.getAll = (config={} ) => axios.get(resourceURL, config)

    endpoints.find = ({ id }, config={}) =>  axios.get(`${resourceURL}/${id}`, config)

    endpoints.create = (toCreate, config={}) =>  axios.post(resourceURL, toCreate, config)

    endpoints.update = (toUpdate, config={}) => axios.put(`${resourceURL}/${toUpdate.id}`, toUpdate, config)

    endpoints.patch  = ({id}, toPatch, config={}) => axios.patch(`${resourceURL}/${id}`, toPatch, config)

    endpoints.delete = ({ id }, config={}) => axios.delete(`${resourceURL}/${id}`, config)

    // from ancestors
    endpoints.getAllFromAncestor = ({ ancestorName, ancestorId }, config={} ) => axios.get(`${this.url}/${ancestorName}/${ancestorId}/${name}`, config);

    return endpoints
  }

}

export default API