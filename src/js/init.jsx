import { render } from 'react-dom';
import React from 'react';

import '../styles/index.scss';
import { store } from './store/index.js';
import { Provider } from 'react-redux';
import App from './App';

export default () => {
  const rootElement = document.getElementById('root');

  render(
    <Provider store={store}>
      <App />
    </Provider>,
    rootElement,
  );
};
