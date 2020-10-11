import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import dotenv from 'dotenv';
import { getButtonUrl } from './constants';

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
    <App />
    <Cache imagesUrls={imagesToCache} />
  </React.StrictMode>,
  document.getElementById('root')
);
