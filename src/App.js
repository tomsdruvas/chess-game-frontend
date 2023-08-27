import React from "react";
import './App.css';
import { Login } from "./Login"
import { Register } from "./Register"
import {Route, Routes} from "react-router-dom";
import {Chessboard} from "./Chessboard";

function App() {
  return (
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="chessboard" element={<Chessboard />} />
      </Routes>
  );
}

export default App;
