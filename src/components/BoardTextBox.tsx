import { Group, Text } from 'react-konva'
import type { TextBox as TextBoxType } from '../types'

interface Props {
  textBox: TextBoxType
  isEditing: boolean
  onDragEnd: (x: number, y: number) => void
  onDoubleClick: () => void
}

function BoardTextBox({ textBox, isEditing, onDragEnd, onDoubleClick }: Props) {
  return (
    <Group
      x={textBox.x}
      y={textBox.y}
      draggable={!isEditing}
      onDragEnd={e => onDragEnd(e.target.x(), e.target.y())}
      onDblClick={onDoubleClick}
    >
      {!isEditing && (
        <Text
          text={textBox.text}
          fontSize={textBox.fontSize}
          fill="#e2e8f0"
          padding={4}
        />
      )}
    </Group>
  )
}

export default BoardTextBox
