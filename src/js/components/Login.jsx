import React, { useEffect } from 'react';
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

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      try {
        const data = await getData(values);
        localStorage.setItem('userId', JSON.stringify(data));
        auth.signin(() => {
          navigate('/app/home');
        });
      } catch (err) {
        console.log(err);
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
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        <button type="submit">Войти</button>
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
