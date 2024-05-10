import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";


const Persist = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refreshToken = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const verifyRefreshToken = async () => {
      try {
        await refreshToken();
      } catch (error) {
        console.log(error);
        console.log("Token is expired or Don't have token. Please try again");
      } finally {
        isMounted && setIsLoading(false);
      }
      return () => {
        isMounted = false;
      }
    };
    

    !auth?.access_token ? verifyRefreshToken() : setIsLoading(false);
  }, []);

  useEffect(() => {
    console.log(`isLoading: ${isLoading}`);
    console.log(`at : ${JSON.stringify(auth?.access_token)}`);
  }, [isLoading]);

  return <>{isLoading ? <p>Loading...</p> : <Outlet />}</>;
};

export default Persist