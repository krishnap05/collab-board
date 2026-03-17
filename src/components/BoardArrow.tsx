import { Arrow as KonvaArrow } from 'react-konva'
import type { Arrow as ArrowType } from '../types'

interface Props {
  arrow: ArrowType
}

function BoardArrow({ arrow }: Props) {
  return (
    <KonvaArrow
      points={arrow.points}
      stroke="#94a3b8"
      strokeWidth={2}
      fill="#94a3b8"
      pointerLength={10}
      pointerWidth={8}
      hitStrokeWidth={12}
    />
  )
}

export default BoardArrow
