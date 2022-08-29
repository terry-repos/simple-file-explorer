import {FC} from 'react'
import styled from 'styled-components'
import { DataItem } from '../types'

interface Props {
  dataItem: DataItem
  onSelectItem: (dataItem:DataItem) => void;
}

const DataItemComp:FC<Props> = (props) => {
  const {type, name} = props.dataItem;
  const isFile = type==="file";
  return (
    <DataItemContainer onDoubleClick={()=>props.onSelectItem(props.dataItem)}>
      <Thumbnail isFile={isFile}>
        {type}
      </Thumbnail>
      <Filename>
        {name}
      </Filename>
    </DataItemContainer>
  )
}

const DataItemContainer = styled.div`
  margin: 20px;
  padding: 10px;
  border-radius: 5px;
  width: min-content;
  cursor: pointer;

`

const Thumbnail = styled.div<{isFile: boolean}>`
  width: 50px;
  height: 50px;
  line-spacing: 50px;
  border: solid 5px #999;
  border-radius: 10px;
  text-transform: uppercase;
  letter-spacing: -1px;
  font-size: 10px;
  font-weight: bold;
  justify-content: center;
  align-items: center;
  color: white;
  display: flex;
  user-select: none;
  ${({ isFile }) => {
    return (isFile) ? 'color: #aaa; background-color: none; color:border-color: #696;' : 'background-color:#99aaaa;  border-color: #669999;'  }}
`

const Filename = styled.div`
font-size: 12px;
text-align: center;
`

export default DataItemComp;