import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/index.js';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPath } from '../slices/userSlice.js';
import { refreshState } from '../slices/bookSlice.js';

export default function Header() {
  const dispatch = useDispatch();
  const { currentPath, isTesting } = useSelector((state) => state.user);

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
    auth.signout(() => {
      dispatch(refreshState());
      navigate('/app/login');
    });
  };

  return (
    <div>
      <header>
        <nav>
          <div>Logo</div>
          {
            auth?.user?.username && !isTesting ?
              (<button type="button" onClick={handleClick}>
                {auth?.user?.username}
              </button>) : null
          }
          {
            isMenuOpened && !isTesting ? 
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
