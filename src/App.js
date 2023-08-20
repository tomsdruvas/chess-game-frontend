import React, { useState } from "react";
import './App.css';
import { Login } from "./Login"
import { Register } from "./Register"

function App() {
  const [currentForm, setCurrentForm] = useState("login");

  const switchForm = (form) => {
    setCurrentForm(form);
  }

  return (
    <div className="App">
      {
        currentForm === "login" ? <Login onFormSwitch={switchForm}/> : <Register onFormSwitch={switchForm}/>
      }
    </div>
  );
}

export default App;
