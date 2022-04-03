import React, { useState } from 'react'
import styled from 'styled-components'
import { useReactClicks } from 'react-clicks'

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Instructions = styled.h3``

const LastClickType = styled.h1`
  margin-bottom: 100px;
`

const Button = styled.button`
  background-color: darkblue;
  color: whitesmoke;
  font-size: 22px;
  border: none;
  padding: 12px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.4s;
  
  &:hover {
    background-color: whitesmoke;
    color: darkblue;
  }
`

function App() {
  const [clickType, setClickType] = useState('')

  const clickProps = useReactClicks({
    singleClick: () => setClickType('Single Click'),
    doubleClick: () => setClickType('Double Click'),
    longClick: () => setClickType('Long Click')
  })

  return (
    <Wrapper>
      <Instructions>Try the different click variations by using the button</Instructions>
      <Instructions>Available click variations: single, double & long.</Instructions>
      { clickType && <LastClickType>{ clickType }</LastClickType> }
      <Button {...clickProps}>Click Me!</Button>
    </Wrapper>
  )
}

export default App
