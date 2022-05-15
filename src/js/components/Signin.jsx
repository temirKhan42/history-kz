import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import {
  useNavigate,
  Link,
} from 'react-router-dom';
import axios from 'axios';
import * as yup from 'yup';

import { useDispatch } from 'react-redux';
import { setCurrentPath } from '../slices/userSlice.js';
import useAuth from '../hooks/index.js';
import routes from '../routes/index.js';
import Footer from './Footer.jsx';


const getData = async (values) => {
  const { data } = await axios.post(routes.signup(), values);
  return data;
};

function SettingForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useAuth();

  const schema = yup.object().shape({
    username: yup.string()
      .min(3, 'minimum length of name shuld be 3 letters')
      .max(20, 'maximum length of name should be 20 letters')
      .required('the field should be written'),
    email: yup.string().email().required('the field should be written'),
    password: yup.string()
      .min(8, 'minimum length of the password should be 8 characters')
      .required('the field should be written'),
    passwordConfirm: yup.string()
      .required('the field should be written')
      .test(
        'is-match',
        'passwords doesn\'t mutches',
        (val, { parent }) => (val === parent.password),
      ),
  });

  const initialValues = {
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
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
    <div className='loginBox'>
      <h2 className='title'>Регистрация</h2>
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          required
          placeholder='Username'
          onChange={formik.handleChange}
          value={formik.values.username}
        />
        {formik.errors.username && formik.touched.username ? (
          <div className='errMessage'>{formik.errors.username}</div>
        ) : null}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder='Email'
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        {formik.errors.email && formik.touched.email ? (
          <div className='errMessage'>{formik.errors.email}</div>
        ) : null}

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder='Password'
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        {formik.errors.password && formik.touched.password ? (
          <div className='errMessage'>{formik.errors.password}</div>
        ) : null}

        <label htmlFor="passwordConfirm">Confirm password</label>
        <input
          id="passwordConfirm"
          name="passwordConfirm"
          type="password"
          required
          placeholder='Confirm password'
          onChange={formik.handleChange}
          value={formik.values.passwordConfirm}
        />
        {formik.errors.passwordConfirm && formik.touched.passwordConfirm ? (
          <div className='errMessage'>{formik.errors.passwordConfirm}</div>
        ) : null}

        <button className='loginBtn' type="submit">Зарегистрироваться</button>
      </form>

      <Link className='link' to="/app/login">Уже зарегистрирован</Link>
    </div>
  );
}

export default function Settings() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setCurrentPath(window.location.pathname));
  }, []);


  return (
    <>
      <main>
        {SettingForm()}
      </main>
      <Footer />
    </>
  );
}
