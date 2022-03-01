import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {  
  const { currentPath } = useSelector((state) => state.pathReducer);

  return (
    <div>
      <header>
        <div>Logo</div>
        {
          currentPath === '/login' || currentPath === '/signin' ?  
            null :
            (<button type="button">Button</button>)
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
