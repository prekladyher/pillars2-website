export interface NodeType {
  id: string,
  label?: string,
  position: {
    x: number,
    y: number
  },
  [key: string]: any
}

export interface EdgeType {
  id: string,
  source: string,
  target: string,
  [key: string]: any
}

export interface GraphType {
  nodes: NodeType[],
  edges: EdgeType[]
}
