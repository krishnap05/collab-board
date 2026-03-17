export interface StickyNote {
  id: number
  x: number
  y: number
  text: string
  color: string
}

export interface Board {
  id: string
  name: string
  notes: StickyNote[]
  createdAt: string
  updatedAt: string
}