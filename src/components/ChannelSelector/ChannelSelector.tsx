import React from 'react';
import { Channel } from '../types';

type Props = {
  channels: Channel[];
};

export const ChannelSelector = ({ channels }: Props) => (
  <select>
    {channels.map((channel, index) => (
      <option key={`${channel.name}${index}`}>{channel.name}</option>
    ))}
  </select>
);
