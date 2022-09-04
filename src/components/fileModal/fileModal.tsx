import {FC} from 'react';
import { DataItem } from '../../data/types';
import Modal from 'react-modal';
import { TextField, styled as styledMui } from '@mui/material'

interface Props {
  file:DataItem,
  closeModal: () => void,
  onUpdateText: (ev: React.ChangeEvent<HTMLTextAreaElement>) => void
}

const FileModal:FC<Props> = (props) => 
  <Modal isOpen={true}
    onAfterOpen={()=>{}}
    onRequestClose={props.closeModal}
    contentLabel={props.file.name}>
      <h3>{props.file.name}</h3>
      <MuiTextArea onChange={props.onUpdateText} value={props.file.text} multiline />
  </Modal>

const MuiTextArea = styledMui(TextField)`
  width: 100%;
`

export default FileModal;