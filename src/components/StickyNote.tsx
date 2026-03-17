import { Group, Rect, Text } from 'react-konva'
import type { StickyNote as StickyNoteType } from '../types'
import { NOTE_MIN_WIDTH, NOTE_MIN_HEIGHT } from '../constants'

interface Props {
  note: StickyNoteType
  isSelected: boolean
  isEditing: boolean
  onSelect: () => void
  onDragEnd: (x: number, y: number) => void
  onDoubleClick: () => void
  onResize: (width: number, height: number) => void
}

function StickyNote({
  note,
  isSelected,
  isEditing,
  onSelect,
  onDragEnd,
  onDoubleClick,
  onResize,
}: Props) {
  const handleSize = 12

  return (
    <Group
      x={note.x}
      y={note.y}
      draggable={!isEditing}
      onClick={onSelect}
      onDragEnd={e => onDragEnd(e.target.x(), e.target.y())}
      onDblClick={onDoubleClick}
    >
      <Rect
        width={note.width}
        height={note.height}
        fill={note.color}
        cornerRadius={8}
        shadowBlur={isSelected ? 20 : 10}
        shadowColor={isSelected ? '#6366f1' : '#000000'}
        shadowOpacity={isSelected ? 0.8 : 0.2}
        strokeWidth={isSelected ? 2 : 0}
        stroke="#6366f1"
      />
      {!isEditing && (
        <Text
          x={20}
          y={20}
          width={note.width - 40}
          height={note.height - 40}
          text={note.text}
          fontSize={14}
          fill="#1a1a2e"
        />
      )}
      {isSelected && (
        <Rect
          x={note.width - handleSize}
          y={note.height - handleSize}
          width={handleSize}
          height={handleSize}
          fill="#6366f1"
          cornerRadius={2}
          draggable
          onDragMove={e => {
            const node = e.target
            const newW = Math.max(NOTE_MIN_WIDTH, node.x() + handleSize)
            const newH = Math.max(NOTE_MIN_HEIGHT, node.y() + handleSize)
            onResize(newW, newH)
            // keep handle pinned to corner
            node.x(newW - handleSize)
            node.y(newH - handleSize)
          }}
          onDragEnd={e => {
            // prevent group from also firing dragEnd
            e.cancelBubble = true
          }}
          onMouseEnter={e => {
            const stage = e.target.getStage()
            if (stage) stage.container().style.cursor = 'nwse-resize'
          }}
          onMouseLeave={e => {
            const stage = e.target.getStage()
            if (stage) stage.container().style.cursor = 'default'
          }}
        />
      )}
    </Group>
  )
}

export default StickyNote