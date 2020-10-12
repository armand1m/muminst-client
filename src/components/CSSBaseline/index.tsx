import React from 'react';
import { Global, css } from '@emotion/core';

export const CSSBaseline = () => (
  <Global
    styles={css`
      @import url('https://fonts.googleapis.com/css2?family=Rubik+Mono+One&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@500&display=swap');
      body {
        -webkit-font-smoothing: antialiased;
        -webkit-tap-highlight-color: transparent;
        -moz-osx-font-smoothing: grayscale;
        font-feature-settings: 'liga', 'kern';
        text-rendering: optimizeLegibility;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      p {
        margin: 0;
      }
      a,
      a:hover,
      a:focus {
        color: inherit;
        text-decoration: none;
      }
    `}
  />
);
