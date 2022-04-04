import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentPath } from '../slices/userSlice.js';
import { useFormik } from 'formik';
import axios from 'axios';
import routes from '../routes/index.js';
import useAuth from '../hooks/index.js';
import * as yup from 'yup';

const NameChange = () => {
  const auth = useAuth();
  const [isRequestSuccess, setIsRequestSuccess] = useState(null);

  const schema = yup.object().shape({
    username: yup.string()
      .min(3, 'minimum length of name shuld be 3 letters')
      .max(20, 'maximum length of name should be 20 letters')
      .required('the field should be written'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
    },
    validationSchema: schema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const option = { email: auth.user.email, ...values };
        const { data } = await axios.post(routes.changeName(), option);
        localStorage.setItem('userId', JSON.stringify(data));
        setIsRequestSuccess(true);
        auth.signin(() => (console.log(data)));
      } catch (err) {
        resetForm({ values: '' });
        setIsRequestSuccess(false);
        console.log(err);
      }
    },
  });

  return (
    <div>
      <h3>Изменить имя пользователя</h3>
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="username">{auth.user.username}</label>
        <input
          id="username"
          name="username"
          type="text"
          required
          onChange={formik.handleChange}
          value={formik.values.username}
          disabled={formik.isSubmitting}
        />
        {formik.errors.username && formik.touched.username ? (
          <div>{formik.errors.username}</div>
        ) : null}
        {isRequestSuccess === null ? null : 
          isRequestSuccess ? (
            <div>Имя пользователя успешно изменено</div>
          ) : (
            <div>Произошла неизвестная ошибка при изменении имени пользователя</div>
          )
        }

        <button type="submit" disabled={formik.isSubmitting}>Применить</button>
      </form>
    </div>
  );
};

const EmailChange = () => {
  const auth = useAuth();
  const [isNewEmailConflict, setIsNewEmailConflict] = useState(false);
  const [isRequestSuccess, setIsRequestSuccess] = useState(null);
  const schema = yup.object().shape({
    newEmail: yup.string().email().required('the field should be written'),
  })

  const oldEmail = auth.user.email;

  const formik = useFormik({
    initialValues: {
      newEmail: '',
    },
    validationSchema: schema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (values.newEmail === oldEmail) {
          return;
        }
        const option = { ...values, oldEmail };

        const { data } = await axios.post(routes.changeEmail(), option);
        localStorage.setItem('userId', JSON.stringify(data));
        setIsRequestSuccess(true);
        setIsNewEmailConflict(false);
        auth.signin(() => (console.log(data)));
      } catch (err) {
        resetForm({ values: '' });
        if (err?.response?.status === 409) {
          setIsNewEmailConflict(true);
        } else {
          setIsRequestSuccess(false);
        }
      }
    },
  });

  return (
    <div>
      <h3>Изменить Email</h3>
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="newEmail">{oldEmail}</label>
        <input
          id="newEmail"
          name="newEmail"
          type="email"
          required
          onChange={formik.handleChange}
          value={formik.values.newEmail}
          disabled={formik.isSubmitting}
        />
        {formik.errors.newEmail && formik.touched.newEmail ? (
          <div>{formik.errors.newEmail}</div>
        ) : null}
        {isNewEmailConflict ? (
          <div>Ошибка изменения Email, данный Email уже существует.</div>
        ) : null}
        {isRequestSuccess === null ? null : 
          isRequestSuccess ? (
            <div>Email успешно изменен</div>
          ) : (
            <div>Произошла неизвестная ошибка при изменении Email</div>
          )
        }

        <button type="submit" disabled={formik.isSubmitting}>Применить</button>
      </form>
    </div>
  );
};

const PasswordChange = () => {
  const auth = useAuth();

  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isRequestSuccess, setIsRequestSuccess] = useState(null);

  const schema = yup.object().shape({
    newPassword: yup.string()
      .min(8, 'minimum length of the password should be 8 characters')
      .required('the field should be written'),
    confirmPassword: yup.string()
      .required('the field should be written')
      .test(
        'is-match',
        'passwords doesn\'t mutches',
        (val, { parent }) => (val === parent.newPassword),
      ),
  });

  const formik = useFormik({
    initialValues: {
      password: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: schema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const option = { email: auth.user.email, ...values };
        const { data } = await axios.post(routes.changePassword(), option);
        setIsPasswordValid(true);
        setIsRequestSuccess(true);
        conosle.log(data);
      } catch (err) {
        resetForm({ values: '' });
        if (err?.response?.status === 401) {
          setIsPasswordValid(false);
        } else {
          setIsRequestSuccess(false);
        }
      }
    },
  });

  return (
    <div>
      <h3>Изменить пароль</h3>
      <form onSubmit={formik.handleSubmit}>
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
        {!isPasswordValid ? (
          <div>Wrong password, try again</div>
        ) : null}

        <label htmlFor="newPassword">New password</label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          onChange={formik.handleChange}
          value={formik.values.newPassword}
          disabled={formik.isSubmitting}
        />
        {formik.errors.newPassword && formik.touched.newPassword ? (
          <div>{formik.errors.newPassword}</div>
        ) : null}

        <label htmlFor="confirmPassword">Confirm password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          onChange={formik.handleChange}
          value={formik.values.confirmPassword}
          disabled={formik.isSubmitting}
        />
        {formik.errors.confirmPassword && formik.touched.confirmPassword ? (
          <div>{formik.errors.confirmPassword}</div>
        ) : null}
        {isRequestSuccess === null ? null : 
          isRequestSuccess ? (
            <div>Пароль успешно изменен</div>
          ) : (
            <div>Произошла неизвестная ошибка при изменении пароля</div>
          )
        }

        <button type="submit" disabled={formik.isSubmitting}>Применить</button>
      </form>
    </div>
  );
}

export default function Settings() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setCurrentPath(window.location.pathname));
  }, []);

  return (
    <main>
      <h2>Настройки</h2>
      <NameChange />
      <EmailChange />
      <PasswordChange />
    </main>
  );
}
