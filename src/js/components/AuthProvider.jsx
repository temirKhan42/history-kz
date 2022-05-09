import React from 'react';
import AuthContext from '../context/index.jsx';

export default function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);

  const signin = (callback) => {
    const newUser = JSON.parse(localStorage.getItem('userId'));
    console.log(newUser);
    setUser(newUser);
    callback();
  };

  const signout = (callback) => {
    localStorage.removeItem('userId');
    setUser(null);
    callback();
  };

  const isAuthenticated = () => user !== null;

  const getValue = () => ({
    user,
    isAuthenticated,
    signin,
    signout,
  });

  return <AuthContext.Provider value={getValue()}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = React.Node;
