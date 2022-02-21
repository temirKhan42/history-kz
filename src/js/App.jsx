import React from 'react';
import { Link, Outlet } from "react-router-dom";

export default function App() {
  return (
    <div>
      <header>
        <div>Logo</div>
        <button>Button</button>
        <nav>
          <Link to="/login">Login</Link> |{" "}
          <Link to="/signin">Signin</Link> |{" "}
          <Link to="/home">Home</Link> |{" "}
          <Link to="/settings">Settings</Link> |{" "}
          <Link to="/progress">Progress</Link> |{" "}
          <Link to="/test">Test</Link> |{" "}
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
