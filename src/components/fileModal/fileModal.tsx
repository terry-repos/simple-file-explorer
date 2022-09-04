import {FC} from 'react';
import { DataItem } from '../../data/types';
import Modal from 'react-modal';

interface Props {
  file:DataItem,
  closeModal: () => void,
  onUpdateText: (ev: React.FormEvent<HTMLTextAreaElement>) => void
}

const FileModal:FC<Props> = (props) => 
  <Modal isOpen={true}
    onAfterOpen={()=>{}}
    onRequestClose={props.closeModal}
    contentLabel={props.file.name}>
      <h3>{props.file.name}</h3>
      <textarea cols={50} rows={20} onChange={props.onUpdateText} value={props.file.text} />
  </Modal>

export default FileModal;