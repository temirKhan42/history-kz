import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/index.js';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPath } from '../slices/userSlice.js';
import { refreshState, setCurrentChapter, fetchData } from '../slices/bookSlice.js';

import { useFormik } from 'formik';
import axios from 'axios';
import routes from '../routes/index.js';

import List from './SummaryList';

const Logo = () => {
  return (
    <div className="logo">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="76.55px"
        height="30px"
        viewBox="0 0 147.992 57.810"
        version="1.1"
        id="svg8"
      >
        <defs id="defs2" />
        <g
          id="layer1"
          transform="translate(-31.243726,-109.36926)">
          <text
            style={{
              fontStyle:"normal",
              fontWeight:"normal",
              fontSize:"10.5833px",
              lineHeight:1.25,
              fontFamily:"sans-serif",
              fill:"#000000",
              fillOpacity:1,
              stroke:"none",
              strokeWidth:0.264583
            }}
            x="1953.2057"
            y="1376.9725"
            id="text1812"><tspan
              id="tspan1810"
              x="1953.2057"
              y="1376.9725"
              style={{strokeWidth:0.264583}} /><tspan
              x="1953.2057"
              y="1390.2017"
              style={{strokeWidth:0.264583}}
              id="tspan1814" /></text>
          <path
            id="rect554"
            style={{
              fontVariationSettings:"normal",
              opacity:1,
              vectorEffect:"none",
              fill: "#000",
              fillOpacity:1,
              fillRule:"evenodd",
              stroke:"none",
              strokeWidth:0,
              strokeLinecap:"butt",
              strokeLinejoin:"miter",
              strokeMiterLimit:4,
              strokeDasharray:"none",
              strokeDashoffset:0,
              strokeOpacity:1,
              stopColor: "#000",
              stopOpacity:1
            }}
            d="m 47.249084,143.97333 c -20.253173,-1.1476 -20.774363,-32.09497 -1.06772,-34.50535 l 16.58049,-0.0662 c -3.81538,3.55743 -5.69785,7.25452 -0.4615,11.515 l -14.30584,0.0137 c -7.6765,1.25306 -6.44007,11.077 -0.3876,11.54605 l 27.34295,0.1939 c 20.855341,2.9691 21.590961,28.7766 1.58826,34.4886 -13.14204,-0.042 -27.70831,-0.1937 -40.85023,-0.1458 -8.260453,-4.0035 -3.094433,-11.383 0.24548,-11.2433 l 40.15998,-0.4888 c 3.43738,-1.3466 5.85242,-8.1652 0.035,-11.2795 z"
          />
          <path
            id="rect559"
            style={{
              fontVariationSettings:"normal",
              opacity:1,
              vectorEffect:"none",
              fill:"#000",
              fillOpacity:1,
              fillRule:"evenodd",
              stroke:"none",
              strokeWidth:0,
              strokeLinecap:"butt",
              strokeLinejoin:"miter",
              strokeMiterlimit:4,
              strokeDasharray:"none",
              strokeDashoffset:0,
              strokeOpacity:1,
              stopColor:"#000",
              stopOpacity:1
            }}
            d="m 67.761144,109.39466 h 40.806076 c 20.55968,4.52017 25.19424,20.12275 24.69128,32.59057 7.58052,24.2148 34.32494,11.6144 34.57281,-1.6311 l 0.19288,-26.18553 c -0.14995,-5.18491 10.23822,-7.41483 11.01296,-0.22752 l 0.19932,28.93265 c -3.40577,12.6899 -9.85835,22.5769 -25.72756,23.8562 -12.35157,0.9636 -20.15413,-3.8853 -26.1738,-11.0124 -5.29768,6.4152 -11.72348,10.104 -19.14114,11.3959 l -23.670195,0.066 c 4.39335,-3.4447 8.60186,-6.9525 9.44389,-11.6102 l 13.755635,0.035 c 19.50749,-6.373 17.7949,-29.24531 -0.27514,-34.58872 L 67.761144,120.883 c -7.96003,-0.64592 -5.70447,-11.46492 0,-11.48895 z"
          />
          <ellipse
            style={{
              opacity:1,
              fill:"#000",
              fillOpacity:1,
              fillRule:"evenodd",
              stroke:"#000",
              strokeWidth:0.209105
            }}
            id="path562"
            cx="109.64476"
            cy="138.14561"
            rx="8.9905872"
            ry="9.1311369" />
          <path
            id="rect564"
            style={{
              fontVariationSettings:"normal",
              opacity:1,
              vectorEffect:"none",
              fill:"#000",
              fillOpacity:1,
              fillRule:"evenodd",
              stroke:"none",
              strokeWidth:0,
              strokeLinecap:"butt",
              strokeLinejoin:"miter",
              strokeMiterlimit:4,
              strokeDasharray:"none",
              strokeDashoffset:0,
              strokeOpacity:1,
              stopColor:"#000",
              stopOpacity:1
            }}
            d="m 144.93057,120.11893 c 3.65336,-1.3752 7.14628,-3.59846 10.1846,-8.22459 l 1.06502,1.55018 0.0549,26.12031 c -2.19545,6.0485 -10.71377,4.0699 -11.23826,-0.033 z"
          />
          <path
            id="rect568"
            style={{
              fontVariationSettings:"normal",
              opacity:1,
              vectorEffect:"none",
              fill:"#000",
              fillOpacity:1,
              fillRule:"evenodd",
              stroke:"none",
              strokeWidth:0,
              strokeLinecap:"butt",
              strokeLinejoin:"miter",
              strokeMiterlimit:4,
              strokeDasharray:"none",
              strokeDashoffset:0,
              strokeOpacity:1,
              stopColor:"#000",
              stopOpacity:1
            }}
            d="m 133.46989,113.24219 -0.0586,10.28403 c -2.47295,-4.7409 -5.69933,-8.64488 -10.18872,-11.86346 2.66771,-2.45218 7.14283,-4.18954 10.24734,1.57943 z"
          />
        </g>
      </svg>

    </div>
  );
};

