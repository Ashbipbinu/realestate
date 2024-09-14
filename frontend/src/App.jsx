import Home from "./pages/Home";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import PrivateRoute from "./components/PrivateRoute";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreateLisitng from "./pages/CreateLisitng";
import Header from "./components/Header";

function App() {
  return (

      <BrowserRouter>
        {/* search bar should only be seen once the user is authenticated */}

        <Routes>
          <Route element={<PrivateRoute />}>
            <Route element={<Header />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/create-list" element={<CreateLisitng />} />
            </Route>
          </Route>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>

  );
}

export default App;
