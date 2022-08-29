import {FC, useState} from 'react'
import styled from 'styled-components'

interface Props {
  searchStr: string;
  onChangeText: (searchStr:string) => void;
}

const SearchAutoComplete:FC<Props> = (props:any) => {

  return (
    <AutoCompleteSearchContainer>
      <AutoCompleteInput onChange={props.onChangeText} placeholder="Search" value={props.searchStr} />
    </AutoCompleteSearchContainer>
  )
}

const AutoCompleteSearchContainer = styled.div`
  margin: 5px;
  margin-bottom: 10px;
  margin-left: 0px;

`

const AutoCompleteInput = styled.input`
  width: 90%;
  height: 20px;
  border-radius: 20px;
  border: solid 2px #aaa;
  padding: 5px;
  padding-left: 20px;
`

export default SearchAutoComplete;