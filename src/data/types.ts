export interface DataItem {
  name: string,
  type: string,
  parent: string,
  text?: string,
  level?: number
}

export interface DataInfo {
  nFiles: number,
  nFolders: number
}

export interface NavPoint {
  level: number,
  parent: string,
  itemName: string
}
