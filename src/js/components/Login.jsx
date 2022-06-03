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
    <div className='loginBox px-7'>
      <h2 className='h1 mb-5'>Войти</h2>
      <form onSubmit={formik.handleSubmit}>
        <div class="mb-3 row">
          <label className='col-sm-2 col-form-label' htmlFor="email">Email</label>
          <div class="col-sm-10">
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder='Email'
              onChange={formik.handleChange}
              value={formik.values.email}
              disabled={formik.isSubmitting}
              className="form-control"
            />
          </div>
        </div>

        <div class="mb-3 row">
          <label className='col-sm-2 col-form-label' htmlFor="password">Password</label>
          <div class="col-sm-10">
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder='Password'
              onChange={formik.handleChange}
              value={formik.values.password}
              disabled={formik.isSubmitting}
              className="form-control"
            />
          </div>
        </div>

        {isUnauthorizedErr ? (
          <div className='errMessage'>Не верный логин или пороль</div>
        ) : null}
        {isRequestSuccess ? null : (
          <div className='errMessage'>Неизвестная ошибка, проверьте интернет соединение.</div>
        )}

        <button type="button" className="btn btn-primary mb-3" type="submit" disabled={formik.isSubmitting}>Войти</button>
      </form>

      <Link className='btn btn-link' to="/app/signin">Регистрация</Link>
    </div>
  );
}

export default function Home() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setCurrentPath(window.location.pathname));
  }, []);

  return (
    <>
      <main className='loginMain row'>
        <img className='hero' src="../../../images/sduBack.jpg" alt="hero" />
        <div className='col'>
          <h1 className='text-uppercase h1'>Книга для подготовки к ент</h1>
        </div>
        <div className='col px-5'>
          {LoginForm()}
        </div>
      </main>
      <Footer />
    </>
  );
}
