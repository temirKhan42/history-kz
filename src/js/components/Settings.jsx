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
      <h5 className="h5 text-light">Изменить имя пользователя</h5>
      <form onSubmit={formik.handleSubmit}>
        <div className="row g-2 align-items-center justify-content-center">
          <div className="col-5 form-floating mb-3">
            <input
              id="username"
              name="username"
              type="text"
              required
              placeholder={auth.user.username}
              onChange={formik.handleChange}
              value={formik.values.username}
              disabled={formik.isSubmitting}
              className="form-control flex-fill"
            />
            <label htmlFor="username">{auth.user.username}</label>
            {formik.errors.username && formik.touched.username ? (
              <div className='errMessage'>{formik.errors.username}</div>
            ) : null}
            {isRequestSuccess === null ? null : 
              isRequestSuccess ? (
                <div className='errMessage'>
                  Имя пользователя успешно изменено
                </div>
              ) : (
                <div className='errMessage'>
                  Произошла неизвестная ошибка при изменении имени пользователя
                </div>
              )
            }
          </div>
          <div className="col-auto ms-3">
            <button type="submit" className="btn btn-danger" disabled={formik.isSubmitting}>Применить</button>
          </div>
        </div>
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
      <h5 className="h5 text-light">Изменить email</h5>
      <form onSubmit={formik.handleSubmit}>
        <div className="row g-2 align-items-center justify-content-center">
          <div className="col-5 form-floating mb-3">
            <input
              id="newEmail"
              name="newEmail"
              type="email"
              required
              placeholder={oldEmail}
              onChange={formik.handleChange}
              value={formik.values.newEmail}
              disabled={formik.isSubmitting}
              className="form-control flex-fill"
            />
            <label htmlFor="newEmail">{oldEmail}</label>
            {formik.errors.newEmail && formik.touched.newEmail ? (
              <div className='errMessage'>{formik.errors.newEmail}</div>
            ) : null}
            {isNewEmailConflict ? (
              <div className='errMessage'>
                Ошибка изменения Email, данный Email уже существует.
              </div>
            ) : null}
            {isRequestSuccess === null ? null : 
              isRequestSuccess ? (
                <div className='errMessage'>Email успешно изменен</div>
              ) : (
                <div className='errMessage'>Произошла неизвестная ошибка при изменении Email</div>
              )
            }
          </div>

          <div className="col-auto ms-3">
            <button type="submit" className="btn btn-danger" disabled={formik.isSubmitting}>Применить</button>
          </div>
        </div>
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
      <h5 className="h5 text-light">Изменить пароль</h5>
      <form onSubmit={formik.handleSubmit}>
        <div className="row g-2 align-items-center justify-content-center">
          <div className='col-5'>
            <div className="form-floating mb-3">
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder='Password'
                onChange={formik.handleChange}
                value={formik.values.password}
                disabled={formik.isSubmitting}
                className="form-control flex-fill"
              />
              <label htmlFor="password">Password</label>
              {!isPasswordValid ? (
                <div className='errMessage'>Wrong password, try again</div>
              ) : null}
            </div>

            <div className="form-floating mb-3">
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                placeholder='New password'
                onChange={formik.handleChange}
                value={formik.values.newPassword}
                disabled={formik.isSubmitting}
                className="form-control flex-fill"
              />
              <label htmlFor="newPassword">New password</label>
              {formik.errors.newPassword && formik.touched.newPassword ? (
                <div className='errMessage'>{formik.errors.newPassword}</div>
              ) : null}
            </div>

            <div className="form-floating mb-3">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder='Confirm password'
                onChange={formik.handleChange}
                value={formik.values.confirmPassword}
                disabled={formik.isSubmitting}
                className="form-control flex-fill"
              />
              <label htmlFor="confirmPassword">Confirm password</label>
              {formik.errors.confirmPassword && formik.touched.confirmPassword ? (
                <div className='errMessage'>{formik.errors.confirmPassword}</div>
              ) : null}
              {isRequestSuccess === null ? null : 
                isRequestSuccess ? (
                  <div className='errMessage'>Пароль успешно изменен</div>
                ) : (
                  <div className='errMessage'>Произошла неизвестная ошибка при изменении пароля</div>
                )
              }
            </div>
          </div>
          
          <div className="col-auto ms-3 align-self-end mb-3">
            <button className='btn btn-danger' type="submit" disabled={formik.isSubmitting}>Применить</button>
          </div>
        </div>
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
    <main className='settingBox py-4 bg-dark mt-4'>
      <h4 className="h4 text-light">Настройки</h4>
      <NameChange />
      <EmailChange />
      <PasswordChange />
    </main>
  );
}
