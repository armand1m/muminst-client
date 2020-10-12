import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'theme-ui';
import { App } from './App';
import { getButtonUrl } from './features/buttons/getButtonUrl';
import { theme } from './features/theme';
import { CSSBaseline } from './components/CSSBaseline';

/**
 * Cache button images before rendering
 */
new Image().src = getButtonUrl('normal');
new Image().src = getButtonUrl('pressed');

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CSSBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
