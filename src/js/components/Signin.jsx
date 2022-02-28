import React from 'react';
import { useFormik } from 'formik';
import {
  useNavigate,
  Link,
} from 'react-router-dom';
import axios from 'axios';
import * as yup from 'yup';

import useAuth from '../hooks/index.js';
import routes from '../routes/index.js';
import Footer from './Footer.jsx';

const getData = async (values) => {
  const { data } = await axios.post(routes.signup(), values);
  return data;
};

function SettingForm() {
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
        console.log(data);
        auth.signin(() => {
          navigate('/home');
        });
      } catch (err) {
        console.log(err);
      }
    },
  });

  return (
    <div>
      <h3>Регистрация</h3>
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          required
          onChange={formik.handleChange}
          value={formik.values.username}
        />
        {formik.errors.username && formik.touched.username ? (
          <div>{formik.errors.username}</div>
        ) : null}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        {formik.errors.email && formik.touched.email ? (
          <div>{formik.errors.email}</div>
        ) : null}

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        {formik.errors.password && formik.touched.password ? (
          <div>{formik.errors.password}</div>
        ) : null}

        <label htmlFor="passwordConfirm">Confirm password</label>
        <input
          id="passwordConfirm"
          name="passwordConfirm"
          type="password"
          required
          onChange={formik.handleChange}
          value={formik.values.passwordConfirm}
        />
        {formik.errors.passwordConfirm && formik.touched.passwordConfirm ? (
          <div>{formik.errors.passwordConfirm}</div>
        ) : null}

        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>
  );
}

export default function Settings() {
  return (
    <>
      <main>
        {SettingForm()}
        <Link to="/login">Уже зарегистрирован</Link>
      </main>
      <Footer />
    </>
  );
}
