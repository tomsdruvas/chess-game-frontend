import React from "react";
import './App.css';
import {Login} from "./components/Login"
import {Register} from "./components/Register"
import {Route, Routes} from "react-router-dom";
import {Chessboard} from "./components/chessboard/Chessboard";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";

const ROLES = {
    User: "User"
}

function App() {
    return (
        <Routes>
            <Route path="login" element={<Login/>}/>
            <Route path="register" element={<Register/>}/>
            <Route element={<PersistLogin />}>

                <Route element={<RequireAuth allowedRoles={[ROLES.User]}/>}>
                    <Route path="chessboard" element={<Chessboard/>}/>
                </Route>
            </Route>

        </Routes>
    );
}

export default App;
