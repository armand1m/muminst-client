import styled from '@emotion/styled'
import React from 'react'

type Props = {
    onChange: (event: any) => void
}

const Input = styled.input`
    width: 300px;
    height: 30px;
    border: 1px solid rgba(50, 50, 50, 0.5);
    border-radius: 4px;
`

export const Search = ({ onChange }: Props) => <Input onChange={onChange} />
