const heading = {
  color: 'text',
  fontFamily: 'heading',
  lineHeight: 'heading',
  fontWeight: 'heading',
};

export enum ColorMode {
  Dark = 'dark',
  Light = 'light',
}

export const theme = {
  initialColorModeName: ColorMode.Light,
  useColorSchemeMediaQuery: true,
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  fonts: {
    body: `"Rubik", system-ui, sans-serif`,
    heading: `inherit`,
    monospace: `"Rubik Mono One", monospace`,
  },
  fontSizes: [
    '0.75em',
    '0.875em',
    '1em',
    '1.250em',
    '1.5em',
    '2em',
    '3em',
    '4em',
    '6em',
  ],
  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125,
  },
  colors: {
    text: '#000',
    background: '#fff',
    primary: '#000',
    secondary: '#f6f6f6',
    muted: '#f6f6f6',
    shadow1: 'rgba(0,0,0,0.12)',
    shadow2: 'rgba(0,0,0,0.24)',
    tertiary: '#DDD',
    modes: {
      dark: {
        text: '#fff',
        background: '#060606',
        primary: '#fff',
        secondary: '#191919',
        muted: '#191919',
        highlight: '#29112c',
        gray: '#999',
        purple: '#c0f',
        shadow1: 'rgba(0,0,0,0.12)',
        shadow2: 'rgba(0,0,0,0.24)',
        tertiary: '#333',
      },
    },
  },
  styles: {
    root: {
      fontFamily: 'body',
      lineHeight: 'body',
      fontWeight: 'body',
    },
    h1: {
      ...heading,
      fontSize: 5,
    },
    h2: {
      ...heading,
      fontSize: 4,
    },
    h3: {
      ...heading,
      fontSize: 3,
    },
    h4: {
      ...heading,
      fontSize: 2,
    },
    h5: {
      ...heading,
      fontSize: 1,
    },
    h6: {
      ...heading,
      fontSize: 0,
    },
    p: {
      color: 'text',
      fontFamily: 'body',
      fontWeight: 'body',
      lineHeight: 'body',
    },
    a: {
      color: 'primary',
    },
    pre: {
      fontFamily: 'monospace',
      overflowX: 'auto',
      code: {
        color: 'inherit',
      },
    },
    code: {
      fontFamily: 'monospace',
      fontSize: 'inherit',
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: 0,
    },
    th: {
      textAlign: 'left',
      borderBottomStyle: 'solid',
    },
    td: {
      textAlign: 'left',
      borderBottomStyle: 'solid',
    },
    img: {
      maxWidth: '100%',
    },
    spinner: {
      color: 'text',
    },
  },
  buttons: {
    icon: {
      cursor: 'pointer',
    },
    primary: {
      color: 'background',
      bg: 'text',
      '&:focus': {
        outline: 'auto 5px',
        outlineColor: 'text',
      },
      fontWeight: 'bold',
      cursor: 'pointer',
    },
    close: {
      cursor: 'pointer',
      '&:focus': {
        outline: 'auto 5px',
        outlineColor: 'text',
      },
    },
  },
  badges: {
    primary: {
      color: 'background',
      bg: 'primary',
    },
    outline: {
      color: 'primary',
      bg: 'transparent',
      boxShadow: 'inset 0 0 0 2px',
      borderRadius: 6,
      px: 2,
      py: 1,
    },
  },
  forms: {
    input: {},
    select: {},
    switch: {
      cursor: 'pointer',
      color: 'background',
      bg: 'background',
      border: '2px solid',
      borderColor: 'text',
      '&[aria-checked=true]': {
        bg: 'text',
      },
      thumb: {
        border: '2px solid',
        borderColor: 'text',
        bg: 'background',
        mt: '-2px',
        ml: '-2px',
      },
    },
  },
};
