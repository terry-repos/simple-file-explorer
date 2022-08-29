import {FC, useState } from 'react'
import styled from 'styled-components';

interface CreateGenericProps {
  parent: string;
  type: string;
  onAddDataItem: (itemName: string, type: string, text?: string) => void;
}


const CreateGeneric:FC<CreateGenericProps> = (props) => {
  const [opened, setOpened] = useState<boolean>(false)
  const [itemName, setItemName] = useState<string>("")
  const [text, setText] = useState<string>("")

  const isFile = props.type==='file'

  const handleNameChange = (ev: any) => {
    setItemName(ev.target.value)
  }

  const handleTextArea = (ev: any) => {
    setText(ev.target.value)
  }

  const onAddDataItemHandler = (itemName: string, type: string, text?:string) => {
    props.onAddDataItem(itemName, type, text)
    setOpened(false)
  }

  return (
    <CreateContainer>
      <CreateNewButton onClick={() => setOpened(true)}>Create new {props.type}</CreateNewButton>
      {opened &&
        <>
          <Title>New {props.type}</Title>
          <InputFileName placeholder="Name" onChange={handleNameChange} />
          {isFile && <InputTextArea placeholder="File content here..." onChange={handleTextArea} />}
          <ButtonsContainer>
            <CancelButton onClick={() => setOpened(false)}>Cancel</CancelButton>
            <CreateButton onClick={() => onAddDataItemHandler(itemName, props.type, text)}>Create</CreateButton>
          </ButtonsContainer>
        </>
      }
    </CreateContainer>
  )
}

const CreateContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: min-content;
  margin: 20px;
  padding: 10px;
  background-color: rgba(220,240,240);
  border-radius: 10px;
`

const Title = styled.h4`
  color: gray;
  margin: 0;
  margin-top: 15px;
`

const CreateNewButton = styled.button`
  border: solid 1px black;
  border-radius: 5px;
  width: 200px;
`

const InputFileName = styled.input`
  height: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
`

const InputTextArea = styled.textarea`
  margin-bottom: 10px;
`

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const CancelButton = styled.button`
  display: flex;
  margin-right: 5px;
  border-radius: 5px;
`

const CreateButton = styled.button`
  background-color: blue;
  color: white;
  margin-right: 5px;
  border-radius: 5px;
`

export default CreateGeneric;