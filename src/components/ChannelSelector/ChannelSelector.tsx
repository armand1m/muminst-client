import React from 'react'

type Props = {
    channels: any[]
}

export const ChannelSelector = ({ channels }: Props) => (
    <>
        <select>
            {channels.map((channel) => (
                <option>{channel.name}</option>
            ))}
        </select>
    </>
)
