import React from "react";
import AuthContext from '../context/index.jsx';

export default function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);

  const signin = (callback) => {
    const newUser = JSON.parse(localStorage.getItem('userId'));
    setUser(newUser);
    callback();
  };

  const signout = (callback) => {
    localStorage.removeItem('userId');
    setUser(null);
    callback();
  };

  const isAuthenticated = () => {
    return user !== null;
  }

  const value = { user, signin, signout, isAuthenticated };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
