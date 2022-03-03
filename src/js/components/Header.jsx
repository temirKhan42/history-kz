import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/index.js';
import { useDispatch } from 'react-redux';
import { setCurrentPath } from '../slices/pathSlice.js';


export default function Header() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setCurrentPath(window.location.pathname));
  }, []);

  const navigate = useNavigate();

  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const auth = useAuth();

  const handleClick = (e) => {
    setIsMenuOpened(!isMenuOpened);
  };

  const handleExitClick = (e) => {
    e.preventDefault();
    setIsMenuOpened(false);
    auth.signout(() => navigate('/app/login'));
  };

  return (
    <div>
      <header>
        <nav>
          <div>Logo</div>
          {
            auth?.user?.username ?
              (<button type="button" onClick={handleClick}>
                {auth?.user?.username}
              </button>) : null
          }
          {
            isMenuOpened ? 
            (
              <ul>
                <li><Link to="/app/home">Home</Link></li>
                <li><Link to="/app/progress">My progress</Link></li>
                <li><Link to="/app/settings">Settings</Link></li>
                <li><a onClick={handleExitClick}>Exit</a></li>
              </ul>
            ) :
            null
          }
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