const getData = async (option) => {
  const { data } = await axios.post(routes.login(), option);
  return data;
};

const DropdownLogin = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [isRequestSuccess, setIsRequestSuccess] = useState(true);
  const [isUnauthorizedErr, setIsUnauthorizedErr] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const data = await getData(values);
        localStorage.setItem('userId', JSON.stringify(data));
        auth.signin(() => {
          navigate('/app/home');
        });
      } catch (err) {
        resetForm({ values: '' });
        if (err.response.status === 401) {
          setIsUnauthorizedErr(true);
        } else {
          setIsRequestSuccess(false);
        }
      }
    },
  });

  return (
    <div className="dropdown">
      <button type="button" className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
        Войти
      </button>
      <form className="dropdown-menu p-4" onSubmit={formik.handleSubmit}>
        <div className="mb-3">
          <label htmlFor="exampleDropdownFormEmail2" className="form-label">Email address</label>
          <input 
            type="email"
            name="email"
            required
            className="form-control" 
            id="exampleDropdownFormEmail2" 
            placeholder="email@example.com" 
            onChange={formik.handleChange}
            value={formik.values.email}
            disabled={formik.isSubmitting}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleDropdownFormPassword2" className="form-label">Password</label>
          <input 
            type="password" 
            name="password"
            required
            className="form-control" 
            id="exampleDropdownFormPassword2" 
            placeholder="Password" 
            onChange={formik.handleChange}
            value={formik.values.password}
            disabled={formik.isSubmitting}
          />
        </div>

        {isUnauthorizedErr ? (
          <div className='errMessage'>Не верный логин или пороль</div>
        ) : null}
        {isRequestSuccess ? null : (
          <div className='errMessage'>Неизвестная ошибка, проверьте интернет соединение.</div>
        )}

        <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>Войти</button>
        <div className="dropdown-divider"></div>
        <Link className="dropdown-item" to="/app/signin">Регистрация</Link>
      </form>
    </div>
  )
}

