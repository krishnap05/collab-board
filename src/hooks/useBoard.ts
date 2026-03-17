import { useState } from 'react'
import type { StickyNote } from '../types'
import { COLORS, NOTE_WIDTH, NOTE_HEIGHT } from '../constants'

let nextId = 3

const initialNotes: StickyNote[] = [
  { id: 1, x: 100, y: 100, width: NOTE_WIDTH, height: NOTE_HEIGHT, text: 'Double click canvas to add a note', color: '#ffffff' },
  { id: 2, x: 350, y: 200, width: NOTE_WIDTH, height: NOTE_HEIGHT, text: 'Drag me around!', color: '#fef08a' },
]

export function useBoard() {
  const [notes, setNotes] = useState<StickyNote[]>(initialNotes)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const addNote = (x: number, y: number) => {
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)]
    const newNote: StickyNote = {
      id: nextId++,
      x,
      y,
      width: NOTE_WIDTH,
      height: NOTE_HEIGHT,
      text: 'New note',
      color: randomColor,
    }
    setNotes(prev => [...prev, newNote])
  }

  const deleteNote = (id: number) => {
    setNotes(prev => prev.filter(note => note.id !== id))
    setSelectedId(null)
  }

  const moveNote = (id: number, x: number, y: number) => {
    setNotes(prev =>
      prev.map(note => (note.id === id ? { ...note, x, y } : note))
    )
  }

  const resizeNote = (id: number, width: number, height: number) => {
    setNotes(prev =>
      prev.map(note => (note.id === id ? { ...note, width, height } : note))
    )
  }

  const selectNote = (id: number | null) => {
    setSelectedId(prev => (prev === id ? null : id))
  }

  const updateNoteText = (id: number, text: string) => {
    setNotes(prev =>
      prev.map(note => (note.id === id ? { ...note, text } : note))
    )
  }

  return {
    notes,
    selectedId,
    addNote,
    deleteNote,
    moveNote,
    resizeNote,
    selectNote,
    updateNoteText,
  }
}