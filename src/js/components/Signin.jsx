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
    <div className='boxCo container d-flex align-items-end'> 
    <div className='loginBox w-20 px-5 px-7 mx-auto'>
      <h2 className='h3 mb-4 text-white'>Регистрация</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-3 row">
          <label className='col-sm-2 col-form-label text-white' htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            required
            placeholder='Username'
            onChange={formik.handleChange}
            value={formik.values.username}
            className="form-control form-control-sm"
          />
          {formik.errors.username && formik.touched.username ? (
            <div className='errMessage'>{formik.errors.username}</div>
          ) : null}
        </div>

        <div className="mb-3 row">
          <label className='col-sm-2 col-form-label text-white' htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder='Email'
            onChange={formik.handleChange}
            value={formik.values.email}
            className="form-control form-control-sm"
          />
          {formik.errors.email && formik.touched.email ? (
            <div className='errMessage'>{formik.errors.email}</div>
          ) : null}
        </div>

        <div className="mb-3 row">
          <label className='col-sm-2 col-form-label text-white' htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder='Password'
            onChange={formik.handleChange}
            value={formik.values.password}
            className="form-control form-control-sm"
          />
          {formik.errors.password && formik.touched.password ? (
            <div className='errMessage'>{formik.errors.password}</div>
          ) : null}
        </div>

        <div className="mb-3 row">
          <label className='col-sm-2 col-form-label text-white' htmlFor="passwordConfirm">Confirm password</label>
          <input
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            required
            placeholder='Confirm password'
            onChange={formik.handleChange}
            value={formik.values.passwordConfirm}
            className="form-control form-control-sm"
          />
          {formik.errors.passwordConfirm && formik.touched.passwordConfirm ? (
            <div className='errMessage'>{formik.errors.passwordConfirm}</div>
          ) : null}
        </div>
        
        <div className="mx-auto">
          <button className="btn btn-primary mb-3" type="submit">Зарегистрироваться</button>
        </div>
      </form>

      <Link className='btn btn-link link-light' to="/app/main">Уже зарегистрирован</Link>
    </div>
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
      <main className='loginMain' >
        <div className='box mt-5 container mx-auto row vw-60'> 
          {SettingForm()}
        </div>
      </main>
      {/* <Footer /> */}
    </>
  );
}
