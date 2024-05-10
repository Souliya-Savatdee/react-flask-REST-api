import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import RequireAuth from "./require/RequestAuth";

import NavBar from "./components/nevbar";
import Persist from "./components/persistent";

import NotFoundPage from "./pages/NotFoundpage";
import HomePage from "./pages/Home";
import SignUpPage from "./pages/SignUp";
import CreateRecipePage from "./pages/CreateRecipe";
import LoginPage from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";

function App() {
  return (
    <Router>
      <div className="">
        <NavBar />
        <Routes>
          <Route path="/signup" element={<SignUpPage />}></Route>
          <Route element={<Persist />}>
            <Route exact path="/" element={<HomePage />}></Route>
            <Route element={<RequireAuth />}>
              <Route
                path="/create_recipe"
                element={<CreateRecipePage />}
              ></Route>
            </Route>
          </Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
