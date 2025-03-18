import axios from 'axios';
import { adminAxios } from '../../../utils/config';
import { base_url } from '../../../utils/base_url';

// Base URLs for different user types
const API_BASE_URL = `${base_url}/api`;
const SALESMAN_API = `${API_BASE_URL}/salesmen`;

// Register user
const getAllSalesman = async () => {
    // const response = await axios.post(`${SALESMAN_API}/all-salesman`);
    const response = await adminAxios.get(`${SALESMAN_API}/all-salesman`);
    // console.log("response" , response)
    return response.data;
};


const userService = {
    getAllSalesman
}

export default userService;