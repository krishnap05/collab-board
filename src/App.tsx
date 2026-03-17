import { useRef, useEffect, useState } from 'react'
import { Stage, Layer, Arrow as KonvaArrow } from 'react-konva'
import Konva from 'konva'
import { useBoard } from './hooks/useBoard'
import { useEditNote } from './hooks/useEditNote'
import { TOOLBAR_HEIGHT } from './constants'
import type { ToolMode } from './types'
import StickyNote from './components/StickyNote'
import BoardArrow from './components/BoardArrow'
import BoardTextBox from './components/BoardTextBox'
import Toolbar from './components/Toolbar'

function App() {
  const {
    notes, arrows, textBoxes,
    selectedId, status, drawingArrow,
    addNote, deleteNote, moveNote, resizeNote, selectNote, updateNoteText,
    startArrow, finishArrow,
    addTextBox, moveTextBox, updateTextBoxText,
    manualSave,
  } = useBoard()
  const { editingId, startEditing, stopEditing } = useEditNote()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [toolMode, setToolMode] = useState<ToolMode>('select')
  const [liveArrowEnd, setLiveArrowEnd] = useState<[number, number] | null>(null)
  const [editingTextId, setEditingTextId] = useState<number | null>(null)
  const textBoxTextareaRef = useRef<HTMLTextAreaElement>(null)

  const editingNote = editingId !== null ? notes.find(n => n.id === editingId) : null
  const editingTextBox = editingTextId !== null ? textBoxes.find(t => t.id === editingTextId) : null

  useEffect(() => {
    if (editingId !== null && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.select()
    }
  }, [editingId])

  useEffect(() => {
    if (editingTextId !== null && textBoxTextareaRef.current) {
      textBoxTextareaRef.current.focus()
      textBoxTextareaRef.current.select()
    }
  }, [editingTextId])

  const getPointerPos = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage()
    return stage?.getPointerPosition() ?? null
  }

  const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target !== e.currentTarget) return
    const pos = getPointerPos(e)
    if (!pos) return

    if (toolMode === 'arrow') {
      startArrow(pos.x, pos.y)
      setLiveArrowEnd([pos.x, pos.y])
    }
  }

  const handleStageMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (toolMode === 'arrow' && drawingArrow) {
      const pos = getPointerPos(e)
      if (pos) setLiveArrowEnd([pos.x, pos.y])
    }
  }

  const handleStageMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (toolMode === 'arrow' && drawingArrow) {
      const pos = getPointerPos(e)
      if (pos) finishArrow(pos.x, pos.y)
      setLiveArrowEnd(null)
    }
  }

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target !== e.currentTarget) return
    const pos = getPointerPos(e)
    if (!pos) return

    if (toolMode === 'select') {
      selectNote(null)
    } else if (toolMode === 'note') {
      addNote(pos.x - 100, pos.y - 60)
      setToolMode('select')
    } else if (toolMode === 'text') {
      addTextBox(pos.x, pos.y)
      setToolMode('select')
    }
  }

  const handleDelete = () => {
    if (selectedId !== null) deleteNote(selectedId)
  }

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <Toolbar
        activeTool={toolMode}
        onToolChange={setToolMode}
        onDelete={handleDelete}
        onSave={manualSave}
        canDelete={selectedId !== null}
        status={status}
      />
      <Stage
        width={window.innerWidth}
        height={window.innerHeight - TOOLBAR_HEIGHT}
        onClick={handleStageClick}
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
      >
        <Layer>
          {arrows.map(a => (
            <BoardArrow key={a.id} arrow={a} />
          ))}

          {drawingArrow && liveArrowEnd && (
            <KonvaArrow
              points={[drawingArrow[0], drawingArrow[1], liveArrowEnd[0], liveArrowEnd[1]]}
              stroke="#6366f1"
              strokeWidth={2}
              fill="#6366f1"
              pointerLength={10}
              pointerWidth={8}
              dash={[6, 3]}
            />
          )}

          {textBoxes.map(t => (
            <BoardTextBox
              key={t.id}
              textBox={t}
              isEditing={editingTextId === t.id}
              onDragEnd={(x, y) => moveTextBox(t.id, x, y)}
              onDoubleClick={() => setEditingTextId(t.id)}
            />
          ))}

          {notes.map(note => (
            <StickyNote
              key={note.id}
              note={note}
              isSelected={selectedId === note.id}
              isEditing={editingId === note.id}
              onSelect={() => selectNote(note.id)}
              onDragEnd={(x, y) => moveNote(note.id, x, y)}
              onDoubleClick={() => startEditing(note.id)}
              onResize={(w, h) => resizeNote(note.id, w, h)}
            />
          ))}
        </Layer>
      </Stage>

      {editingNote && (
        <textarea
          ref={textareaRef}
          defaultValue={editingNote.text}
          style={{
            position: 'absolute',
            left: editingNote.x + 20,
            top: editingNote.y + 20 + TOOLBAR_HEIGHT,
            width: editingNote.width - 40,
            height: editingNote.height - 40,
            fontSize: 14,
            border: 'none',
            outline: 'none',
            resize: 'none',
            background: 'transparent',
            color: '#1a1a2e',
            fontFamily: 'sans-serif',
            zIndex: 100,
          }}
          onChange={e => updateNoteText(editingNote.id, e.target.value)}
          onBlur={stopEditing}
          onKeyDown={e => { if (e.key === 'Escape') e.currentTarget.blur() }}
        />
      )}

      {editingTextBox && (
        <textarea
          ref={textBoxTextareaRef}
          defaultValue={editingTextBox.text}
          style={{
            position: 'absolute',
            left: editingTextBox.x,
            top: editingTextBox.y + TOOLBAR_HEIGHT,
            minWidth: 100,
            fontSize: editingTextBox.fontSize,
            border: '1px solid #6366f1',
            borderRadius: 4,
            outline: 'none',
            resize: 'none',
            background: '#1a1a2e',
            color: '#e2e8f0',
            fontFamily: 'sans-serif',
            padding: 4,
            zIndex: 100,
          }}
          onChange={e => updateTextBoxText(editingTextBox.id, e.target.value)}
          onBlur={() => setEditingTextId(null)}
          onKeyDown={e => { if (e.key === 'Escape') e.currentTarget.blur() }}
        />
      )}
    </div>
  )
}

export default App