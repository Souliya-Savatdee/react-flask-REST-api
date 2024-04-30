import { createAuthProvider } from "react-token-auth";

export const { useAuth, authFetch, login, logout } = createAuthProvider({
  getAccessToken: (session) => session.accessToken,
  storageKey: "access_token",
  storage: localStorage,
  onUpdateToken: (token) =>
    fetch("http://127.0.0.1:5000/auth/token/refresh", {
      method: "POST",
      body: token.refresh_token,
    }).then((r) => r.json()),
});

// import axios from "axios";
// import { createAuthProvider } from "react-token-auth";

// const axiosInstance = axios.create({
//   baseURL: "/auth", // Assuming '/auth' is the base URL for your token refresh endpoint
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export const { useAuth, authFetch, login, logout } = createAuthProvider({
//   accessTokenKey: "access_token",
//   onUpdateToken: (token) => {
//     return axiosInstance
//       .post("/token/refresh", {
//         refresh_token: token.refresh_token,
//       })
//       .then((response) => {
//         const { access_token, refresh_token } = response.data;
//         return { access_token, refresh_token };
//       })
//       .catch((error) => {
//         console.error("Token refresh failed:", error);
//         throw error;
//       });
//   },
// });
