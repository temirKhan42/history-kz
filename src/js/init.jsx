import { render } from 'react-dom';
import React from 'react';

import '../styles/index.scss';
import App from './App';

export default () => {
  const rootElement = document.getElementById('root');

  render(
    <App />,
    rootElement,
  );
};
