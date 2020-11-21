import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'theme-ui';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { App } from './App';
import { cacheButtonUrls } from './features/buttons/getButtonUrl';
import { theme } from './features/theme';
import { CSSBaseline } from './components/CSSBaseline';
import { ToggleColorModeButton } from 'components/ToggleColorModeButton';

cacheButtonUrls();

Sentry.init({
  dsn:
    'https://b2f7ac17ff0c4f1bb54d9a8611e6862f@o480339.ingest.sentry.io/5527143',
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CSSBaseline />
      <App />
      <ToggleColorModeButton />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