export default function Header() {
  const dispatch = useDispatch();
  const { currentPath, isTesting } = useSelector((state) => state.user);
  const {
    chapters,
    currentChapterId,
  } = useSelector((state) => state.book);

  const [isSearching, setIsSearching] = useState(false);
  const [searchList, setSearchList] = useState([]);

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
      navigate('/app/main');
    });
  };

  const handleSearchChange = (e) => {
    const newSearchList = chapters.filter(({ chapterName }) => {
      return chapterName.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1;
    });
    setSearchList(newSearchList.length <= 4 ? newSearchList : newSearchList.slice(0, 3));
    e.target.value === '' ? setIsSearching(false) : setIsSearching(true);
  }


  const handleShowChapter = (e) => {
    e.preventDefault();
    if (searchList.length === 0) {
      return;
    }

    const { id, chapterNum } = searchList[0]
    if (currentPath === '/app/home' && id !== currentChapterId) {
      dispatch(setCurrentChapter(id));
      dispatch(fetchData(chapterNum));
    } else if (currentPath === '/app/progress' && id !== currentChapterId) {
      dispatch(setCurrentChapter(id));
      dispatch(fetchData(chapterNum));
    }
    setIsSearching(false);
    setSearchList([]);
  };

  const handleSearchItemClick = (id, chapterNum) => (e) => {
    e.preventDefault();
    if (currentPath === '/app/home' && id !== currentChapterId) {
      dispatch(setCurrentChapter(id));
      dispatch(fetchData(chapterNum));
    } else if (currentPath === '/app/progress' && id !== currentChapterId) {
      dispatch(setCurrentChapter(id));
      dispatch(fetchData(chapterNum));
    }
    setIsSearching(false);
    setSearchList([]);
  };

  return (
    <div className='body w-100' id='header'>
      <div className='text-bg-light sticky-top'>
      <div className='navBox p-3'> 
        <nav className="navbar navbar-expand-lg bg-light">
          <div className="container-fluid" id="navbarSupportedContent">
            <div className='logoBox'>
              <Logo />
            </div>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            {
              currentPath !== '/app/main' && currentPath !== '/app/signin' && !isTesting ?
              (
                <>
                <div className="d-flex">
                  {
                    currentPath === '/app/home' || currentPath === '/app/progress' ?
                    <ul className="navbar-nav">
                      <li className="nav-item dropdown me-3">
                        <a className="nav-link dropdown-toggle" href="#offcanvasExample" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="offcanvas" aria-controls="offcanvasExample">
                          Содержание
                        </a>
                      </li>
                      <li className='me-3'>
                      <form className="position-relative" role="search">
                        <div className="d-flex">
                          <input onChange={handleSearchChange} className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                          <button onClick={handleShowChapter} className="btn btn-outline-success" type="submit">Искать</button>
                        </div>
                        {
                          isSearching && searchList.length > 0 ?
                          <div className="list-group position-absolute">
                            {
                              searchList.map((item, idx) => {
                                return (
                                  <a
                                    href="#"
                                    className="list-group-item list-group-item-action" 
                                    key={`${item?.chapterName?.slice(0, 7)}-${idx}`}
                                    onClick={handleSearchItemClick(item?.id, item?.chapterNum)}
                                  >
                                    {item.chapterName}
                                  </a>
                                );
                              })
                            }
                          </div> : null
                        }
                      </form>
                      </li>
                    </ul> : null
                  }
                  <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                      <Link className="nav-link active" aria-current="page" to="/app/home">Главная</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/app/progress">Прогресс</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/app/settings">Настройки</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link " to="#" onClick={handleExitClick}>Выход</Link>
                    </li>
                  </ul>
                </div>
                </> 
              ) : null
            }
            {
              currentPath === '/app/main' && currentPath !== '/app/signin' ? <DropdownLogin /> : null
            }
          </div>
        </nav>  
      </div>
      </div>

      <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasExampleLabel">Содержание</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <ul className="list-group list-group-flush">
            {chapters.length === 0 ? null : <List />}
          </ul>
        </div>
      </div>
      <Outlet />
    </div>
  );
}



