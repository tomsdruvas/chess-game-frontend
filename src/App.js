import React from "react";
import './App.css';
import { Login } from "./components/Login"
import { Register } from "./components/Register"
import {Route, Routes} from "react-router-dom";
import {Chessboard} from "./components/chessboard/Chessboard";
import RequireAuth from "./components/RequireAuth";

const ROLES = {
    'User': 2001,
    'Editor': 1984,
    'Admin': 5150
}

function App() {
  return (
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        {/*<Route path="chessboard" element={<Chessboard />} />*/}

          <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
              <Route path="chessboard" element={<Chessboard />} />
          </Route>
      </Routes>
  );
}

export default App;
