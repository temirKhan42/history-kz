import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import {
  useNavigate,
  Link,
} from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCurrentPath } from '../slices/pathSlice.js';

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
    <div>
      <h3>Войти</h3>
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          onChange={formik.handleChange}
          value={formik.values.email}
          disabled={formik.isSubmitting}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          onChange={formik.handleChange}
          value={formik.values.password}
          disabled={formik.isSubmitting}
        />
        {isUnauthorizedErr ? (
          <div>Не верный логин или пороль</div>
        ) : null}
        {isRequestSuccess ? null : (
          <div>Неизвестная ошибка, проверьте интернет соединение.</div>
        )}

        <button type="submit" disabled={formik.isSubmitting}>Войти</button>
      </form>
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
      <main>
        {LoginForm()}
        <Link to="/app/signin">Регистрация</Link>
      </main>
      <Footer />
    </>
  );
}
