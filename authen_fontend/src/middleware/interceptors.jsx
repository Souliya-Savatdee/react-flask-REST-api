import api from "../middleware/axios"

function setup () {
  
  api.interceptors.response.use(
    (response) => response,


    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const response = await axios.post('/auth/token/refresh', { refresh_token });
          const newAccessToken = response.data.access_token;
          // Update stored access_token with the newAccessToken
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // Redirect to login or handle refresh failure
        }
      }
      return Promise.reject(error);
    }
  );
}


  

export default setup
