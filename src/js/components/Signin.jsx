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
    <div className='settingBox py-4 bg-dark mt-4'>
      <h2 className='h2 text-light'>Регистрация</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="row g-1 align-items-center justify-content-center">
          <div className="col-5 form-floating mb-3">
            <input
              id="username"
              name="username"
              type="text"
              required
              placeholder='Username'
              onChange={formik.handleChange}
              value={formik.values.username}
              className="form-control flex-fill"
            />
            <label htmlFor="username">Username</label>
            {formik.errors.username && formik.touched.username ? (
              <div className='errMessage'>{formik.errors.username}</div>
            ) : null}
          </div>

          <div className="col-5 form-floating mb-3">
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder='Email'
              onChange={formik.handleChange}
              value={formik.values.email}
              className="form-control flex-fill"
            />
            <label htmlFor="email">Email</label>
            {formik.errors.email && formik.touched.email ? (
              <div className='errMessage'>{formik.errors.email}</div>
            ) : null}
          </div>

          <div className="col-5 form-floating mb-3">
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder='Password'
              onChange={formik.handleChange}
              value={formik.values.password}
              className="form-control flex-fill"
            />
            <label htmlFor="password">Password</label>
            {formik.errors.password && formik.touched.password ? (
              <div className='errMessage'>{formik.errors.password}</div>
            ) : null}
          </div>

          <div className="col-5 form-floating mb-3">
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              required
              placeholder='Confirm password'
              onChange={formik.handleChange}
              value={formik.values.passwordConfirm}
              className="form-control flex-fill"
            />
            <label htmlFor="passwordConfirm">Confirm password</label>
            {formik.errors.passwordConfirm && formik.touched.passwordConfirm ? (
              <div className='errMessage'>{formik.errors.passwordConfirm}</div>
            ) : null}
          </div>
          
          <div className="col-auto ms-3">
            <button className="btn btn-primary mb-3" type="submit">Зарегистрироваться</button>
          </div>
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
