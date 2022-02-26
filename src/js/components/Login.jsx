import React from 'react';
import { useFormik } from 'formik';
import {
  useNavigate,
  useLocation,
} from 'react-router-dom';
import axios from 'axios';

import useAuth from '../hooks/index.js';
import routes from '../routes/index.js';

const getData = async (option) => {
  const { data } = await axios.post(routes.login(), option);
  return data;
};

function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const from = location.state?.from?.pathname || '/';

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
          navigate(from, { replace: true });
        });
      } catch (err) {
        console.log(err);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <label htmlFor="email">Email Address</label>
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
      <button type="submit">Submit</button>
    </form>
  );
}

export default function Home() {
  return (
    <main style={{ padding: '1rem 0' }}>
      {LoginForm()}
    </main>
  );
}
