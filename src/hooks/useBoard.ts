import { useState, useEffect, useRef, useCallback } from 'react'
import type { StickyNote, Arrow, TextBox } from '../types'
import { COLORS, NOTE_WIDTH, NOTE_HEIGHT } from '../constants'
import { createBoard, getLatestBoard, saveBoard } from '../services/api'
import { useUser } from '@clerk/clerk-react'

let nextNoteId = 1
let nextArrowId = 1
let nextTextId = 1

export function useBoard() {
  const [notes, setNotes] = useState<StickyNote[]>([])
  const [arrows, setArrows] = useState<Arrow[]>([])
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [boardId, setBoardId] = useState<string | null>(null)
  const [status, setStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const notesRef = useRef(notes)
  const arrowsRef = useRef(arrows)
  const textBoxesRef = useRef(textBoxes)
  const { user } = useUser()

  useEffect(() => { notesRef.current = notes }, [notes])
  useEffect(() => { arrowsRef.current = arrows }, [arrows])
  useEffect(() => { textBoxesRef.current = textBoxes }, [textBoxes])

  useEffect(() => {
    async function init() {
      if (!user?.id) return
      const existing = await getLatestBoard(user.id)
      if (existing) {
        setBoardId(existing.id)
        const loadedNotes: StickyNote[] = existing.notes || []
        const loadedArrows: Arrow[] = existing.arrows || []
        const loadedTextBoxes: TextBox[] = existing.textBoxes || []
        setNotes(loadedNotes)
        setArrows(loadedArrows)
        setTextBoxes(loadedTextBoxes)
        if (loadedNotes.length > 0) nextNoteId = Math.max(...loadedNotes.map(n => n.id)) + 1
        if (loadedArrows.length > 0) nextArrowId = Math.max(...loadedArrows.map(a => a.id)) + 1
        if (loadedTextBoxes.length > 0) nextTextId = Math.max(...loadedTextBoxes.map(t => t.id)) + 1
      } else {
        const board = await createBoard('My Board', user.id)
        setBoardId(board.id)
      }
    }
    init()
  }, [user?.id])

  const triggerAutoSave = useCallback(() => {
    setStatus('unsaved')
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      const id = boardId
      if (!id || !user?.id) return
      setStatus('saving')
      await saveBoard(id, notesRef.current, arrowsRef.current, textBoxesRef.current, user.id)
      setStatus('saved')
    }, 2000)
  }, [boardId, user?.id])

  const addNote = (x: number, y: number) => {
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)]
    const newNote: StickyNote = {
      id: nextNoteId++,
      x, y,
      width: NOTE_WIDTH,
      height: NOTE_HEIGHT,
      text: 'New note',
      color: randomColor,
    }
    setNotes(prev => [...prev, newNote])
    triggerAutoSave()
  }

  const deleteNote = (id: number) => {
    setNotes(prev => prev.filter(note => note.id !== id))
    setSelectedId(null)
    triggerAutoSave()
  }

  const moveNote = (id: number, x: number, y: number) => {
    setNotes(prev => prev.map(note => note.id === id ? { ...note, x, y } : note))
    triggerAutoSave()
  }

  const resizeNote = (id: number, width: number, height: number) => {
    setNotes(prev => prev.map(note => note.id === id ? { ...note, width, height } : note))
    triggerAutoSave()
  }

  const selectNote = (id: number | null) => {
    setSelectedId(prev => (prev === id ? null : id))
  }

  const updateNoteText = (id: number, text: string) => {
    setNotes(prev => prev.map(note => note.id === id ? { ...note, text } : note))
    triggerAutoSave()
  }

  const [drawingArrow, setDrawingArrow] = useState<[number, number] | null>(null)

  const startArrow = (x: number, y: number) => {
    setDrawingArrow([x, y])
  }

  const finishArrow = (x: number, y: number) => {
    if (!drawingArrow) return
    const [sx, sy] = drawingArrow
    if (Math.abs(x - sx) > 5 || Math.abs(y - sy) > 5) {
      setArrows(prev => [...prev, { id: nextArrowId++, points: [sx, sy, x, y] }])
      triggerAutoSave()
    }
    setDrawingArrow(null)
  }

  const cancelArrow = () => {
    setDrawingArrow(null)
  }

  const addTextBox = (x: number, y: number) => {
    setTextBoxes(prev => [...prev, { id: nextTextId++, x, y, text: 'Text', fontSize: 18 }])
    triggerAutoSave()
  }

  const moveTextBox = (id: number, x: number, y: number) => {
    setTextBoxes(prev => prev.map(t => t.id === id ? { ...t, x, y } : t))
    triggerAutoSave()
  }

  const updateTextBoxText = (id: number, text: string) => {
    setTextBoxes(prev => prev.map(t => t.id === id ? { ...t, text } : t))
    triggerAutoSave()
  }

  const manualSave = useCallback(async () => {
    if (!boardId || !user?.id) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    setStatus('saving')
    await saveBoard(boardId, notesRef.current, arrowsRef.current, textBoxesRef.current, user.id)
    setStatus('saved')
  }, [boardId, user?.id])

  return {
    notes, arrows, textBoxes,
    selectedId, boardId, status,
    drawingArrow,
    addNote, deleteNote, moveNote, resizeNote, selectNote, updateNoteText,
    startArrow, finishArrow, cancelArrow,
    addTextBox, moveTextBox, updateTextBoxText,
    manualSave,
  }
}