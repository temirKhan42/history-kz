import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import useAuth from '../hooks/index.js';

export default function Header() {  
  const auth = useAuth();

  return (
    <div>
      <header>
        <div>Logo</div>
          {
            auth?.user?.username ?
              (<button type="button">
                {auth?.user?.username}
              </button>) : null
          }
        <nav>
          <Link to="/login">Login</Link>
          {' '}
          |
          {' '}
          <Link to="/signin">Signin</Link>
          {' '}
          |
          {' '}
          <Link to="/home">Home</Link>
          {' '}
          |
          {' '}
          <Link to="/settings">Settings</Link>
          {' '}
          |
          {' '}
          <Link to="/progress">Progress</Link>
          {' '}
          |
          {' '}
          <Link to="/test">Test</Link>
          {' '}
          |
          {' '}
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
