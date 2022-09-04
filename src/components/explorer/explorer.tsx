import React, { FC } from 'react'
import CreateGeneric from '../createGeneric/createGeneric';

import SearchAutoComplete from '../searchAutoComplete/searchAutoComplete'
import DataItemComp from '../dataItemComp/dataItemComp'
import FileModal from '../fileModal/fileModal'
import styled from 'styled-components';

import { DataItem } from '../../data/types';
import { useDataStore } from '../../data/store';

const Explorer: FC = () => {
  const state = useDataStore()

  const { data, selectedItem, currNavPoint, navHistory, currIndexInHistory, locationStrings, locationItems, locationDataInfo, foundItems, searchStr } = state;


  const { addDataItem, performSearch, updateFileText, closeUpdateFile, selectItem, movePointInHistory } = state;

  const selectParentOfSelectedItem = () => {
    const parentLevel = Math.max(currNavPoint.level - 2, 0);
    const levelItems = (data && data[parentLevel]) || []
    const parentItem = (levelItems as DataItem[]).find(item => item.name === selectedItem.parent) || data[0][0]
    selectItem(currNavPoint.level - 1, parentItem)
  }

  const selectItemDirectly = (dataItem: DataItem, fromSearch = false) => {
    const level = (fromSearch) ? dataItem.level : currNavPoint.level + 1;
    selectItem(level as number, dataItem)
  }

  const selectBreadCrumb = (breadCrumb: string, level: number) => {
    const selectedFolder: DataItem | undefined = (data[level - 1] as DataItem[]).find(item => item.name === breadCrumb)
    if (!selectedFolder) return
    selectItem(level, selectedFolder)
  }

  const updateFileTextHandler = (ev: React.FormEvent<HTMLTextAreaElement>) => {
    const updatedText: string = ev.currentTarget.value;
    updateFileText(updatedText);
  }

  const handleCloseModal = () => {
    closeUpdateFile()
    selectParentOfSelectedItem()
  }

  const navigate = (direction: string) => {
    const newIndexInHistory = (direction === 'back') ? currIndexInHistory - 1 : currIndexInHistory + 1;

    performSearch("")
    
    movePointInHistory(newIndexInHistory)
    const posDat = navHistory[newIndexInHistory]
    console.log("posDat: ", posDat, " navHistory[newIndexInHistory]: ", navHistory[newIndexInHistory])

    const levelToTraverse = Math.max(0, posDat.level - 1)
    const itemToSelect: DataItem | undefined = (data[levelToTraverse] as DataItem[]).find(item => item.name === posDat.itemName) || undefined

    if (!itemToSelect) return;
    const addToHistory = false
    selectItem(currNavPoint.level, itemToSelect, addToHistory)
  }

  const handleSearchStr = (event: React.FormEvent<HTMLInputElement>) => {
    const incomingSearchStr = event.currentTarget.value;
    performSearch(incomingSearchStr)
  }

  const inSearchMode = state.searchStr !== "";

  return (
    <ExplorerContainer>
      <SearchAutoComplete onChangeText={handleSearchStr} searchStr={searchStr} inSearchMode={inSearchMode} />

      <LocationCrumbsContainer>
        <Crumbs>
          {!inSearchMode &&
            locationStrings.map((locationString: string, levI: number) =>
              <React.Fragment key={`breadcrumb_${levI}`}>
                <BreadCrumb selected={((levI + 1) === currNavPoint.level)} onClick={() => selectBreadCrumb(locationString, levI + 1)}>
                  {locationString}
                </BreadCrumb>
                {(levI < locationStrings.length - 1) ? " / " : " "}
              </React.Fragment>
            )
          }
        </Crumbs>
        <NavContainer>
          <BackButton onClick={() => navigate('back')} disabled={(currIndexInHistory === 0)}> ← </BackButton>
          <ForwardButton onClick={() => navigate('forward')} disabled={currIndexInHistory >= (navHistory.length - 1)}> → </ForwardButton>
        </NavContainer>
      </LocationCrumbsContainer>
      <ItemsContainer>
        {!inSearchMode ?
          (<>
            {locationItems.map((dataItem, dI) =>
              <DataItemComp key={`dataItem_${dI}`} dataItem={dataItem} onSelectItem={selectItemDirectly} />)}

            <DataCountInfo><BoldSpan>{locationDataInfo.nFolders}</BoldSpan> folder(s) <BoldSpan>{locationDataInfo.nFiles}</BoldSpan> file(s)</DataCountInfo>
          </>)
          :
          (<>
            {foundItems.map((dataItem, dI) =>
              <DataItemComp key={`searchDataItem_${dI}`} dataItem={dataItem} onSelectItem={(item) => selectItemDirectly(item, true)} />)}

            <DataCountInfo>Found {foundItems.length} item(s)</DataCountInfo>
          </>)
        }
      </ItemsContainer>
      {selectedItem && selectedItem.type === 'file' &&
        <FileModal file={selectedItem} onUpdateText={updateFileTextHandler} closeModal={handleCloseModal} />}
      <CreateItemsContainer>
        <CreateGeneric key={"addFolderPane"} parent={currNavPoint.itemName} type="folder" onAddDataItem={addDataItem} />
        <CreateGeneric key={"addFilePane"} parent={currNavPoint.itemName} type="file" onAddDataItem={addDataItem} />
      </CreateItemsContainer>
    </ExplorerContainer>
  )
}

const ExplorerContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 20px;
  background: #fff;
  width: 100%;
`

const DataCountInfo = styled.div`
  position: absolute;
  left: 30px;
  padding-top: 3px;
  margin-bottom: 0;
  font-size: 10px;
  color: gray;
`

const LocationCrumbsContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: space-between;
  font-size: 10px;
`

const Crumbs = styled.div`
  width: 70%;
  padding: 10px;
  background-color: rgb(230,230,230);
  border-radius: 10px;
`

const BreadCrumb = styled.span<{ selected: boolean }>`
  cursor: pointer;
  ${({ selected }) => {
    if (selected) {
      return 'font-weight: bold';
    } else {
      return 'color: gray'
    }
  }}
`

const CreateItemsContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const BoldSpan = styled.span`
  font-weight: bold;

`

const ItemsContainer = styled.div`
  display: flex;

  width: 100%;
  margin-top: 10px;
  border-radius: 10px;
  margin-right: 40px;
  background-color: #efefef;
  min-height: 120px;
  min-width: 100%;
`

const NavContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const NavButton = styled.button<{ disabled: boolean }>`
  border-color: navy;
  color: white;
  background-color: navy;
  ${({ disabled }) => {
  if (disabled) {
    return "background-color: white; border-color: #eee;"
    }
  }}

  border-radius: 5px;
  padding-left: 10px;
  padding-right: 10px;
  margin-left: 10px;
  width: min-content;
  font-size: 20px;
  cursor: pointer;
`

const BackButton = styled(NavButton)`
`

const ForwardButton = styled(NavButton)`
`

export default Explorer;
