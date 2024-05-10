import { axiosPrivate } from "../middleware/axios";
import useAuth from "../hooks/useAuth";
// import { useNavigate, useLocation } from "react-router-dom";

const useRefreshToken = () => {
  const { setAuth, logout } = useAuth();
  //   const navigate = useNavigate();
  //   const location = useLocation();
  const refresh_token = localStorage.getItem("refresh_token") || "";

  const refresh = async () => {
    try {
      //If use post method must add null in axios  const response = await axios.get("auth/token/refresh",null {
      const response = await axiosPrivate.get("auth/token/refresh", {
        headers: {
          Authorization: `Bearer ${JSON.parse(refresh_token)}`,
        },
      });
      const newAccess_Token = response.data.access_token;

      setAuth((prev) => {
        console.log(JSON.stringify(prev)); // display previous response token
        console.log(newAccess_Token);

        return { ...prev, access_token: newAccess_Token };
      });

      return newAccess_Token;
    } catch (error) {
      //Function if refresh_token is expired
      if (error.response.data.msg === "Token has expired") {
        console.log("Token refresh failed. Redirecting to login...");

        alert("Token expired"); //TODO: If don't want to alert, Can use code form the Video (YT: Dave Gray) and remove everything

        //reset all localstorage and context
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        logout();

        console.clear();
        navigate("/login", { state: { from: location }, replace: true }); //!: do not import library. make it error (Now it is working!! don't touch this)
        return;
      } else {
        console.error("Error refreshing token:", error);
      }
    }
  };
  return refresh;
};

export default useRefreshToken;
