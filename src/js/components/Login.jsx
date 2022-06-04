import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import {
  useNavigate,
  Link,
} from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCurrentPath } from '../slices/userSlice.js';

import useAuth from '../hooks/index.js';
import routes from '../routes/index.js';
import Footer from './Footer.jsx';

import img from '../../../images/sdu-back.js';

const getData = async (option) => {
  const { data } = await axios.post(routes.login(), option);
  return data;
};

function LoginForm() {
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
    <>
      <h2 className='h3 mb-4 text-white'>Войти</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-3 row">
          <label className='col-sm-2 col-form-label text-white' htmlFor="email">Email</label>
          <div className="col-sm-10">
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder='Email'
              onChange={formik.handleChange}
              value={formik.values.email}
              disabled={formik.isSubmitting}
              className="form-control form-control-sm"
            />
          </div>
        </div>

        <div className="mb-3 row">
          <label className='col-sm-2 col-form-label text-white' htmlFor="password">Password</label>
          <div className="col-sm-10">
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder='Password'
              onChange={formik.handleChange}
              value={formik.values.password}
              disabled={formik.isSubmitting}
              className="form-control form-control-sm"
            />
          </div>
        </div>

        {isUnauthorizedErr ? (
          <div className='errMessage'>Не верный логин или пороль</div>
        ) : null}
        {isRequestSuccess ? null : (
          <div className='errMessage'>Неизвестная ошибка, проверьте интернет соединение.</div>
        )}
        <div className="d-grid gap-1 col-4 mx-auto">
          <button type="submit" className="btn btn-primary mb-3" disabled={formik.isSubmitting}>Войти</button>
        </div>
      </form>

      <Link className='btn btn-link link-light' to="/app/signin">Регистрация</Link>
    </>
  );
}

export default function Home() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setCurrentPath(window.location.pathname));
  }, []);

  return (
    <>
      <main className='loginMain'>
        <div className='box mt-5 container mx-auto row vw-60'>  
          <img className='hero img-fluid' src={img} alt='hero' />
          <div className='boxCo container d-flex align-items-end'>            
            <div className='w-20 px-5 loginBox px-7 mx-auto'>
              {LoginForm()}
            </div>
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </>
  );
}
