import {FC, useState } from 'react'
import styled from 'styled-components';
import { TextField, Button } from '@mui/material';
import { styled as styledMui} from '@mui/system';


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
        <InputFileName label={`New ${props.type}`} placeholder="Name" onChange={handleNameChange} />
          {isFile && <InputTextArea placeholder="File content here..." onChange={handleTextArea} multiline />}
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
  background-color: rgba(80,80,80,0.1);
  border-radius: 10px;
`

const CreateNewButton = styledMui(Button)`
  width: 200px;
  background: navy;
  color: white;
  border-radius: 10px;
`

const InputFileName = styledMui(TextField)`
  margin: 0;
  padding: 0;
  background: #fff;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 12px;
  
`

const InputTextArea = styledMui(TextField)`
  background: #fff;
  margin-bottom: 10px;
  border: transparent;
`

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const CancelButton = styledMui(Button)`
  display: flex;
  margin-right: 5px;
  border-radius: 5px;
`

const CreateButton = styledMui(Button)`
  background-color: navy;
  color: white;
  margin-right: 5px;
  border-radius: 5px;
`

export default CreateGeneric;