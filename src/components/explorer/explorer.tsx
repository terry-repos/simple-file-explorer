import React, { FC, useEffect, useState } from 'react'
import CreateGeneric from '../createGeneric/createGeneric';

import SearchAutoComplete from '../searchAutoComplete/searchAutoComplete'
import DataItemComp from '../dataItemComp/dataItemComp'
import FileModal from '../fileModal/fileModal'
import styled from 'styled-components';

import { DataItem } from '../types';
import { getLocationStrings, findMatchingItems, getLocationDataInfo, getCurrLocationData } from './functions';

const initLevel: DataItem[] = [{ parent: "Home", name: "Home", type: "folder" }]
const dataStore: DataItem[][] = [initLevel, []]

const Explorer: FC = () => {
  const [data, setData] = useState<any>(dataStore)
  const [currLevel, setLevel] = useState<number>(1)
  const [currParent, setParent] = useState<string>("")
  const [currItemName, setCurrItemName] = useState<string>("Home")
  const [navHistory, setNavHistory] = useState<any[]>([{ currLevel, currParent, currItemName }])
  const [currPointInHistory, setPointInHistory] = useState<number>(0)
  const [locationStrings, setLocationStrings] = useState<string[]>([])
  const [locationItems, setLocationItems] = useState<DataItem[]>([])
  const [locationDataInfo, setLocationDataInfo] = useState<any>({ nFiles: 0, nFolders: 0 })
  const [searchItems, setSearchItems] = useState<DataItem[]>([])

  const [selectedItem, setSelectedItem] = useState<DataItem>(initLevel[0])
  const [searchStr, setSearchStr] = useState<string>("")

  const addDataItem = (name: string, type: string, text?: string) => {
    if (!name || name.length === 0) return;
    const dataCopy = [...data]
    if (type === "folder" && !dataCopy[currLevel + 1] || !dataCopy[currLevel]) {
      dataCopy.push([])
    }
    dataCopy[currLevel].push({ parent: currItemName, name, type, text })
    setData(dataCopy)
  }

  const selectItem = (level: number, dataItem: DataItem, addToHistory: boolean = true) => {
    setSearchStr("")
    setLevel(level)
    setParent(dataItem.parent)
    setCurrItemName(dataItem.name)
    setSelectedItem(dataItem)

    if (addToHistory && dataItem.type === "folder") {
      const newPointInHistory = { currLevel: (level - 1), currParent, currItemName };
      const currNavHistory = [...navHistory.slice(0, currPointInHistory), newPointInHistory]

      setNavHistory(currNavHistory)
      setPointInHistory(currPointInHistory + 1)
    }
  }

  const selectParent = (dataItem: DataItem) => {
    const parentLevel = currLevel - 2
    const levelItems = (data && data[parentLevel]) || []
    const parentItem = (levelItems as DataItem[]).find(item => item.name === dataItem.parent) || initLevel[0]
    selectItem(currLevel - 1, parentItem)
  }

  const selectItemDirectly = (dataItem: DataItem, fromSearch = false) => {
    const level = (fromSearch) ? dataItem.level : currLevel + 1;
    selectItem(level as number, dataItem)
  }

  const selectBreadCrumb = (location: string, level: number) => {
    const selectedFolder: DataItem = (data[level - 1] as DataItem[]).find(item => item.name === location) || initLevel[0]
    selectItem(level, selectedFolder)
  }

  const updateFileText = (ev: any) => {
    const newText: string = ev.target.value;
    const updatedFile: DataItem = {
      ...selectedItem,
      text: newText
    } as DataItem;
    setSelectedItem(updatedFile)
  }

  const handleCloseModal = () => {
    const dataCopy = [...data];
    const itemToUpdateIndex = (dataCopy[currLevel - 1] as DataItem[]).findIndex(item => item.name === selectedItem.name)
    dataCopy[currLevel - 1][itemToUpdateIndex] = { ...selectedItem }
    setData(dataCopy)
    selectParent(selectedItem)
  }

  const navigate = (direction: string) => {
    const newPoint = (direction === 'back') ? currPointInHistory - 1 : currPointInHistory + 1;
    const posDat = navHistory[newPoint]

    const levelToTraverse = Math.max(0, posDat.currLevel - 1)
    const itemToSelect: DataItem | undefined = (data[levelToTraverse] as DataItem[]).find(item => item.name === posDat.currItemName) || undefined

    if (!itemToSelect) return;
    if (searchStr !== "") setSearchStr("")
    setPointInHistory(newPoint)
    const addToHistory = false
    selectItem(posDat.currLevel, itemToSelect, addToHistory)
  }

  const handleSearchStr = (event: any) => {
    const incomingSearchStr = event.target.value;
    const searchResults = findMatchingItems(data, incomingSearchStr)
    setSearchStr(incomingSearchStr)
    setSearchItems(searchResults)
  }

  useEffect(() => {
    const locationStrings = getLocationStrings(data, currLevel, currParent, currItemName, selectedItem)
    setLocationStrings(locationStrings)
  }, [currLevel, currParent, currItemName, selectedItem])

  useEffect(() => {
    setLocationItems(getCurrLocationData(data, currLevel, currItemName))
  }, [data, data[currLevel]])

  useEffect(() => {
    setLocationDataInfo(getLocationDataInfo(data.slice(currLevel)))
  }, [locationItems])

  const inSearchMode = searchStr !== "";

  return (
    <ExplorerContainer>
      <SearchAutoComplete onChangeText={handleSearchStr} searchStr={searchStr} />

      <LocationCrumbsContainer>
        <Crumbs>
          {!inSearchMode &&
            locationStrings.map((locationString: string, levI: number) =>
              <React.Fragment key={`breadcrumb_${levI}`}>
                <BreadCrumb selected={((levI + 1) === currLevel)} onClick={() => selectBreadCrumb(locationString, levI + 1)}>
                  {locationString}
                </BreadCrumb>
                {(levI < locationStrings.length - 1) ? " / " : " "}
              </React.Fragment>
            )
          }
        </Crumbs>
        <NavContainer>
          <BackButton onClick={() => navigate('back')} disabled={(currPointInHistory === 0)}> ← </BackButton>
          <ForwardButton onClick={() => navigate('forward')} disabled={currPointInHistory >= (navHistory.length - 1)}> → </ForwardButton>
        </NavContainer>
      </LocationCrumbsContainer>
      <ItemsContainer>
        {!inSearchMode ?
          (<>
            {locationItems.map((dataItem, dI) =>
              <DataItemComp key={`dataItem_${dI}`} dataItem={dataItem} onSelectItem={selectItemDirectly} />)}

            <DataCountInfo>{locationDataInfo.nFolders} folders(s) {locationDataInfo.nFiles} file(s)</DataCountInfo>
          </>)

          :
          (<>
            {searchItems.map((dataItem, dI) =>
              <DataItemComp key={`searchDataItem_${dI}`} dataItem={dataItem} onSelectItem={(item) => selectItemDirectly(item, true)} />)}

            <DataCountInfo>Found {searchItems.length} item(s)</DataCountInfo>
          </>)
        }
      </ItemsContainer>
      {selectedItem && selectedItem.type === 'file' &&
        <FileModal file={selectedItem} onUpdateText={updateFileText} closeModal={handleCloseModal} />}
      <CreateItemsContainer>
        <CreateGeneric key={"addFolderPane"} parent={currParent} type="folder" onAddDataItem={addDataItem} />
        <CreateGeneric key={"addFilePane"} parent={currParent} type="file" onAddDataItem={addDataItem} />
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

const NavButton = styled.button`
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