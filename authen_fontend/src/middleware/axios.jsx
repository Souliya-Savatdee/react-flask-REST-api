import axios from "axios"; // Import Axios


const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:5000/', // Your API base URL
  headers: {
    'Content-Type': 'application/json',
    
  },
  withCredentials: true
});

export default axiosInstance;