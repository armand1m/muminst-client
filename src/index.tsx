import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'theme-ui';
import dotenv from 'dotenv';
import { App } from './App';
import { getButtonUrl } from './constants';
import { theme } from './features/theme';
import { CSSBaseline } from './components/CSSBaseline';

dotenv.config();

const Cache = ({ imagesUrls }: { imagesUrls: string[] }) => (
  <>
    {imagesUrls.map((url) => (
      <img src={url} style={{ display: 'none' }} key={url} alt="" />
    ))}
  </>
);

const imagesToCache = [
  getButtonUrl('normal'),
  getButtonUrl('pressed'),
];

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CSSBaseline />
      <App />
    </ThemeProvider>
    <Cache imagesUrls={imagesToCache} />
  </React.StrictMode>,
  document.getElementById('root')
);
