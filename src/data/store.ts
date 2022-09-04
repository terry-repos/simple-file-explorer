import create from "zustand";

import { DataItem, NavPoint, DataInfo } from "./types";
import {
  computeLocationStrings,
  addPointToHistory,
  findMatchingItems,
  getLocationDataInfo,
  getCurrLocationData,
  handleAddDataItem,
  updateItemInData,
} from "./functions";

const initLevel: DataItem[] = [
  { parent: "Home", name: "Home", type: "folder" },
];
const initData: DataItem[][] = [initLevel, []];
const initNavPoint: NavPoint = { level: 1, parent: "", itemName: "Home" };

interface State {
  data: DataItem[][];
  currNavPoint: NavPoint;
  navHistory: NavPoint[];
  currIndexInHistory: number;
  locationStrings: string[];
  locationItems: DataItem[];
  locationDataInfo: DataInfo;
  searchStr: string;
  foundItems: DataItem[];
  selectedItem: DataItem;

  addDataItem: (name: string, type: string, text?: string) => void;
  selectItem: (level: number, dataItem: DataItem, addToHistory?: boolean) => void;
  movePointInHistory: (newIndexInHistory: number) => void;
  
  performSearch: (searchStr: string) => void;
  setLocationStrings: () => void;
  updateFileText: (updatedText: string) => void;
  closeUpdateFile: () => void;
}

export const useDataStore = create<State>((set, get) => ({
  data: initData,
  currNavPoint: initNavPoint,
  navHistory: [initNavPoint],
  currIndexInHistory: 0,
  locationStrings: ["Home"],
  locationItems: [],
  locationDataInfo: { nFiles: 0, nFolders: 0 },
  selectedItem: initLevel[0],
  searchStr: "",
  foundItems: [],
  addDataItem: (name, type, text) => {
    const updatedData = handleAddDataItem(get().data, get().currNavPoint, name, type, text) || []
    set((state) => ({
      data: updatedData,
      locationItems: getCurrLocationData(updatedData, state.currNavPoint.level, state.currNavPoint.itemName),
      locationDataInfo: getLocationDataInfo(updatedData.slice(state.currNavPoint.level))
    }))
  },
  selectItem: (level, dataItem, addToHistory = true) => {
    const currNavPoint = { level, itemName: dataItem.name, parent: dataItem.parent };
    const navHistory = (addToHistory) ? addPointToHistory(get().navHistory, { ...currNavPoint }, get().currIndexInHistory) :  [...get().navHistory ];
    const currIndexInHistory = (addToHistory) ? get().currIndexInHistory + 1 : get().currIndexInHistory;
    const locationItems = getCurrLocationData(get().data, currNavPoint.level, currNavPoint.itemName);
    const locationDataInfo = getLocationDataInfo(get().data.slice(currNavPoint.level))
    const locationStrings = computeLocationStrings(get().data, currNavPoint)

    set((state) => ({
      currNavPoint,
      selectedItem: dataItem,
      navHistory,
      currIndexInHistory,
      locationItems,
      locationDataInfo,
      locationStrings
    }))
  },
  movePointInHistory: (newIndexInHistory) => {
    console.log("navHistory: ", get().navHistory);
    const currNavPoint = get().navHistory[newIndexInHistory];
    console.log("currNavPoint: ", currNavPoint);
    const locationItems = getCurrLocationData(get().data, currNavPoint.level, currNavPoint.itemName);
    const locationDataInfo = getLocationDataInfo(get().data.slice(currNavPoint.level))
    const locationStrings = computeLocationStrings(get().data, currNavPoint)

    set((state) => ({
      currIndexInHistory: newIndexInHistory,
      currNavPoint,
      locationItems,
      locationDataInfo,
      locationStrings
    }))
  },
  performSearch: (newSearchStr: string) => set((state) => ({
    searchStr: newSearchStr,
    foundItems: findMatchingItems([...state.data], newSearchStr)
  })),
  setLocationStrings: () =>
    set((state) => ({
      locationStrings: computeLocationStrings(state.data, state.currNavPoint)
    })),
  updateFileText: (updatedText:string) => 
    set((state) => ({
      selectedItem: {...state.selectedItem, text: updatedText}
    })),
  closeUpdateFile: () =>
    set((state) => ({
      data: updateItemInData(state.data, state.selectedItem, state.currNavPoint.level-1),
    })),
}));
