import React, { forwardRef } from 'react';
import { Grid, GridProps } from 'theme-ui';

export const CenteredGrid = forwardRef<HTMLDivElement, GridProps>(
  (props, ref) => (
    <Grid
      {...props}
      ref={ref}
      sx={{
        justifyItems: 'center',
        alignContent: 'center',
        textAlign: 'center',
      }}
    />
  )
);
