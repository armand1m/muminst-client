import React from 'react'

type Props = {
    channels: any[]
}

export const ChannelSelector = ({ channels }: Props) => (
    <>
        <select>
            {channels.map((channel, index) => (
                <option key={`${channel.name}${index}`}>{channel.name}</option>
            ))}
        </select>
    </>
)
