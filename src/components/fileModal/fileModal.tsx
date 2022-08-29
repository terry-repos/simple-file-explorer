import {FC} from 'react';
import { DataItem } from '../types';
import styled from 'styled-components'
import Modal from 'react-modal';

interface Props {
  file:DataItem,
  closeModal: () => void,
  onUpdateText: (ev:any) => void
}

const FileModal:FC<Props> = (props) => 
  <Modal isOpen={true}
    onAfterOpen={()=>{}}
    onRequestClose={props.closeModal}
    contentLabel={props.file.name}>
      <h3>{props.file.name}</h3>
      <textarea cols={50} rows={20} onChange={props.onUpdateText} value={props.file.text}>
        
      </textarea>
  </Modal>

const TextArea = styled.textarea`
  width: 100%;
  height: 100%;
`

export default FileModal;