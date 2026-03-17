import { useState } from 'react'
import type { TextBox } from '../types'

let nextTextId = 1

export function useTextBoxes() {
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([])

  const addTextBox = (x: number, y: number) => {
    setTextBoxes(prev => [...prev, { id: nextTextId++, x, y, text: 'Text', fontSize: 18 }])
  }

  const moveTextBox = (id: number, x: number, y: number) => {
    setTextBoxes(prev =>
      prev.map(t => (t.id === id ? { ...t, x, y } : t))
    )
  }

  const updateTextBoxText = (id: number, text: string) => {
    setTextBoxes(prev =>
      prev.map(t => (t.id === id ? { ...t, text } : t))
    )
  }

  const deleteTextBox = (id: number) => {
    setTextBoxes(prev => prev.filter(t => t.id !== id))
  }

  return {
    textBoxes,
    addTextBox,
    moveTextBox,
    updateTextBoxText,
    deleteTextBox,
  }
}
