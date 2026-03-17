export interface StickyNote {
  id: number
  x: number
  y: number
  width: number
  height: number
  text: string
  color: string
}

export interface Arrow {
  id: number
  points: [number, number, number, number]
}

export interface TextBox {
  id: number
  x: number
  y: number
  text: string
  fontSize: number
}

export type ToolMode = 'select' | 'note' | 'arrow' | 'text'