import { axiosPrivate } from "../middleware/axios";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";

const useAxiosIntereptor = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    
    //requestIntercept
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.access_token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    //responseIntercept
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;

        //isRefreshing use for protect loop error 401
        if (error?.response?.status === 401 && !isRefreshing) {
          setIsRefreshing(true);
          
          //get new access_token
          const newAccess_Token = await refresh();

          // if (!newAccess_Token) {
          //   localStorage.removeItem("access_token");
          //   localStorage.removeItem("refresh_token");
          //   navigate("/login", { state: { from: location }, replace: true });
          // }

          prevRequest.headers["Authorization"] = `Bearer ${newAccess_Token}`;
          localStorage.setItem("access_token", `"${newAccess_Token}"`);
          setIsRefreshing(false);

          return axiosPrivate(prevRequest);
        }
        // if (error?.response?.status === 422 && !isRefreshing) {
        //   setIsRefreshing(true);
        //   localStorage.removeItem("access_token");
        //   localStorage.removeItem("refresh_token");
        //   navigate("/login", { state: { from: location }, replace: true });
        //   setIsRefreshing(false);
        // }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh, isRefreshing]);

  return axiosPrivate;
};

export default useAxiosIntereptor;
