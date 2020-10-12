import { Flex, FlexProps } from 'theme-ui';

import React from 'react';

export const Centered: React.FC<FlexProps> = (props) => (
  <Flex
    {...props}
    sx={{
      alignItems: 'center',
      justifyContent: 'center',
      ...props.sx,
    }}
  />
);
