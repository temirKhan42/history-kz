import { render } from 'react-dom';
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import '../styles/index.scss';
import App from './App.jsx';
import Signin from './routes/Signin.jsx';
import Login from './routes/Login.jsx';
import Home from './routes/Home.jsx';
import Settings from './routes/Settings.jsx';
import Test from './routes/Test.jsx';
import Progress from './routes/Progress.jsx';

export default () => {
  const rootElement = document.getElementById('root');
  render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="login" element={<Login />} />
          <Route path="signin" element={<Signin />} />
          <Route path="home" element={<Home />} />
          <Route path="progress" element={<Progress />} />
          <Route path="settings" element={<Settings />} />
          <Route path="test" element={<Test />} />
        </Route>
      </Routes>
    </BrowserRouter>,
    rootElement,
  );
};
