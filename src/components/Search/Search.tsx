import styled from '@emotion/styled'
import React, { ChangeEvent } from 'react'

type Props = {
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

const Input = styled.input`
    width: 300px;
    height: 30px;
    border: 1px solid rgba(50, 50, 50, 0.5);
    border-radius: 4px;
`

export const Search = ({ onChange }: Props) => <Input onChange={onChange} />
