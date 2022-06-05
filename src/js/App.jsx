import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import AuthProvider from './components/AuthProvider';
import Header from './components/Header.jsx';
import RequireAuth from './components/RequireAuth';
import Signin from './components/Signin.jsx';
import Main from './components/Main.jsx';
import Home from './components/Home.jsx';
import Settings from './components/Settings.jsx';
import Test from './components/Test.jsx';
import Progress from './components/Progress.jsx';

export default function App() {
  const protectedPages = ['home', 'test', 'progress', 'settings'];
  const [home, test, progress, settings] = protectedPages;

  const getElement = (path) => {
    const currentPage = path === home ? <Home />
      : path === test ? <Test />
        : path === progress ? <Progress />
          : path === settings ? <Settings /> : null;

    return (
      <RequireAuth>
        {currentPage}
      </RequireAuth>
    );
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="app" element={<Header />}>
            <Route path="main" element={<Main />} />
            <Route path="signin" element={<Signin />} />
            <Route path={home} element={getElement(home)} />
            <Route path={settings} element={getElement(settings)} />
            <Route path={test} element={getElement(test)} />
            <Route path={progress} element={getElement(progress)} />
          </Route>
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>There's nothing here!</p>
              </main>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
