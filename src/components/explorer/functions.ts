import { DataItem } from '../types';

export const getLocationStrings = (data:DataItem[][], currLevel: number, currParent: string, currItemName: string, selectedItem?: DataItem):string[] => {
  const locations:string[] = []

  const dataToTraverse = data.slice(0, currLevel).reverse();
 
  dataToTraverse.forEach((level, lvlI) => {
    const ancestor = level.find((item, levI) => item.name===currItemName)

    if (!!currItemName){
      locations.push(currItemName)
    }
    currItemName = ancestor && ancestor.parent || currItemName

  })

  if (!locations.includes("Home")){
    locations.push("Home")
  }
  return [ ...locations.reverse() ];
}

export const findMatchingItems = (dataItems: DataItem[][], searchStr:string) => {
  const matchingItems:DataItem[] = [];
  const srchStr = searchStr.toLowerCase();
  dataItems.forEach((level, lvlI) => {
    level.forEach(item => {
      item.level = lvlI+1;
      if (item.name.toLowerCase().includes(srchStr)){
        matchingItems.push(item)
      } else if (item.text && item.text.toLowerCase().includes(srchStr)) {
        matchingItems.push(item)
      }
    })
  })

  return matchingItems;
}

export const getCurrLocationData = (data: DataItem[][], currLevel: number, currItemName: string) => {
  const levelItems = (data && data[currLevel]) || []

  return (levelItems as DataItem[]).filter(item => item.parent === currItemName)
}

export const getLocationDataInfo = (locationItems:DataItem[][]) => {
  let nFiles = 0;
  let nFolders = 0;
  locationItems.forEach((level, lvlI) => {
    const files = (level as DataItem[]).filter(item => item.type==="file") || []
    nFiles += files.length;
    nFolders += level.length - nFiles;
  })

  return {nFiles, nFolders}
}