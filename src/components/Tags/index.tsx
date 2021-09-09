import React, { FC } from 'react';
import styled from '@emotion/styled';

interface Props {
  tags?: string[];
}

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const TagName = styled.div`
  margin-left: 6px;
  font-size: 10px;
  color: #bdbdbd;
`;

export const Tags: FC<Props> = ({ tags = [] }) => {
  return tags.length > 0 ? (
    <TagsContainer>
      {tags.map((name) => (
        <TagName>·{name}·</TagName>
      ))}
    </TagsContainer>
  ) : (
    <></>
  );
};
