import Axios from 'axios'
import {URL} from '../../config'
 Axios.defaults.baseURL = `${URL}`;
export const login = (data) => {
    return {
        type:'LOGIN',
        payload: Axios.post(`/user/login`, data)
    }
}

export const register = (data) => {
    return {
      type:'REGISTER',
      payload: Axios.post(`/user/register`, data)
    }
}

export const getProfile = (headers) => {
    return {
      type:'GET_PROFILE',
      payload: Axios.get(`/user/profile`,{
          headers:headers
        }
      )
    }
}
