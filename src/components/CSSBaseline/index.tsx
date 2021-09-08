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

      .react-tag-input {
        background: transparent;
        color: inherit;
        border-radius: 4px;
        min-height: 42px;
        border-color: inherit;
      } /* Wrapper */
      .react-tag-input__input {
        color: inherit;
      } /* Inner input */
      .react-tag-input__tag {
        background: transparent;
      } /* Tag wrapper */
      .react-tag-input__tag__content {
      } /* The text content within the tag */
      .react-tag-input__tag__remove {
        background: transparent;

        &::before,
        &::after {
          background: red;
        }
      } /* The remove button & icon for a tag */
    `}
  />
);
