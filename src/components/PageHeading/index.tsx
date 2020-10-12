import React, { FC } from 'react';
import { Heading, HeadingProps } from 'theme-ui';

/**
 * TODO: Move this to features/theme itself
 * @param props
 */
export const PageHeading: FC<HeadingProps> = (props) => (
  <Heading
    as="h1"
    sx={{
      fontSize: 7,
      textTransform: 'uppercase',
    }}
    {...props}
  />
);
