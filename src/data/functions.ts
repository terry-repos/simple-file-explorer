import { DataItem, NavPoint } from "./types";

export const computeLocationStrings = (
  data: DataItem[][],
  currNavPoint: NavPoint,

): string[] => {
  const locations: string[] = [];
  const { level, itemName, parent } = currNavPoint;
  let parentName = itemName;
  const levelToTraverseTo = Math.max(0, level)

  const dataToTraverse = data.slice(0, levelToTraverseTo).reverse();

  dataToTraverse.forEach((level, lvlI) => {
    const ancestor = level.find((item, levI) => item.name === parentName);
    if (!!itemName) {
      locations.push(parentName);
    }
    parentName = (ancestor && ancestor.parent) || itemName;
  });

  if (!locations.includes("Home")) {
    locations.push("Home");
  }
  return [...locations.reverse()];
};

export const findMatchingItems = (
  dataItems: DataItem[][],
  searchStr: string
) => {
  if (searchStr === "") return [];
  const matchingItems: DataItem[] = [];
  const srchStr = searchStr.toLowerCase();
  dataItems.forEach((level, lvlI) => {
    level.forEach(item => {
      item.level = lvlI + 1;
      if (item.name.toLowerCase().includes(srchStr)) {
        matchingItems.push(item);
      } else if (item.text && item.text.toLowerCase().includes(srchStr)) {
        matchingItems.push(item);
      }
    });
  });

  return matchingItems;
};

export const getCurrLocationData = (
  data: DataItem[][],
  currLevel: number,
  currItemName: string
) => {
  const levelItems = (data && data[currLevel]) || [];

  return (levelItems as DataItem[]).filter(
    item => item.parent === currItemName
  );
};

export const getLocationDataInfo = (locationItems: DataItem[][]) => {
  let nFiles = 0;
  let nFolders = 0;
  locationItems.forEach((level, lvlI) => {
    const files =
      (level as DataItem[]).filter(item => item.type === "file") || [];
    nFiles += files.length;
    nFolders += level.length - nFiles;
  });

  return { nFiles, nFolders };
};

export const addPointToHistory = (
  currHistory: NavPoint[],
  newPointInHistory: NavPoint,
  currNavPosition: number
) => {
  console.log("addPointToHistory currHistory: ", currHistory, " newPointInHistory: ", newPointInHistory )
  const updatedHistory = [...currHistory.slice(0, currNavPosition + 1), newPointInHistory];
  console.log("updatedHistory: ", updatedHistory)
  return updatedHistory
};

export const updateItemInData = (data: DataItem[][], itemToUpdate:DataItem, level: number) => {
  const itemToUpdateIndex = (data[level] as DataItem[]).findIndex(item => item.name === itemToUpdate.name)
  data[level][itemToUpdateIndex] = { ...itemToUpdate }
  return data
}

export const handleAddDataItem = (
  data: DataItem[][],
  currNavPoint: NavPoint,
  name: string,
  type: string,
  text?: string
) => {
  if (!name || name.length === 0) return;
  const dataCopy = [...data];
  if (
    type === "folder" &&
    (!dataCopy[currNavPoint.level + 1] || !dataCopy[currNavPoint.level])
  ) {
    dataCopy.push([]);
  }
  dataCopy[currNavPoint.level].push({
    parent: currNavPoint.itemName,
    name,
    type,
    text
  });

  return dataCopy;
};

export const moveNavPoint = (direction: string, currIndexInHistory: number, navHistory: NavPoint[]) => {
  const newIndexInHistory = (direction === 'back') ? currIndexInHistory - 1 : currIndexInHistory + 1;
  const newNavPoint = navHistory[newIndexInHistory]
  return {
    currIndexInHistory: newIndexInHistory,
    navHistory: newNavPoint
  }
}

export const getParent = (data:DataItem[][], currNavPoint: NavPoint, dataItem:DataItem) => {
  const parentLevel = Math.max(currNavPoint.level - 2, 0)
  const levelItems = (data && data[parentLevel]) || []
  const parentItem = (levelItems as DataItem[]).find(item => item.name === dataItem.parent)
  return parentItem
}