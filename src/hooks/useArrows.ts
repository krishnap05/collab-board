import { useState } from 'react'
import type { Arrow } from '../types'

let nextArrowId = 1

export function useArrows() {
  const [arrows, setArrows] = useState<Arrow[]>([])
  const [drawingArrow, setDrawingArrow] = useState<[number, number] | null>(null)

  const startArrow = (x: number, y: number) => {
    setDrawingArrow([x, y])
  }

  const finishArrow = (x: number, y: number) => {
    if (!drawingArrow) return
    const [sx, sy] = drawingArrow
    // only create if it has some length
    if (Math.abs(x - sx) > 5 || Math.abs(y - sy) > 5) {
      setArrows(prev => [...prev, { id: nextArrowId++, points: [sx, sy, x, y] }])
    }
    setDrawingArrow(null)
  }

  const cancelArrow = () => {
    setDrawingArrow(null)
  }

  const deleteArrow = (id: number) => {
    setArrows(prev => prev.filter(a => a.id !== id))
  }

  return {
    arrows,
    drawingArrow,
    startArrow,
    finishArrow,
    cancelArrow,
    deleteArrow,
  }
}
