import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/index.js';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPath } from '../slices/userSlice.js';
import { refreshState } from '../slices/bookSlice.js';
import logo from '../../../images/logo.svg';

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
    <div className='body'>
      <header className="header">
        <div className='box flex jc-sb ai-c'>
          <div className='logoBox'>
            <img src={logo} alt="logo" className='logo' />
          </div>
          <nav className='navBar' onMouseEnter={handleClick} onMouseLeave={handleClick}>
            {
              auth?.user?.username && !isTesting ?
                (<button type="button" className="menuButton">
                  {auth?.user?.username}
                </button>) : null
            }
            {
              isMenuOpened && !isTesting ? 
              (
                <div className="menu">
                  <ul>
                    <li><Link to="/app/home">Home</Link></li>
                    <li><Link to="/app/progress">My progress</Link></li>
                    <li><Link to="/app/settings">Settings</Link></li>
                    <li><Link to="#" onClick={handleExitClick}>Exit</Link></li>
                  </ul>
                </div>
              ) :
              null
            }
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
